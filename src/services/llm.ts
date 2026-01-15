import { invoke } from '@tauri-apps/api/core';

interface LLMContext {
    focusMinutes: number;
    restMinutes: number;
    sessionCount: number;
}

const getApiKey = (): string => {
    // First try to get from environment, then from localStorage
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envKey) return envKey;

    const storedKey = localStorage.getItem('openai_api_key');
    return storedKey || '';
};

export const setApiKey = (key: string): void => {
    localStorage.setItem('openai_api_key', key);
};

export const hasApiKey = (): boolean => {
    return getApiKey().length > 0;
};

export const getLLMComment = async (context: LLMContext): Promise<string> => {
    const apiKey = getApiKey();

    if (!apiKey) {
        // Fallback messages when no API key
        const fallbackMessages = [
            '잠시 쉬어가세요 ☕',
            '좋은 흐름이에요!',
            '오늘도 화이팅!',
            '집중 시간이 끝났어요.',
            '휴식도 실력이에요.',
        ];
        return fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    }

    const currentTime = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    try {
        const comment = await invoke<string>('get_llm_comment', {
            focusMinutes: context.focusMinutes,
            restMinutes: context.restMinutes,
            sessionCount: context.sessionCount,
            currentTime,
            apiKey,
        });

        return comment;
    } catch (error) {
        console.error('LLM API error:', error);
        return '잠시 쉬어가세요 ☕';
    }
};

export type { LLMContext };
