import { useState, useEffect, useCallback, useRef } from 'react';
import Orb from './components/Orb';
import SpeechBubble from './components/SpeechBubble';
import Timer from './components/Timer';
import { useDrag } from './hooks/useDrag';
import { PomodoroTimer, TimerMode } from './services/timer';
import { getLLMComment } from './services/llm';
import { readState, updateState, DevOrbState } from './services/state';
import './styles/orb.css';

function App() {
  const [animation, setAnimation] = useState<'idle' | 'happy' | 'snack'>('idle');
  const [timerMode, setTimerMode] = useState<TimerMode>('off');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [message, setMessage] = useState('');
  const [state, setState] = useState<DevOrbState | null>(null);

  const timerRef = useRef<PomodoroTimer | null>(null);
  const workStartTimeRef = useRef<number>(Date.now());
  const longWorkCheckIntervalRef = useRef<number | null>(null);

  const { handleMouseDown } = useDrag();

  // Initialize state and timer
  useEffect(() => {
    const init = async () => {
      const loadedState = await readState();
      setState(loadedState);
    };
    init();

    // Set up long work check (1 hour)
    workStartTimeRef.current = Date.now();
    longWorkCheckIntervalRef.current = window.setInterval(async () => {
      const minutesWorked = Math.floor(
        (Date.now() - workStartTimeRef.current) / 60000
      );
      if (minutesWorked >= 60) {
        const comment = await getLLMComment({
          focusMinutes: minutesWorked,
          restMinutes: 0,
          sessionCount: state?.focus_sessions || 0,
        });
        setMessage(comment);
        workStartTimeRef.current = Date.now(); // Reset
      }
    }, 60000);

    return () => {
      if (longWorkCheckIntervalRef.current) {
        clearInterval(longWorkCheckIntervalRef.current);
      }
    };
  }, []);

  // Create timer with callbacks
  useEffect(() => {
    timerRef.current = new PomodoroTimer({
      focusMinutes: 25,
      breakMinutes: 5,
      onTick: (seconds) => setTimeRemaining(seconds),
      onFocusEnd: async () => {
        setTimerMode('off');
        setAnimation('happy');
        setTimeout(() => setAnimation('idle'), 500);

        const newState = await updateState({
          focus_sessions: (state?.focus_sessions || 0) + 1,
          last_focus_minutes: 25,
          mood: 'content',
        });
        setState(newState);

        const comment = await getLLMComment({
          focusMinutes: 25,
          restMinutes: 0,
          sessionCount: newState.focus_sessions,
        });
        setMessage(comment);
      },
      onBreakEnd: async () => {
        setTimerMode('off');
        setAnimation('happy');
        setTimeout(() => setAnimation('idle'), 500);

        const newState = await updateState({
          rest_sessions: (state?.rest_sessions || 0) + 1,
          mood: 'refreshed',
          energy: Math.min(100, (state?.energy || 70) + 10),
        });
        setState(newState);

        const comment = await getLLMComment({
          focusMinutes: 0,
          restMinutes: 5,
          sessionCount: newState.focus_sessions,
        });
        setMessage(comment);
      },
    });

    return () => {
      timerRef.current?.stop();
    };
  }, [state]);

  const handleStartFocus = useCallback(() => {
    timerRef.current?.startFocus();
    setTimerMode('focus');
    setTimeRemaining(25 * 60);
  }, []);

  const handleStartBreak = useCallback(() => {
    timerRef.current?.startBreak();
    setTimerMode('break');
    setTimeRemaining(5 * 60);
  }, []);

  const handleStop = useCallback(() => {
    timerRef.current?.stop();
    setTimerMode('off');
    setTimeRemaining(0);
  }, []);

  const handlePat = useCallback(async () => {
    setAnimation('happy');
    setTimeout(() => setAnimation('idle'), 400);

    // Increase energy on pat
    if (state) {
      const newState = await updateState({
        energy: Math.min(100, state.energy + 2),
        mood: 'happy',
      });
      setState(newState);
    }
  }, [state]);

  const handleSnackDrop = useCallback(async () => {
    setAnimation('snack');
    setTimeout(() => setAnimation('idle'), 500);

    // Restore energy on snack
    if (state) {
      const newState = await updateState({
        energy: Math.min(100, state.energy + 15),
        mood: 'content',
      });
      setState(newState);
    }
  }, [state]);

  const handleMessageComplete = useCallback(() => {
    setMessage('');
  }, []);

  const formatTimeDisplay = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container" onMouseDown={handleMouseDown}>
      <Orb
        animation={animation}
        timerMode={timerMode}
        timerDisplay={timerMode !== 'off' ? formatTimeDisplay(timeRemaining) : undefined}
        onPat={handlePat}
        onSnackDrop={handleSnackDrop}
      />
      {message && (
        <SpeechBubble message={message} onComplete={handleMessageComplete} />
      )}
      <Timer
        mode={timerMode}
        timeRemaining={timeRemaining}
        onStartFocus={handleStartFocus}
        onStartBreak={handleStartBreak}
        onStop={handleStop}
      />
    </div>
  );
}

export default App;
