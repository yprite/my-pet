import React, { useEffect, useState } from 'react';

interface SpeechBubbleProps {
    message: string;
    onComplete?: () => void;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ message, onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
                onComplete();
            }
        }, 4000);

        return () => clearTimeout(timer);
    }, [message, onComplete]);

    if (!isVisible || !message) return null;

    return (
        <div className="speech-bubble" key={message}>
            {message}
        </div>
    );
};

export default SpeechBubble;
