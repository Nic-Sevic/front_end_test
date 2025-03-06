import './styles/index.css';
import RootComponent from './components/App';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<RootComponent />);

