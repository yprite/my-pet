import { useState } from 'react';
import Orb from './components/Orb';
import { useDrag } from './hooks/useDrag';
import './styles/orb.css';

function App() {
  const [animation, setAnimation] = useState<'idle' | 'happy' | 'snack'>('idle');
  const { handleMouseDown } = useDrag();

  const handlePat = () => {
    setAnimation('happy');
    setTimeout(() => setAnimation('idle'), 400);
  };

  const handleSnackDrop = () => {
    setAnimation('snack');
    setTimeout(() => setAnimation('idle'), 500);
  };

  return (
    <div className="app-container" onMouseDown={handleMouseDown}>
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
