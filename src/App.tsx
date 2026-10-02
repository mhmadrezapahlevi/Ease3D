import { useAppStore } from './store';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import Studio3D from './pages/Studio3D';
import TripoStudio from './pages/TripoStudio';
import ImageStudio from './pages/ImageStudio';
import TextTo3D from './pages/TextTo3D';
import CompareEngines from './pages/CompareEngines';
import FreeConverter from './pages/FreeConverter';
import StyleConvert from './pages/StyleConvert';
import Guides from './pages/Guides';

function App() {
  const { currentPage } = useAppStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'studio3d': return <Studio3D />;
      case 'tripo-studio': return <TripoStudio />;
      case 'image-studio': return <ImageStudio />;
      case 'text-to-3d': return <TextTo3D />;
      case 'compare': return <CompareEngines />;
      case 'converter': return <FreeConverter />;
      case 'style-convert': return <StyleConvert />;
      case 'guides': return <Guides />;
      default: return <HomePage />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export default App;
