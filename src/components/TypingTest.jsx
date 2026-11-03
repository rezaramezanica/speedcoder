import { useState, useEffect, useRef } from 'react';
import { getRandomSnippet, getAvailableLanguages } from '../data/snippetLoader';
import HandGuide from './HandGuide';
import './HandGuide.css';
import './TypingTest.css';

const TypingTest = () => {
  const [snippet, setSnippet] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timer, setTimer] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [skippedIndices, setSkippedIndices] = useState(new Set());
  const inputRef = useRef(null);
  const currentCharRef = useRef(null);
  const enterCountRef = useRef(0);

  useEffect(() => {
    loadNewSnippet();
  }, [selectedLanguage]);

  useEffect(() => {
    // Auto-scroll to keep current character in view
    if (currentCharRef.current) {
      currentCharRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    // Global keyboard listener for when test is completed
    const handleGlobalKeyDown = (e) => {
      if (endTime && e.key === 'Enter') {
        e.preventDefault();
        enterCountRef.current += 1;

        if (enterCountRef.current >= 2) {
          enterCountRef.current = 0;
          loadNewSnippet();
        }
      } else if (endTime && e.key !== 'Enter') {
        enterCountRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [endTime, selectedLanguage]);

  useEffect(() => {
    let interval;
    if (isTestActive && !endTime) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestActive, endTime]);

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  }, [isDarkMode]);

  const loadNewSnippet = () => {
    const newSnippet = getRandomSnippet(selectedLanguage);
    setSnippet(newSnippet);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsTestActive(false);
    setCurrentIndex(0);
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setTimer(0);
    setSkippedIndices(new Set());
    enterCountRef.current = 0;

    // Auto-focus the input after loading new snippet
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!isTestActive && value.length === 1) {
      setIsTestActive(true);
      setStartTime(Date.now());
    }

    if (value.length <= snippet.code.length) {
      setUserInput(value);
      setCurrentIndex(value.length);

      // Only clear skipped indices if user is deleting (backspacing)
      // This allows users to backspace and retype skipped characters
      if (value.length < userInput.length) {
        const newSkippedIndices = new Set(
          Array.from(skippedIndices).filter(index => index < value.length)
        );
        setSkippedIndices(newSkippedIndices);
      }

      // Calculate errors
      let errorCount = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== snippet.code[i]) {
          errorCount++;
        }
      }
      setErrors(errorCount);

      // Calculate accuracy
      const acc = value.length > 0
        ? ((value.length - errorCount) / value.length * 100).toFixed(2)
        : 100;
      setAccuracy(acc);

      // Calculate WPM
      if (startTime) {
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        const wordsTyped = value.length / 5; // standard: 5 characters = 1 word
        const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
        setWpm(currentWpm);
      }

      // Check if completed
      if (value.length === snippet.code.length) {
        setEndTime(Date.now());
        setIsTestActive(false);
      }
    }
  };

  const getCharacterClass = (index) => {
    if (index < currentIndex) {
      // Characters that were skipped when pressing Enter should always be marked as incorrect
      if (skippedIndices.has(index)) {
        return 'incorrect';
      }
      return userInput[index] === snippet.code[index] ? 'correct' : 'incorrect';
    } else if (index === currentIndex) {
      return 'current';
    }
    return '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const spaces = '    '; // 4 spaces
      const newValue = userInput.substring(0, start) + spaces + userInput.substring(end);

      // Simulate input change
      const syntheticEvent = {
        target: {
          value: newValue
        }
      };
      handleInputChange(syntheticEvent);

      // Set cursor position after spaces
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = inputRef.current.selectionEnd = start + 4;
        }
      }, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      // Track where we were in the input before auto-completing
      const beforeAutoCompleteLength = userInput.length;

      // Find the next newline in the snippet from current position
      let charsToAdd = '';
      let searchIndex = beforeAutoCompleteLength;

      // Auto-complete any spaces/tabs until we hit the newline
      while (searchIndex < snippet.code.length && snippet.code[searchIndex] !== '\n') {
        charsToAdd += snippet.code[searchIndex];
        searchIndex++;
      }

      // Add the newline character
      if (searchIndex < snippet.code.length && snippet.code[searchIndex] === '\n') {
        charsToAdd += '\n';
      }

      const newValue = userInput.substring(0, start) + charsToAdd + userInput.substring(end);

      // Mark all auto-completed characters as skipped
      // The auto-completed chars are from beforeAutoCompleteLength to beforeAutoCompleteLength + charsToAdd.length
      const newSkippedIndices = new Set(skippedIndices);
      for (let i = beforeAutoCompleteLength; i < beforeAutoCompleteLength + charsToAdd.length; i++) {
        newSkippedIndices.add(i);
      }
      setSkippedIndices(newSkippedIndices);

      // Simulate input change
      const syntheticEvent = {
        target: {
          value: newValue
        }
      };
      handleInputChange(syntheticEvent);

      // Set cursor position after the added characters
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = inputRef.current.selectionEnd = start + charsToAdd.length;
        }
      }, 0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!snippet) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={`typing-test ${isDarkMode ? 'dark' : 'light'}`} onClick={() => inputRef.current?.focus()}>
      <div className="top-bar">
        <div className={`stats-bar ${endTime ? 'completed' : ''}`}>
          <div className="stat">
            <span className="stat-label">WPM</span>
            <span className="stat-value">{wpm}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Errors</span>
            <span className="stat-value">{errors}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{formatTime(timer)}</span>
          </div>
        </div>
        <button
          className="theme-toggle-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsDarkMode(!isDarkMode);
          }}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="language-selector-container">
        <div className="language-selector">
          {getAvailableLanguages().map((lang) => (
            <button
              key={lang.id}
              className={`language-btn ${selectedLanguage === lang.id ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleLanguageChange(lang.id);
              }}
            >
              {lang.displayName}
            </button>
          ))}
        </div>
      </div>

      <div className="main-content-row">
        <HandGuide currentChar={snippet && currentIndex < snippet.code.length ? snippet.code[currentIndex] : null} />

        <div className="main-content-col">
          <div className="code-display">
            <pre>
              {snippet.code.split('').map((char, index) => (
                <span
                  key={index}
                  className={getCharacterClass(index)}
                  ref={index === currentIndex ? currentCharRef : null}
                >
                  {char}
                </span>
              ))}
            </pre>
          </div>

          <textarea
            ref={inputRef}
            className="typing-input"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={endTime !== null}
            spellCheck={false}
            autoFocus
          />

          <button className="new-snippet-btn" onClick={loadNewSnippet}>
            New Snippet
          </button>
        </div>
      </div>

      {endTime && (
        <>
          {snippet.description && (
            <div className="snippet-description">
              <span className="description-label">What this does:</span>
              <p>{snippet.description}</p>
            </div>
          )}
          <div className="enter-hint">
            Press Enter twice for next snippet
          </div>
        </>
      )}

      <div className="instructions">
        <p>Click anywhere and start typing. Code turns green when correct, red when incorrect.</p>
      </div>
    </div>
  );
};

export default TypingTest;
