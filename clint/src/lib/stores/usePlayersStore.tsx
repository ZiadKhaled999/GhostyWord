import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface Player {
  id: string;
  name: string;
  wins: number;
  losses: number;
  xp: number;
  status: 'continuer' | 'quit' | 'executed';
}

interface PlayersState {
  players: Player[];
  currentPlayerIndex: number;
  
  // Actions
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updatePlayer: (id: string, name: string) => void;
  eliminateCurrentPlayer: () => void;
  quitCurrentPlayer: () => void;
  incrementWins: (id: string) => void;
  incrementLosses: (id: string) => void;
  resetGame: () => void;
  nextPlayer: () => void;
  awardWinsToActivePlayers: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const calculateXP = (wins: number): number => wins * 10;

// Load from localStorage
const loadPlayers = (): Player[] => {
  try {
    const saved = localStorage.getItem('ghosty-word-players');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save to localStorage
const savePlayers = (players: Player[]) => {
  try {
    localStorage.setItem('ghosty-word-players', JSON.stringify(players));
  } catch (error) {
    console.error('Failed to save players to localStorage:', error);
  }
};

export const usePlayersStore = create<PlayersState>()(
  subscribeWithSelector((set, get) => ({
    players: loadPlayers(),
    currentPlayerIndex: 0,
    
    addPlayer: (name: string) => {
      const newPlayer: Player = {
        id: generateId(),
        name,
        wins: 0,
        losses: 0,
        xp: 0,
        status: 'continuer',
      };
      
      set((state) => {
        const newPlayers = [...state.players, newPlayer];
        savePlayers(newPlayers);
        return { players: newPlayers };
      });
    },
    
    removePlayer: (id: string) => {
      set((state) => {
        const newPlayers = state.players.filter(p => p.id !== id);
        savePlayers(newPlayers);
        return { 
          players: newPlayers,
          currentPlayerIndex: Math.min(state.currentPlayerIndex, newPlayers.length - 1)
        };
      });
    },
    
    updatePlayer: (id: string, name: string) => {
      set((state) => {
        const newPlayers = state.players.map(p => 
          p.id === id ? { ...p, name } : p
        );
        savePlayers(newPlayers);
        return { players: newPlayers };
      });
    },
    
    eliminateCurrentPlayer: () => {
      const state = get();
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      if (!currentPlayer) return;
      
      set((state) => {
        const newPlayers = state.players.map(p => 
          p.id === currentPlayer.id 
            ? { 
                ...p, 
                status: 'executed' as const,
                losses: p.losses + 1,
                xp: calculateXP(p.wins)
              }
            : p
        );
        savePlayers(newPlayers);
        return { players: newPlayers };
      });
      
      // Award wins to remaining active players
      get().awardWinsToActivePlayers();
    },
    
    quitCurrentPlayer: () => {
      const state = get();
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      if (!currentPlayer) return;
      
      set((state) => {
        const newPlayers = state.players.map(p => 
          p.id === currentPlayer.id 
            ? { 
                ...p, 
                status: 'quit' as const,
                losses: p.losses + 1,
                xp: calculateXP(p.wins)
              }
            : p
        );
        savePlayers(newPlayers);
        return { players: newPlayers };
      });
      
      // Award wins to remaining active players
      get().awardWinsToActivePlayers();
    },
    
    incrementWins: (id: string) => {
      set((state) => {
        const newPlayers = state.players.map(p => 
          p.id === id 
            ? { ...p, wins: p.wins + 1, xp: calculateXP(p.wins + 1) }
            : p
        );
        savePlayers(newPlayers);
        return { players: newPlayers };
      });
    },
    
    incrementLosses: (id: string) => {
      set((state) => {
        const newPlayers = state.players.map(p => 
          p.id === id 
            ? { ...p, losses: p.losses + 1, xp: calculateXP(p.wins) }
            : p
        );
        savePlayers(newPlayers);
        return { players: newPlayers };
      });
    },
    
    resetGame: () => {
      // Clear localStorage and reset state
      localStorage.removeItem('ghosty-word-players');
      set({ 
        players: [], 
        currentPlayerIndex: 0 
      });
    },
    
    nextPlayer: () => {
      const state = get();
      const activePlayers = state.players.filter(p => p.status === 'continuer');
      
      if (activePlayers.length <= 1) return;
      
      let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      
      // Skip non-active players
      while (state.players[nextIndex]?.status !== 'continuer') {
        nextIndex = (nextIndex + 1) % state.players.length;
      }
      
      set({ currentPlayerIndex: nextIndex });
    },
    
    // Helper method to award wins to active players when someone is eliminated
    awardWinsToActivePlayers: () => {
      const state = get();
      const activePlayers = state.players.filter(p => p.status === 'continuer');
      
      set((state) => {
        const newPlayers = state.players.map(p => 
          p.status === 'continuer'
            ? { ...p, wins: p.wins + 1, xp: calculateXP(p.wins + 1) }
            : p
        );
        savePlayers(newPlayers);
        return { players: newPlayers };
      });
    },
  }))
);

// Subscribe to changes and save to localStorage
usePlayersStore.subscribe(
  (state) => state.players,
  (players) => savePlayers(players)
);
