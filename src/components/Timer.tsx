import React from 'react';

interface TimerProps {
    mode: 'focus' | 'break' | 'off';
    timeRemaining: number;
    onStartFocus: () => void;
    onStartBreak: () => void;
    onStop: () => void;
}

const Timer: React.FC<TimerProps> = ({
    mode,
    timeRemaining,
    onStartFocus,
    onStartBreak,
    onStop,
}) => {
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer-controls">
            {mode === 'off' ? (
                <>
                    <button
                        className="timer-btn"
                        onClick={onStartFocus}
                        title="Start Focus (25min)"
                    >
                        ▶ Focus
                    </button>
                </>
            ) : (
                <>
                    <button className="timer-btn active">
                        {mode === 'focus' ? '🎯' : '☕'} {formatTime(timeRemaining)}
                    </button>
                    <button className="timer-btn" onClick={onStop} title="Stop">
                        ■
                    </button>
                </>
            )}
        </div>
    );
};

export default Timer;
