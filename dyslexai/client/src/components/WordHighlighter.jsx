import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const WordHighlighter = ({ 
  text, 
  currentWordIndex = -1, 
  errors = [], 
  onWordClick = null,
  className = '' 
}) => {
  const { getReadingClasses } = useAccessibility();

  if (!text) return null;

  const words = text.split(/\s+/);
  const errorMap = new Map();
  
  // Create a map of error positions to error details
  errors.forEach(error => {
    if (error.position !== undefined) {
      errorMap.set(error.position, error);
    }
  });

  return (
    <div className={`reading-text ${getReadingClasses()} ${className}`}>
      {words.map((word, index) => {
        const error = errorMap.get(index);
        const isCurrentWord = index === currentWordIndex;
        const hasError = error && error.type !== 'insertion';
        
        let wordClasses = ['inline-block', 'px-1', 'rounded', 'transition-all', 'duration-150'];
        
        if (isCurrentWord) {
          wordClasses.push('word-highlight');
        }
        
        if (hasError) {
          wordClasses.push('word-error');
        }
        
        if (onWordClick) {
          wordClasses.push('cursor-pointer', 'hover:bg-gray-100');
        }

        return (
          <span key={index} className={wordClasses.join(' ')} onClick={() => onWordClick && onWordClick(index, word)}>
            {word}
            {index < words.length - 1 && ' '}
            {hasError && (
              <span className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded px-2 py-1 -mt-8 ml-2 whitespace-nowrap">
                <div className="font-semibold">{error.type}</div>
                {error.expectedWord && (
                  <div>Expected: "{error.expectedWord}"</div>
                )}
                {error.spokenWord && error.spokenWord !== error.expectedWord && (
                  <div>Spoken: "{error.spokenWord}"</div>
                )}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default WordHighlighter;
