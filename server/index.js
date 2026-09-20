import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import multer from 'multer';
import FormData from 'form-data';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const TRIPO_API_KEY = process.env.TRIPO_API_KEY;

// Base URLs
const TRIPO_API_BASE = 'https://api.tripo3d.ai/v2/openapi';
const TRIPO_UPLOAD_URL = 'https://api.tripo3d.ai/v2/openapi/upload';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Tripo AI Backend is running',
    apiKeyConfigured: !!TRIPO_API_KEY
  });
});

// ============================================
// PROXY MODEL FILE (Fix CORS Issue)
// ============================================
app.get('/api/proxy-model', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('📥 Proxying model from:', url);

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 60000 // 60 seconds timeout
    });

    // Set correct headers for GLB file
    res.setHeader('Content-Type', 'model/gltf-binary');
    res.setHeader('Content-Disposition', 'attachment; filename="model.glb"');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.send(response.data);
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({
      error: 'Failed to proxy model',
      details: error.message
    });
  }
});

// ============================================
// UPLOAD IMAGE
// ============================================
async function uploadImage(imageBuffer, fileType = 'png') {
  try {
    // Step 1: Get upload token
    const tokenResponse = await axios.post(
      TRIPO_UPLOAD_URL,
      {},
      {
        headers: {
          'Authorization': `Bearer ${TRIPO_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('📤 Upload token response:', JSON.stringify(tokenResponse.data, null, 2));

    const uploadToken = tokenResponse.data.data.token;
    const uploadUrl = tokenResponse.data.data.upload_url;

    // Step 2: Upload image to S3
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: `image.${fileType}`,
      contentType: `image/${fileType}`
    });

    await axios.post(uploadUrl, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log('✅ Image uploaded successfully');
    return uploadToken;
  } catch (error) {
    console.error('❌ Upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload image');
  }
}

// ============================================
// CREATE TASK
// ============================================
async function createTask(taskData) {
  try {
    console.log('📝 Creating task with data:', JSON.stringify(taskData, null, 2));

    const response = await axios.post(
      `${TRIPO_API_BASE}/task`,
      taskData,
      {
        headers: {
          'Authorization': `Bearer ${TRIPO_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Task created response:', JSON.stringify(response.data, null, 2));

    return response.data.data.task_id;
  } catch (error) {
    console.error('❌ Create task error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create task');
  }
}

// ============================================
// POLL TASK STATUS
// ============================================
async function pollTaskStatus(taskId, onProgress) {
  let attempts = 0;
  const maxAttempts = 120; // 10 minutes max

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Poll every 2 seconds

    try {
      const response = await axios.get(
        `${TRIPO_API_BASE}/task/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${TRIPO_API_KEY}`
          }
        }
      );

      const taskData = response.data.data;
      const status = taskData.status;
      const progress = taskData.progress || 0;

      console.log(`📊 Task ${taskId}: ${status} (${progress}%)`);

      if (onProgress) {
        onProgress({ status, progress, taskData });
      }

      if (status === 'success') {
        console.log('✅ Task completed! Output:', JSON.stringify(taskData.output, null, 2));
        return taskData;
      } else if (status === 'failed') {
        throw new Error(taskData.error || 'Generation failed');
      }

      attempts++;
    } catch (error) {
      if (error.message.includes('Generation failed')) {
        throw error;
      }
      console.error('❌ Poll error:', error.message);
      attempts++;
    }
  }

  throw new Error('Generation timeout');
}

// ============================================
// TEXT TO 3D
// ============================================
app.post('/api/tripo/text-to-3d', async (req, res) => {
  try {
    if (!TRIPO_API_KEY) {
      return res.status(500).json({ error: 'Tripo API key not configured' });
    }

    const {
      prompt,
      negativePrompt = '',
      modelVersion = 'v3.1-20260211',
      texture = true,
      pbr = true,
      faceLimit
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('🎨 Starting Tripo text-to-3d generation...');
    console.log(`   Prompt: "${prompt}"`);
    console.log(`   Model: ${modelVersion}`);

    // Create task
    const taskData = {
      type: 'text_to_model',
      model_version: modelVersion,
      prompt,
      texture,
      pbr,
    };

    if (negativePrompt) {
      taskData.negative_prompt = negativePrompt;
    }

    if (faceLimit) {
      taskData.face_limit = faceLimit;
    }

    const taskId = await createTask(taskData);
    console.log(`✅ Task created: ${taskId}`);

    // Poll for completion
    const result = await pollTaskStatus(taskId);

    console.log('✅ Generation complete!');

    // Return result with proxy URLs
    const response = {
      success: true,
      taskId: taskId,
      modelUrl: result.output?.model_url ? `/api/proxy-model?url=${encodeURIComponent(result.output.model_url)}` : null,
      originalModelUrl: result.output?.model_url,
      renderedImageUrl: result.output?.rendered_image_url,
      baseModelUrl: result.output?.base_model_url,
    };

    console.log('📤 Sending response:', JSON.stringify(response, null, 2));

    res.json(response);

  } catch (error) {
    console.error('❌ Tripo API error:', error.message);
    res.status(500).json({
      error: 'Generation failed',
      details: error.message
    });
  }
});

// ============================================
// IMAGE TO 3D
// ============================================
app.post('/api/tripo/image-to-3d', upload.single('image'), async (req, res) => {
  try {
    if (!TRIPO_API_KEY) {
      return res.status(500).json({ error: 'Tripo API key not configured' });
    }

    const {
      modelVersion = 'v3.1-20260211',
      texture = true,
      pbr = true,
      faceLimit,
      enableImageAutofix = false
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('🎨 Starting Tripo image-to-3d generation...');
    console.log(`   Model: ${modelVersion}`);

    // Upload image
    const fileType = req.file.mimetype.split('/')[1] || 'png';
    const uploadToken = await uploadImage(req.file.buffer, fileType);
    console.log(`✅ Image uploaded: ${uploadToken}`);

    // Create task
    const taskData = {
      type: 'image_to_model',
      model_version: modelVersion,
      file: {
        type: fileType,
        file_token: uploadToken
      },
      texture,
      pbr,
      enable_image_autofix: enableImageAutofix
    };

    if (faceLimit) {
      taskData.face_limit = faceLimit;
    }

    const taskId = await createTask(taskData);
    console.log(`✅ Task created: ${taskId}`);

    // Poll for completion
    const result = await pollTaskStatus(taskId);

    console.log('✅ Generation complete!');

    // Return result with proxy URLs
    const response = {
      success: true,
      taskId: taskId,
      modelUrl: result.output?.model_url ? `/api/proxy-model?url=${encodeURIComponent(result.output.model_url)}` : null,
      originalModelUrl: result.output?.model_url,
      renderedImageUrl: result.output?.rendered_image_url,
      baseModelUrl: result.output?.base_model_url,
    };

    console.log('📤 Sending response:', JSON.stringify(response, null, 2));

    res.json(response);

  } catch (error) {
    console.error('❌ Tripo API error:', error.message);
    res.status(500).json({
      error: 'Generation failed',
      details: error.message
    });
  }
});

// ============================================
// GET TASK STATUS
// ============================================
app.get('/api/tripo/task/:taskId', async (req, res) => {
  try {
    if (!TRIPO_API_KEY) {
      return res.status(500).json({ error: 'Tripo API key not configured' });
    }

    const { taskId } = req.params;

    const response = await axios.get(
      `${TRIPO_API_BASE}/task/${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${TRIPO_API_KEY}`
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error('❌ Tripo API error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to get task status',
      details: error.response?.data?.message || error.message
    });
  }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`   Tripo AI Backend running on port ${PORT}`);
  console.log('============================================');
  console.log(`   Frontend: http://localhost:5173`);
  console.log(`   Backend:  http://localhost:${PORT}`);
  console.log(`   API Key:  ${TRIPO_API_KEY ? '✅ Configured' : '❌ NOT SET'}`);
  console.log('============================================');
  console.log('');

  if (!TRIPO_API_KEY) {
    console.log('⚠️  WARNING: TRIPO_API_KEY is not set!');
    console.log('   Get your API key from: https://platform.tripo3d.ai/api-keys');
    console.log('   Then add it to server/.env file');
    console.log('');
  }
});
