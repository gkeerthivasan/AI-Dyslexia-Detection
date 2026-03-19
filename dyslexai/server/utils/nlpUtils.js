// Levenshtein distance calculation
function levenshteinDistance(str1, str2) {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

// Simple phonetic similarity (Soundex-like)
function phoneticSimilarity(word1, word2) {
  const soundex = (str) => {
    const code = str.toUpperCase().charAt(0);
    const consonants = str.toUpperCase().slice(1).replace(/[AEIOUYHW]/g, '');
    const mapped = consonants.replace(/[BFPV]/g, '1')
      .replace(/[CGJKQSXZ]/g, '2')
      .replace(/[DT]/g, '3')
      .replace(/[L]/g, '4')
      .replace(/[MN]/g, '5')
      .replace(/[R]/g, '6');
    return (code + mapped + '000').slice(0, 4);
  };
  
  return soundex(word1) === soundex(word2);
}

// Analyze reading errors
function analyzeReading(referenceText, transcript) {
  const refWords = referenceText.toLowerCase().split(/\s+/).filter(w => w);
  const transWords = transcript.toLowerCase().split(/\s+/).filter(w => w);
  
  const errors = [];
  let refIndex = 0;
  let transIndex = 0;
  
  while (refIndex < refWords.length && transIndex < transWords.length) {
    const refWord = refWords[refIndex];
    const transWord = transWords[transIndex];
    
    if (refWord === transWord) {
      refIndex++;
      transIndex++;
    } else {
      const distance = levenshteinDistance(refWord, transWord);
      const isPhonetic = phoneticSimilarity(refWord, transWord);
      
      if (distance <= 2 && isPhonetic) {
        errors.push({
          word: transWord,
          type: 'mispronunciation',
          position: refIndex,
          expectedWord: refWord,
          spokenWord: transWord
        });
        refIndex++;
        transIndex++;
      } else if (distance <= 1) {
        errors.push({
          word: transWord,
          type: 'substitution',
          position: refIndex,
          expectedWord: refWord,
          spokenWord: transWord
        });
        refIndex++;
        transIndex++;
      } else {
        // Check if it's an insertion
        let found = false;
        for (let i = 1; i <= 2 && transIndex + i < transWords.length; i++) {
          if (refWords[refIndex] === transWords[transIndex + i]) {
            for (let j = 0; j < i; j++) {
              errors.push({
                word: transWords[transIndex + j],
                type: 'insertion',
                position: refIndex,
                expectedWord: '',
                spokenWord: transWords[transIndex + j]
              });
            }
            transIndex += i;
            found = true;
            break;
          }
        }
        
        if (!found) {
          errors.push({
            word: refWord,
            type: 'omission',
            position: refIndex,
            expectedWord: refWord,
            spokenWord: ''
          });
          refIndex++;
        }
      }
    }
  }
  
  // Handle remaining words
  while (refIndex < refWords.length) {
    errors.push({
      word: refWords[refIndex],
      type: 'omission',
      position: refIndex,
      expectedWord: refWords[refIndex],
      spokenWord: ''
    });
    refIndex++;
  }
  
  while (transIndex < transWords.length) {
    errors.push({
      word: transWords[transIndex],
      type: 'insertion',
      position: refWords.length,
      expectedWord: '',
      spokenWord: transWords[transIndex]
    });
    transIndex++;
  }
  
  return errors;
}

// Calculate WPM
function calculateWPM(transcript, durationSeconds) {
  if (!transcript || durationSeconds <= 0) return 0;
  const wordCount = transcript.split(/\s+/).filter(w => w).length;
  return Math.round((wordCount / durationSeconds) * 60);
}

// Calculate accuracy
function calculateAccuracy(referenceText, transcript) {
  if (!referenceText) return 0;
  
  const errors = analyzeReading(referenceText, transcript);
  const refWords = referenceText.split(/\s+/).filter(w => w);
  const totalWords = refWords.length;
  
  if (totalWords === 0) return 0;
  
  const correctWords = totalWords - errors.filter(e => e.type !== 'insertion').length;
  return Math.round((correctWords / totalWords) * 100);
}

module.exports = {
  analyzeReading,
  calculateWPM,
  calculateAccuracy,
  levenshteinDistance,
  phoneticSimilarity
};
