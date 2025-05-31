import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { usePlayersStore } from '../lib/stores/usePlayersStore';
import PlayerCard from '../components/PlayerCard';

const AddPlayersPage: React.FC = () => {
  const navigate = useNavigate();
  const { players, addPlayer, removePlayer, updatePlayer } = usePlayersStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
      setIsDialogOpen(false);
    }
  };

  const handleStartGame = () => {
    if (players.length >= 2) {
      navigate('/game');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-8">
      {/* Header */}
      <div className="text-center mb-12 fade-in">
        <h1 className="ghost-title text-4xl md:text-6xl font-bold mb-4">
          Add Players
        </h1>
        <p className="text-muted-foreground text-lg">
          Add at least 2 players to start the game
        </p>
      </div>

      {/* Players List */}
      <div className="flex-1 max-w-4xl mx-auto w-full">
        {players.length > 0 ? (
          <div className="space-y-4 mb-8">
            {players.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                playerNumber={index + 1}
                onEdit={(newName) => updatePlayer(player.id, newName)}
                onRemove={() => removePlayer(player.id)}
                className="slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        ) : (
          <Card className="ps-card text-center py-16 mb-8">
            <div className="space-y-4">
              <i className="fas fa-users text-6xl text-muted-foreground"></i>
              <h3 className="text-2xl font-semibold text-muted-foreground">
                No players added yet
              </h3>
              <p className="text-muted-foreground">
                Click the "Add Player" button to get started
              </p>
            </div>
          </Card>
        )}

        {/* Start Game Button */}
        {players.length >= 2 && (
          <div className="text-center slide-up">
            <Button 
              onClick={handleStartGame}
              className="ps-button text-xl px-12 py-6 shadow-2xl hover:shadow-primary/25"
            >
              <i className="fas fa-play mr-3"></i>
              Start Game
            </Button>
          </div>
        )}
      </div>

      {/* Add Player Button */}
      <div className="fixed bottom-8 right-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ps-button rounded-full w-16 h-16 shadow-2xl hover:shadow-primary/25">
              <i className="fas fa-plus text-2xl"></i>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New Player</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                type="text"
                placeholder="Enter player name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg py-3"
                autoFocus
              />
              <div className="flex space-x-3">
                <Button 
                  onClick={handleAddPlayer}
                  disabled={!newPlayerName.trim()}
                  className="ps-button flex-1"
                >
                  <i className="fas fa-check mr-2"></i>
                  Done
                </Button>
                <Button 
                  onClick={() => setIsDialogOpen(false)}
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

      {/* Back Button */}
      <div className="fixed top-8 left-8">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="ps-button-secondary"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back
        </Button>
      </div>
    </div>
  );
};

export default AddPlayersPage;
