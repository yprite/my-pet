import { invoke } from '@tauri-apps/api/core';

export interface DevOrbState {
    mood: string;
    energy: number;
    focus_sessions: number;
    rest_sessions: number;
    last_focus_minutes: number;
}

const defaultState: DevOrbState = {
    mood: 'neutral',
    energy: 70,
    focus_sessions: 0,
    rest_sessions: 0,
    last_focus_minutes: 25,
};

export const readState = async (): Promise<DevOrbState> => {
    try {
        const state = await invoke<DevOrbState>('read_state');
        return state;
    } catch (error) {
        console.error('Failed to read state:', error);
        return defaultState;
    }
};

export const writeState = async (state: DevOrbState): Promise<void> => {
    try {
        await invoke('write_state', { state });
    } catch (error) {
        console.error('Failed to write state:', error);
    }
};

export const updateState = async (
    updates: Partial<DevOrbState>
): Promise<DevOrbState> => {
    const currentState = await readState();
    const newState = { ...currentState, ...updates };
    await writeState(newState);
    return newState;
};
