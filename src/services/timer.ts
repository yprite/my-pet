type TimerMode = 'focus' | 'break' | 'off';
type TimerCallback = () => void;

interface TimerConfig {
    focusMinutes: number;
    breakMinutes: number;
    onFocusEnd?: TimerCallback;
    onBreakEnd?: TimerCallback;
    onTick?: (secondsRemaining: number) => void;
}

class PomodoroTimer {
    private intervalId: number | null = null;
    private secondsRemaining: number = 0;
    private mode: TimerMode = 'off';
    private config: TimerConfig;
    private workStartTime: number | null = null;

    constructor(config: Partial<TimerConfig> = {}) {
        this.config = {
            focusMinutes: config.focusMinutes || 25,
            breakMinutes: config.breakMinutes || 5,
            onFocusEnd: config.onFocusEnd,
            onBreakEnd: config.onBreakEnd,
            onTick: config.onTick,
        };
    }

    startFocus(): void {
        this.stop();
        this.mode = 'focus';
        this.secondsRemaining = this.config.focusMinutes * 60;
        this.workStartTime = Date.now();
        this.startInterval();
    }

    startBreak(): void {
        this.stop();
        this.mode = 'break';
        this.secondsRemaining = this.config.breakMinutes * 60;
        this.startInterval();
    }

    stop(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.mode = 'off';
        this.secondsRemaining = 0;
        this.workStartTime = null;
    }

    private startInterval(): void {
        this.intervalId = window.setInterval(() => {
            this.secondsRemaining--;

            if (this.config.onTick) {
                this.config.onTick(this.secondsRemaining);
            }

            if (this.secondsRemaining <= 0) {
                const currentMode = this.mode;
                this.stop();

                if (currentMode === 'focus' && this.config.onFocusEnd) {
                    this.config.onFocusEnd();
                } else if (currentMode === 'break' && this.config.onBreakEnd) {
                    this.config.onBreakEnd();
                }
            }
        }, 1000);
    }

    getMode(): TimerMode {
        return this.mode;
    }

    getSecondsRemaining(): number {
        return this.secondsRemaining;
    }

    getWorkDurationMinutes(): number {
        if (!this.workStartTime) return 0;
        return Math.floor((Date.now() - this.workStartTime) / 60000);
    }

    updateConfig(config: Partial<TimerConfig>): void {
        this.config = { ...this.config, ...config };
    }
}

export { PomodoroTimer };
export type { TimerMode, TimerConfig, TimerCallback };
