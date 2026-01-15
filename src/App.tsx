import { useState } from 'react';
import Orb from './components/Orb';
import './styles/orb.css';

function App() {
  const [animation, setAnimation] = useState<'idle' | 'happy' | 'snack'>('idle');

  const handlePat = () => {
    setAnimation('happy');
    setTimeout(() => setAnimation('idle'), 400);
  };

  const handleSnackDrop = () => {
    setAnimation('snack');
    setTimeout(() => setAnimation('idle'), 500);
  };

  return (
    <div className="app-container">
      <Orb
        animation={animation}
        timerMode="off"
        onPat={handlePat}
        onSnackDrop={handleSnackDrop}
      />
    </div>
  );
}

export default App;
