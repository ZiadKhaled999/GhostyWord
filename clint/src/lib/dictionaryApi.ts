interface DictionaryResponse {
  word: string;
  phonetics?: Array<{
    text: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
}

interface WordValidationResult {
  isValid: boolean;
  results: number;
  message?: string;
  definitions?: string[];
}

// Free Dictionary API
const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export const validateWord = async (word: string): Promise<WordValidationResult> => {
  if (!word || word.length < 2) {
    return {
      isValid: false,
      results: 0,
      message: 'Word must be at least 2 characters long'
    };
  }

  try {
    const response = await fetch(`${DICTIONARY_API_URL}/${encodeURIComponent(word.toLowerCase())}`);
    
    if (response.ok) {
      const data: DictionaryResponse[] = await response.json();
      
      if (data && data.length > 0) {
        // Extract definitions
        const definitions: string[] = [];
        data.forEach(entry => {
          entry.meanings.forEach(meaning => {
            meaning.definitions.forEach(def => {
              definitions.push(`${meaning.partOfSpeech}: ${def.definition}`);
            });
          });
        });
        
        return {
          isValid: true,
          results: definitions.length,
          definitions: definitions.slice(0, 5), // Limit to first 5 definitions
          message: `Found ${definitions.length} definition(s)`
        };
      }
    }
    
    // If we get here, the word wasn't found or there was an error
    return {
      isValid: false,
      results: 0,
      message: 'Word not found in dictionary'
    };
    
  } catch (error) {
    console.error('Dictionary API error:', error);
    
    // Fallback: Simple word validation
    const isBasicWord = await validateWithFallback(word);
    
    return {
      isValid: isBasicWord,
      results: isBasicWord ? 1 : 0,
      message: isBasicWord ? 'Word validated (offline mode)' : 'Unable to validate word'
    };
  }
};

// Simple fallback validation for common words
const validateWithFallback = async (word: string): Promise<boolean> => {
  const commonWords = [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use',
    'cat', 'dog', 'car', 'house', 'book', 'tree', 'water', 'fire', 'earth', 'wind', 'love', 'hate', 'good', 'bad', 'big', 'small', 'fast', 'slow', 'hot', 'cold', 'up', 'down', 'left', 'right', 'yes', 'no', 'hello', 'goodbye', 'please', 'thank', 'sorry', 'help',
    'word', 'game', 'play', 'fun', 'win', 'lose', 'start', 'end', 'go', 'stop', 'run', 'walk', 'jump', 'sit', 'stand', 'look', 'hear', 'talk', 'read', 'write', 'learn', 'teach', 'work', 'rest', 'eat', 'drink', 'sleep', 'wake', 'happy', 'sad', 'angry', 'calm',
    'fork', 'spoon', 'knife', 'plate', 'cup', 'glass', 'table', 'chair', 'door', 'window', 'wall', 'floor', 'roof', 'room', 'kitchen', 'bedroom', 'bathroom', 'garden', 'park', 'school', 'office', 'store', 'market', 'hospital', 'church', 'bank', 'hotel', 'restaurant'
  ];
  
  return commonWords.includes(word.toLowerCase());
};

// Get word definitions for display
export const getWordDefinitions = async (word: string): Promise<string[]> => {
  try {
    const result = await validateWord(word);
    return result.definitions || [];
  } catch (error) {
    console.error('Error getting word definitions:', error);
    return [];
  }
};
