import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameStore } from '../lib/stores/useGameStore';
import { usePlayersStore } from '../lib/stores/usePlayersStore';

const WordDisplay: React.FC = () => {
  const [newLetter, setNewLetter] = useState('');
  const { currentWord, addLetter, gamePhase } = useGameStore();
  const { players, currentPlayerIndex } = usePlayersStore();

  const currentPlayer = players[currentPlayerIndex];

  const handleAddLetter = () => {
    if (newLetter.trim() && newLetter.length === 1 && /^[a-zA-Z]$/.test(newLetter)) {
      addLetter(newLetter.toUpperCase());
      setNewLetter('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddLetter();
    }
  };

  if (gamePhase !== 'playing') {
    return (
      <Card className="ps-card text-center py-16">
        <i className="fas fa-play text-6xl text-muted-foreground mb-4"></i>
        <h3 className="text-2xl font-semibold text-muted-foreground">
          Game not started
        </h3>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Word Display */}
      <Card className="ps-card">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <i className="fas fa-spell-check mr-3 text-primary"></i>
          Word Formation
        </h2>
        
        <div className="text-center space-y-6">
          {/* Current Word */}
          <div className="p-8 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg border border-primary/30">
            {currentWord ? (
              <div className="space-y-2">
                <div className="text-6xl md:text-8xl font-bold tracking-widest font-mono">
                  {currentWord.split('').map((letter, index) => (
                    <span 
                      key={index}
                      className="inline-block mx-1 bounce-animation"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentWord.length} letters
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-4xl text-muted-foreground">
                  <i className="fas fa-hourglass-start"></i>
                </div>
                <div className="text-xl text-muted-foreground">
                  Waiting for first letter...
                </div>
              </div>
            )}
          </div>
          
          {/* Letter Input */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-lg font-semibold flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                {currentPlayerIndex + 1}
              </div>
              <span>{currentPlayer?.name}, add your letter:</span>
            </div>
            
            <div className="flex space-x-3">
              <Input
                type="text"
                placeholder="Enter a letter"
                value={newLetter}
                onChange={(e) => setNewLetter(e.target.value.slice(0, 1).toUpperCase())}
                onKeyPress={handleKeyPress}
                className="text-center text-2xl font-bold tracking-widest uppercase"
                maxLength={1}
                autoFocus
              />
              <Button 
                onClick={handleAddLetter}
                disabled={!newLetter.trim() || !/^[A-Z]$/.test(newLetter)}
                className="ps-button px-8"
              >
                <i className="fas fa-plus mr-2"></i>
                Add
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Enter a single letter (A-Z)
            </div>
          </div>
        </div>
      </Card>

      {/* Letter History */}
      {currentWord && (
        <Card className="ps-card">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <i className="fas fa-history mr-2 text-primary"></i>
            Letter History
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentWord.split('').map((letter, index) => (
              <div 
                key={index}
                className="w-12 h-12 bg-primary/20 border border-primary/50 rounded-lg flex items-center justify-center font-bold text-lg"
              >
                {letter}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WordDisplay;
