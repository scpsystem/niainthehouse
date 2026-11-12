import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { initSpeech } from './game/speech';

initSpeech();
createRoot(document.getElementById('root')!).render(<App />);
