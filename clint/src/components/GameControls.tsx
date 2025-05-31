import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGameStore } from '../lib/stores/useGameStore';
import { usePlayersStore } from '../lib/stores/usePlayersStore';

const GameControls: React.FC = () => {
  const navigate = useNavigate();
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [showEndGameDialog, setShowEndGameDialog] = useState(false);
  
  const { 
    currentWord, 
    wordValidationResult, 
    isValidatingWord,
    gamePhase,
    endGame
  } = useGameStore();
  
  const { 
    currentPlayerIndex, 
    players, 
    eliminateCurrentPlayer,
    quitCurrentPlayer 
  } = usePlayersStore();

  const currentPlayer = players[currentPlayerIndex];
  const wordLength = currentWord.length;
  const hasValidWord = wordValidationResult?.isValid && wordValidationResult?.results > 0;



  const handleQuit = () => {
    quitCurrentPlayer();
    setShowQuitDialog(false);
    
    // Check if game should end
    const activePlayers = players.filter(p => p.status === 'continuer');
    if (activePlayers.length <= 1) {
      endGame();
      navigate('/results');
    }
  };

  const handleEndGame = () => {
    endGame();
    setShowEndGameDialog(false);
    navigate('/results');
  };

  const getValidationStatus = () => {
    if (wordLength < 2) {
      return { text: 'Need 2+ letters to validate', icon: 'fas fa-info', color: 'text-muted-foreground' };
    }
    
    if (isValidatingWord) {
      return { text: 'Checking word...', icon: 'fas fa-spinner animate-spin', color: 'text-primary' };
    }
    
    if (wordValidationResult) {
      if (wordValidationResult.isValid && wordValidationResult.results > 0) {
        return { 
          text: `Valid word found! ${wordValidationResult.results} definitions`, 
          icon: 'fas fa-check', 
          color: 'text-green-500' 
        };
      } else {
        return { 
          text: 'Invalid word! Last player eliminated', 
          icon: 'fas fa-exclamation-triangle', 
          color: 'text-red-500' 
        };
      }
    }
    
    return { text: 'Automatic validation active', icon: 'fas fa-magic', color: 'text-primary' };
  };

  const validationStatus = getValidationStatus();

  return (
    <div className="space-y-4">
      {/* Auto Validation Status */}
      <Card className="ps-card">
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center">
            <i className="fas fa-magic mr-2 text-primary"></i>
            Auto Validation
          </h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-muted/20 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Current Word:</div>
              <div className="text-2xl font-bold tracking-widest">
                {currentWord || 'No letters yet'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Length: {wordLength} letters
              </div>
            </div>
            
            <div className={`p-3 rounded-lg border-2 ${
              validationStatus.color === 'text-green-500' 
                ? 'bg-green-500/20 border-green-500/50' 
                : validationStatus.color === 'text-red-500'
                ? 'bg-red-500/20 border-red-500/50'
                : 'bg-primary/20 border-primary/50'
            }`}>
              <div className={`flex items-center space-x-2 ${validationStatus.color}`}>
                <i className={validationStatus.icon}></i>
                <span className="font-semibold">{validationStatus.text}</span>
              </div>
              {wordValidationResult && !wordValidationResult.isValid && wordValidationResult.results === 0 && (
                <p className="text-sm mt-2 text-red-400">
                  The player who added the last letter will be eliminated automatically!
                </p>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground p-2 bg-muted/10 rounded">
              <i className="fas fa-info-circle mr-1"></i>
              Words are checked automatically when 2+ letters are formed. Invalid words eliminate the last player.
            </div>
          </div>
        </div>
      </Card>

      {/* Quit Border */}
      <Card className="ps-card">
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center">
            <i className="fas fa-door-open mr-2 text-yellow-500"></i>
            Quit Game
          </h3>
          <p className="text-sm text-muted-foreground">
            Struggling to find a letter? Exit the game voluntarily.
          </p>
          <Button 
            onClick={() => setShowQuitDialog(true)}
            variant="outline"
            className="w-full ps-button-secondary border-yellow-500 text-yellow-500 hover:bg-yellow-500/20"
          >
            <i className="fas fa-flag mr-2"></i>
            Quit Game
          </Button>
        </div>
      </Card>

      {/* End Game Border */}
      <Card className="ps-card">
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center">
            <i className="fas fa-flag-checkered mr-2 text-green-500"></i>
            Complete Word
          </h3>
          {hasValidWord ? (
            <div className="space-y-3">
              <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <div className="text-green-400 font-semibold mb-1">Valid word detected!</div>
                <p className="text-sm text-muted-foreground">
                  "{currentWord}" is a valid English word. You can end here or continue adding letters.
                </p>
              </div>
              <Button 
                onClick={() => setShowEndGameDialog(true)}
                className="w-full ps-button bg-green-600 hover:bg-green-700"
              >
                <i className="fas fa-check mr-2"></i>
                End with "{currentWord}"
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Complete the word when you have a valid English word.
              </p>
              <Button 
                onClick={() => setShowEndGameDialog(true)}
                disabled={!hasValidWord}
                variant="outline"
                className="w-full ps-button-secondary border-muted text-muted-foreground opacity-50 cursor-not-allowed"
              >
                <i className="fas fa-flag-checkered mr-2"></i>
                End Game (Need valid word)
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Quit Confirmation Dialog */}
      <Dialog open={showQuitDialog} onOpenChange={setShowQuitDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-yellow-500">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Confirm Quit
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p>Are you sure you want to quit the game?</p>
            <p className="text-sm text-muted-foreground">
              Player <span className="font-semibold">{currentPlayer?.name}</span> will be marked as "Quit" and removed from the current round.
            </p>
            <div className="flex space-x-3">
              <Button 
                onClick={handleQuit}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
              >
                <i className="fas fa-check mr-2"></i>
                Yes, Quit
              </Button>
              <Button 
                onClick={() => setShowQuitDialog(false)}
                variant="outline"
                className="ps-button-secondary flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* End Game Confirmation Dialog */}
      <Dialog open={showEndGameDialog} onOpenChange={setShowEndGameDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-500">
              <i className="fas fa-flag-checkered mr-2"></i>
              End Game
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p>Are you sure you want to end the game?</p>
            <p className="text-sm text-muted-foreground">
              The current word "<span className="font-semibold">{currentWord}</span>" has been validated. Proceed to results?
            </p>
            <div className="flex space-x-3">
              <Button 
                onClick={handleEndGame}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <i className="fas fa-check mr-2"></i>
                End Game
              </Button>
              <Button 
                onClick={() => setShowEndGameDialog(false)}
                variant="outline"
                className="ps-button-secondary flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameControls;
