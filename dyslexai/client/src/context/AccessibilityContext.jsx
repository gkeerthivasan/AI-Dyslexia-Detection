import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Default accessibility settings
const defaultSettings = {
  font: 'OpenDyslexic', // 'Normal' | 'OpenDyslexic' | 'Lexie' | 'Arial'
  fontSize: 20, // px
  lineHeight: 2.0, // rem multiplier
  letterSpacing: 'normal', // 'normal' | 'wide' | 'extraWide'
  wordSpacing: 'normal', // 'normal' | 'wide'
  background: '#FFF8DC', // hex
  textColor: '#1A1A1A',
  darkMode: false,
};

// Action types
const ACCESSIBILITY_ACTIONS = {
  UPDATE_SETTING: 'UPDATE_SETTING',
  RESET_SETTINGS: 'RESET_SETTINGS',
  LOAD_SETTINGS: 'LOAD_SETTINGS',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
};

// Reducer
const accessibilityReducer = (state, action) => {
  switch (action.type) {
    case ACCESSIBILITY_ACTIONS.UPDATE_SETTING:
      return {
        ...state,
        [action.payload.setting]: action.payload.value,
      };

    case ACCESSIBILITY_ACTIONS.RESET_SETTINGS:
      return defaultSettings;

    case ACCESSIBILITY_ACTIONS.LOAD_SETTINGS:
      return {
        ...defaultSettings,
        ...action.payload.settings,
      };

    case ACCESSIBILITY_ACTIONS.TOGGLE_DARK_MODE:
      const newDarkMode = !state.darkMode;
      return {
        ...state,
        darkMode: newDarkMode,
        background: newDarkMode ? '#1A1A2E' : '#FFF8DC',
        textColor: newDarkMode ? '#FFFFFF' : '#1A1A1A',
      };

    default:
      return state;
  }
};

// Create context
const AccessibilityContext = createContext();

// Provider component
export const AccessibilityProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(accessibilityReducer, defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('dyslexai_a11y');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        dispatch({
          type: ACCESSIBILITY_ACTIONS.LOAD_SETTINGS,
          payload: { settings: parsed },
        });
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dyslexai_a11y', JSON.stringify(settings));
  }, [settings]);

  // Apply settings to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply dark mode class
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply custom properties for dynamic styling
    root.style.setProperty('--reading-font-size', `${settings.fontSize}px`);
    root.style.setProperty('--reading-line-height', settings.lineHeight);
    root.style.setProperty('--reading-letter-spacing', settings.letterSpacing);
    root.style.setProperty('--reading-word-spacing', settings.wordSpacing);
    root.style.setProperty('--reading-background', settings.background);
    root.style.setProperty('--reading-text-color', settings.textColor);
    
    // Apply font family
    const fontFamily = settings.font === 'Normal' 
      ? 'Inter, system-ui, sans-serif'
      : settings.font === 'OpenDyslexic'
      ? 'OpenDyslexic, sans-serif'
      : settings.font === 'Arial'
      ? 'Arial, sans-serif'
      : 'Inter, system-ui, sans-serif';
    
    root.style.setProperty('--reading-font-family', fontFamily);
  }, [settings]);

  // Update setting function
  const updateSetting = (setting, value) => {
    dispatch({
      type: ACCESSIBILITY_ACTIONS.UPDATE_SETTING,
      payload: { setting, value },
    });
  };

  // Reset settings function
  const resetSettings = () => {
    dispatch({ type: ACCESSIBILITY_ACTIONS.RESET_SETTINGS });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    dispatch({ type: ACCESSIBILITY_ACTIONS.TOGGLE_DARK_MODE });
  };

  // Get computed styles for reading text
  const getReadingStyles = () => {
    return {
      fontFamily: settings.font === 'Normal' 
        ? 'Inter, system-ui, sans-serif'
        : settings.font === 'OpenDyslexic'
        ? 'OpenDyslexic, sans-serif'
        : settings.font === 'Arial'
        ? 'Arial, sans-serif'
        : 'Inter, system-ui, sans-serif',
      fontSize: `${settings.fontSize}px`,
      lineHeight: settings.lineHeight,
      letterSpacing: settings.letterSpacing === 'normal' ? 'normal' : 
                   settings.letterSpacing === 'wide' ? '0.05em' : '0.1em',
      wordSpacing: settings.wordSpacing === 'normal' ? 'normal' : '0.1em',
      backgroundColor: settings.background,
      color: settings.textColor,
    };
  };

  // Get CSS classes for reading text
  const getReadingClasses = () => {
    const classes = ['reading-text'];
    
    if (settings.letterSpacing === 'wide') classes.push('text-spacing-wide');
    if (settings.letterSpacing === 'extraWide') classes.push('text-spacing-extra-wide');
    if (settings.wordSpacing === 'wide') classes.push('word-spacing-wide');
    
    if (settings.lineHeight === 1.2) classes.push('leading-compact');
    if (settings.lineHeight === 1.6) classes.push('leading-normal');
    if (settings.lineHeight === 2.0) classes.push('leading-relaxed');
    if (settings.lineHeight === 2.5) classes.push('leading-extra');
    
    return classes.join(' ');
  };

  const value = {
    settings,
    updateSetting,
    resetSettings,
    toggleDarkMode,
    getReadingStyles,
    getReadingClasses,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Hook to use accessibility context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityContext;
