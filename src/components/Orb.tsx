import React, { useState, useCallback } from 'react';

interface OrbProps {
  animation: 'idle' | 'happy' | 'snack';
  timerMode: 'focus' | 'break' | 'off';
  timerDisplay?: string;
  onPat?: () => void;
  onSnackDrop?: () => void;
}

const Orb: React.FC<OrbProps> = ({
  animation = 'idle',
  timerMode = 'off',
  timerDisplay,
  onPat,
  onSnackDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = useCallback(() => {
    if (onPat) {
      onPat();
    }
  }, [onPat]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (onSnackDrop) {
      onSnackDrop();
    }
  }, [onSnackDrop]);

  const getTimerIndicatorClass = () => {
    switch (timerMode) {
      case 'focus':
        return 'timer-indicator';
      case 'break':
        return 'timer-indicator break';
      default:
        return 'timer-indicator off';
    }
  };

  return (
    <div className="orb-wrapper">
      <div
        className={`orb ${animation !== 'idle' ? animation : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="eye-container">
          <div className="eye">
            <div className="pupil" />
          </div>
        </div>
        {timerDisplay && (
          <div className="timer-display">{timerDisplay}</div>
        )}
        <div className={`snack-zone ${isDragOver ? 'active' : ''}`} />
      </div>
      <div className={getTimerIndicatorClass()} />
    </div>
  );
};

export default Orb;
