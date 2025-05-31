import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayersStore } from '../lib/stores/usePlayersStore';
import { useGameStore } from '../lib/stores/useGameStore';
import WordDisplay from '../components/WordDisplay';
import GameControls from '../components/GameControls';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { players } = usePlayersStore();
  const { 
    currentPlayerIndex, 
    currentWord, 
    gamePhase, 
    startGame, 
    isValidatingWord,
    wordValidationResult 
  } = useGameStore();

  useEffect(() => {
    if (players.length < 2) {
      navigate('/add-players');
      return;
    }
    if (gamePhase === 'menu') {
      startGame();
    }
  }, [players, navigate, startGame, gamePhase]);

  if (players.length < 2) {
    return null;
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8 fade-in">
        <h1 className="ghost-title text-3xl md:text-5xl font-bold mb-4">
          Ghosty Word
        </h1>
        {gamePhase === 'playing' && (
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">
              Round {useGameStore.getState().currentRound}
            </p>
            <Card className="ps-card inline-block px-6 py-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {currentPlayerIndex + 1}
                </div>
                <span className="text-xl font-semibold">
                  {currentPlayer?.name}'s Turn
                </span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Word Display */}
        <div className="lg:col-span-2">
          <WordDisplay />
        </div>

        {/* Game Controls */}
        <div className="space-y-6">
          <GameControls />
          
          {/* Players List */}
          <Card className="ps-card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <i className="fas fa-users mr-2 text-primary"></i>
              Players
            </h3>
            <div className="space-y-3">
              {players.map((player, index) => (
                <div 
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    index === currentPlayerIndex 
                      ? 'bg-primary/20 border border-primary/50' 
                      : 'bg-muted/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === currentPlayerIndex 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`font-medium ${
                      index === currentPlayerIndex ? 'text-primary' : ''
                    }`}>
                      {player.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>W: {player.wins}</span>
                    <span>L: {player.losses}</span>
                    <span>XP: {player.xp}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Back Button */}
      <div className="fixed top-4 left-4">
        <Button 
          onClick={() => navigate('/add-players')}
          variant="outline"
          className="ps-button-secondary"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back
        </Button>
      </div>

      {/* Word Validation Status */}
      {isValidatingWord && (
        <div className="fixed bottom-4 right-4">
          <Card className="ps-card flex items-center space-x-3 px-4 py-3">
            <i className="fas fa-spinner animate-spin text-primary"></i>
            <span>Checking word...</span>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GamePage;
