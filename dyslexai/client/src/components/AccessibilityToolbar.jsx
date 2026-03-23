import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Settings, RotateCcw, Moon, Sun, X } from 'lucide-react';

const AccessibilityToolbar = () => {
  const { settings, updateSetting, resetSettings, toggleDarkMode } = useAccessibility();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fontOptions = [
    { value: 'Normal', label: 'Normal' },
    { value: 'OpenDyslexic', label: 'OpenDyslexic' },
  ];

  const backgroundOptions = [
    { value: '#FFFFFF', label: 'White', class: 'bg-white' },
    { value: '#FFF8DC', label: 'Cream', class: 'bg-yellow-50' },
    { value: '#FFFACD', label: 'Soft Yellow', class: 'bg-yellow-100' },
    { value: '#E8F4FD', label: 'Light Blue', class: 'bg-blue-50' },
    { value: '#E8F8F5', label: 'Mint', class: 'bg-green-50' },
    { value: '#F3E5F5', label: 'Lavender', class: 'bg-purple-50' },
    { value: '#1A1A2E', label: 'Dark Mode', class: 'bg-gray-900' },
  ];

  const lineHeightOptions = [
    { value: 1.2, label: 'Compact' },
    { value: 1.6, label: 'Normal' },
    { value: 2.0, label: 'Relaxed' },
    { value: 2.5, label: 'Extra' },
  ];

  const letterSpacingOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'wide', label: 'Wide' },
    { value: 'extraWide', label: 'Extra Wide' },
  ];

  const wordSpacingOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'wide', label: 'Wide' },
  ];

  if (isCollapsed) {
    return (
      <div className="a11y-toolbar collapsed">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          aria-label="Open reading settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="a11y-toolbar">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Reading Settings
        </h3>
        <div className="flex gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {settings.darkMode ? (
              <Sun className="w-4 h-4 text-yellow-500" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {/* Font Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Font
          </label>
          <select
            value={settings.font}
            onChange={(e) => updateSetting('font', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {fontOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Font Size: {settings.fontSize}px
          </label>
          <input
            type="range"
            min="16"
            max="32"
            value={settings.fontSize}
            onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>16px</span>
            <span>32px</span>
          </div>
        </div>

        {/* Line Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Line Spacing
          </label>
          <div className="grid grid-cols-2 gap-2">
            {lineHeightOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateSetting('lineHeight', option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.lineHeight === option.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Letter Spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Letter Spacing
          </label>
          <div className="grid grid-cols-3 gap-2">
            {letterSpacingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateSetting('letterSpacing', option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.letterSpacing === option.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Word Spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Word Spacing
          </label>
          <div className="grid grid-cols-2 gap-2">
            {wordSpacingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateSetting('wordSpacing', option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.wordSpacing === option.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Background Color
          </label>
          <div className="grid grid-cols-4 gap-2">
            {backgroundOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  updateSetting('background', option.value);
                  updateSetting('darkMode', option.value === '#1A1A2E');
                  updateSetting('textColor', option.value === '#1A1A2E' ? '#FFFFFF' : '#1A1A1A');
                }}
                className={`relative w-full h-8 rounded-lg border-2 transition-all ${
                  settings.background === option.value
                    ? 'border-primary-500 scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                } ${option.class}`}
                title={option.label}
              >
                {settings.background === option.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetSettings}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default AccessibilityToolbar;
