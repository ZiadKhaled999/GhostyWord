import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { validateWord } from '../dictionaryApi';
import { usePlayersStore } from './usePlayersStore';

export type GamePhase = 'menu' | 'setup' | 'playing' | 'ended';

interface WordValidationResult {
  isValid: boolean;
  results: number;
  message?: string;
}

interface GameState {
  gamePhase: GamePhase;
  currentPlayerIndex: number;
  currentWord: string;
  currentRound: number;
  wordValidationResult: WordValidationResult | null;
  isValidatingWord: boolean;
  
  // Actions
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  addLetter: (letter: string) => void;
  checkWord: () => Promise<void>;
  autoCheckWord: (word: string) => Promise<void>;
  nextPlayer: () => void;
  nextRound: () => void;
}

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: 'menu',
    currentPlayerIndex: 0,
    currentWord: '',
    currentRound: 1,
    wordValidationResult: null,
    isValidatingWord: false,
    
    startGame: () => {
      const { players } = usePlayersStore.getState();
      if (players.length >= 2) {
        console.log('Starting game with players:', players.length);
        set({
          gamePhase: 'playing',
          currentPlayerIndex: 0,
          currentWord: '',
          currentRound: 1,
          wordValidationResult: null,
          isValidatingWord: false,
        });
      } else {
        console.log('Cannot start game - not enough players');
      }
    },
    
    endGame: () => {
      console.log('Ending game');
      set({ gamePhase: 'ended' });
    },
    
    resetGame: () => {
      console.log('Resetting game');
      set({
        gamePhase: 'menu',
        currentPlayerIndex: 0,
        currentWord: '',
        currentRound: 1,
        wordValidationResult: null,
        isValidatingWord: false,
      });
    },
    
    addLetter: (letter: string) => {
      const state = get();
      if (state.gamePhase !== 'playing') {
        console.log('Cannot add letter - game not playing');
        return;
      }
      
      const newWord = state.currentWord + letter.toUpperCase();
      console.log('Adding letter:', letter, 'New word:', newWord);
      
      set({ 
        currentWord: newWord,
        wordValidationResult: null,
      });
      
      // Auto-check word if it has 2+ letters
      if (newWord.length >= 2) {
        setTimeout(() => {
          get().autoCheckWord(newWord);
        }, 300);
      } else {
        // Move to next player immediately if word is too short
        get().nextPlayer();
      }
    },
    
    checkWord: async () => {
      const state = get();
      if (state.currentWord.length < 2) return;
      
      console.log('Manually checking word:', state.currentWord);
      set({ isValidatingWord: true });
      
      try {
        const result = await validateWord(state.currentWord);
        console.log('Word validation result:', result);
        
        set({ 
          wordValidationResult: result,
          isValidatingWord: false 
        });
        
        // If word is invalid, eliminate current player
        if (!result.isValid || result.results === 0) {
          const { eliminateCurrentPlayer } = usePlayersStore.getState();
          eliminateCurrentPlayer();
          
          // Check if game should end
          const { players } = usePlayersStore.getState();
          const activePlayers = players.filter(p => p.status === 'continuer');
          
          if (activePlayers.length <= 1) {
            get().endGame();
          } else {
            get().nextRound();
          }
        }
      } catch (error) {
        console.error('Word validation error:', error);
        set({ 
          wordValidationResult: {
            isValid: false,
            results: 0,
            message: 'Error checking word'
          },
          isValidatingWord: false 
        });
      }
    },
    
    autoCheckWord: async (word: string) => {
      const state = get();
      if (state.gamePhase !== 'playing' || word.length < 2) return;
      
      console.log('Auto-checking word:', word);
      set({ isValidatingWord: true });
      
      try {
        const result = await validateWord(word);
        console.log('Auto validation result:', result);
        
        set({ 
          wordValidationResult: result,
          isValidatingWord: false 
        });
        
        // If word is invalid, eliminate the player who just added the letter
        if (!result.isValid || result.results === 0) {
          console.log('Invalid word - eliminating player');
          const { eliminateCurrentPlayer } = usePlayersStore.getState();
          eliminateCurrentPlayer();
          
          // Check if game should end
          const { players } = usePlayersStore.getState();
          const activePlayers = players.filter(p => p.status === 'continuer');
          
          if (activePlayers.length <= 1) {
            get().endGame();
          } else {
            get().nextRound();
          }
        } else {
          // Word is valid, just move to next player
          console.log('Valid word - moving to next player');
          get().nextPlayer();
        }
      } catch (error) {
        console.error('Auto word validation error:', error);
        set({ 
          wordValidationResult: {
            isValid: false,
            results: 0,
            message: 'Error checking word'
          },
          isValidatingWord: false 
        });
        
        // On error, assume word is invalid and eliminate player
        const { eliminateCurrentPlayer } = usePlayersStore.getState();
        eliminateCurrentPlayer();
        
        const { players } = usePlayersStore.getState();
        const activePlayers = players.filter(p => p.status === 'continuer');
        
        if (activePlayers.length <= 1) {
          get().endGame();
        } else {
          get().nextRound();
        }
      }
    },
    
    nextPlayer: () => {
      const { players } = usePlayersStore.getState();
      const activePlayers = players.filter(p => p.status === 'continuer');
      
      if (activePlayers.length <= 1) {
        console.log('Not enough active players - ending game');
        get().endGame();
        return;
      }
      
      const state = get();
      let nextIndex = (state.currentPlayerIndex + 1) % players.length;
      
      // Skip eliminated players
      while (players[nextIndex] && players[nextIndex].status !== 'continuer') {
        nextIndex = (nextIndex + 1) % players.length;
      }
      
      console.log('Moving to next player:', nextIndex, players[nextIndex]?.name);
      set({ currentPlayerIndex: nextIndex });
    },
    
    nextRound: () => {
      const state = get();
      console.log('Starting next round:', state.currentRound + 1);
      
      set({ 
        currentRound: state.currentRound + 1,
        currentWord: '',
        wordValidationResult: null,
        currentPlayerIndex: 0,
      });
      
      // Find first active player
      const { players } = usePlayersStore.getState();
      let firstActiveIndex = 0;
      while (firstActiveIndex < players.length && players[firstActiveIndex].status !== 'continuer') {
        firstActiveIndex++;
      }
      
      if (firstActiveIndex < players.length) {
        set({ currentPlayerIndex: firstActiveIndex });
      }
    },
  }))
);