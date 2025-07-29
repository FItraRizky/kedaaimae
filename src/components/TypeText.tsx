import React, { useState, useEffect, useRef, useCallback } from 'react';

interface TypeTextProps {
  text: string | string[];
  asElement?: keyof React.JSX.IntrinsicElements;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | React.ReactNode;
  cursorBlinkDuration?: number;
  cursorClassName?: string;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

const TypeText: React.FC<TypeTextProps> = ({
  text,
  asElement = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorBlinkDuration = 0.5,
  cursorClassName = '',
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const texts = Array.isArray(text) ? text : [text];
  const currentText = texts[currentIndex % texts.length];

  useEffect(() => {
    if (startOnVisible && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted) {
            setIsVisible(true);
            setHasStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [startOnVisible, hasStarted]);

  const getTypingSpeed = useCallback(() => {
    if (variableSpeed) {
      return Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min;
    }
    return typingSpeed;
  }, [variableSpeed, typingSpeed]);

  const typeRef = useRef<(() => void) | null>(null);
  
  typeRef.current = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isDeleting && displayText.length < currentText.length) {
      setIsTyping(true);
      const nextChar = reverseMode 
        ? currentText[currentText.length - 1 - displayText.length]
        : currentText[displayText.length];
      
      setDisplayText(prev => reverseMode ? nextChar + prev : prev + nextChar);
      
      timeoutRef.current = setTimeout(() => typeRef.current?.(), getTypingSpeed());
    } else if (!isDeleting && displayText.length === currentText.length) {
      setIsTyping(false);
      onSentenceComplete?.(currentText, currentIndex);
      
      if (loop) {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration);
      }
    } else if (isDeleting && displayText.length > 0) {
      setIsTyping(true);
      setDisplayText(prev => reverseMode ? prev.slice(1) : prev.slice(0, -1));
      timeoutRef.current = setTimeout(() => typeRef.current?.(), deletingSpeed);
    } else if (isDeleting && displayText.length === 0) {
      setIsTyping(false);
      setIsDeleting(false);
      setCurrentIndex(prev => (prev + 1) % texts.length);
      timeoutRef.current = setTimeout(() => typeRef.current?.(), typingSpeed);
    }
  };
  
  const type = useCallback(() => typeRef.current?.(), []);

  useEffect(() => {
    if (!isVisible) return;

    if (initialDelay > 0 && !hasStarted) {
      timeoutRef.current = setTimeout(() => {
        setHasStarted(true);
        type();
      }, initialDelay);
    } else if (hasStarted || initialDelay === 0) {
      type();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, hasStarted, initialDelay, type]);



  const Element = asElement as any;
  const textColor = textColors[currentIndex % textColors.length];
  const shouldShowCursor = showCursor && (!hideCursorWhileTyping || !isTyping);

  return (
    <Element 
      ref={ref} 
      className={`${className} ${isTyping ? 'typing' : ''}`}
      style={{ color: textColor }}
    >
      {displayText}
      {shouldShowCursor && (
        <span 
          className={`typing-cursor ${cursorClassName} ${isTyping ? 'active' : ''}`}
          style={{
            animation: `blink ${cursorBlinkDuration}s infinite`,
            marginLeft: '2px'
          }}
        >
          {cursorCharacter}
        </span>
      )}
    </Element>
  );
};

export default TypeText;
