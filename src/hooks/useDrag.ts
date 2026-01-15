import { useCallback, useRef } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';

interface UseDragOptions {
    onDragStart?: () => void;
    onDragEnd?: () => void;
}

export const useDrag = (options: UseDragOptions = {}) => {
    const isDragging = useRef(false);

    const handleMouseDown = useCallback(
        async (e: React.MouseEvent) => {
            // Only drag on left mouse button
            if (e.button !== 0) return;

            // Don't drag if clicking on interactive elements
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'BUTTON' ||
                target.closest('button') ||
                target.classList.contains('timer-btn')
            ) {
                return;
            }

            isDragging.current = true;
            if (options.onDragStart) {
                options.onDragStart();
            }

            try {
                const appWindow = getCurrentWindow();
                await appWindow.startDragging();
            } catch (error) {
                console.error('Drag error:', error);
            }

            isDragging.current = false;
            if (options.onDragEnd) {
                options.onDragEnd();
            }
        },
        [options]
    );

    return {
        handleMouseDown,
        isDragging: isDragging.current,
    };
};
