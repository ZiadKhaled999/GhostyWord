import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Player } from '../lib/stores/usePlayersStore';

interface PlayerCardProps {
  player: Player;
  playerNumber: number;
  onEdit: (newName: string) => void;
  onRemove: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  playerNumber,
  onEdit,
  onRemove,
  className = '',
  style
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState(player.name);

  const handleEdit = () => {
    if (editName.trim() && editName.trim() !== player.name) {
      onEdit(editName.trim());
    }
    setIsEditDialogOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    }
  };

  const getStatusIcon = () => {
    switch (player.status) {
      case 'continuer':
        return <i className="fas fa-play text-green-500"></i>;
      case 'quit':
        return <i className="fas fa-door-open text-yellow-500"></i>;
      case 'executed':
        return <i className="fas fa-times text-red-500"></i>;
      default:
        return <i className="fas fa-user text-primary"></i>;
    }
  };

  return (
    <Card className={`ps-card ${className}`} style={style}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Player Number */}
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
            {playerNumber}
          </div>
          
          {/* Player Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-semibold">{player.name}</h3>
              {getStatusIcon()}
            </div>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <span>Wins: {player.wins}</span>
              <span>Losses: {player.losses}</span>
              <span>XP: {player.xp}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {/* Edit Button */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="ps-button-secondary"
                onClick={() => setEditName(player.name)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Edit Player Name</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  type="text"
                  placeholder="Enter new name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-lg py-3"
                  autoFocus
                />
                <div className="flex space-x-3">
                  <Button 
                    onClick={handleEdit}
                    disabled={!editName.trim() || editName.trim() === player.name}
                    className="ps-button flex-1"
                  >
                    <i className="fas fa-check mr-2"></i>
                    Save
                  </Button>
                  <Button 
                    onClick={() => setIsEditDialogOpen(false)}
                    variant="outline"
                    className="ps-button-secondary flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Remove Button */}
          <Button 
            size="sm" 
            variant="outline"
            className="ps-button-secondary text-red-500 hover:bg-red-500/20"
            onClick={onRemove}
          >
            <i className="fas fa-trash"></i>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PlayerCard;
