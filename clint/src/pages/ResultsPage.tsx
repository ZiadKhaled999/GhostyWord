import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePlayersStore } from '../lib/stores/usePlayersStore';
import { useGameStore } from '../lib/stores/useGameStore';
import ResultsTable from '../components/ResultsTable';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { players } = usePlayersStore();
  const { currentRound } = useGameStore();

  const handleNext = () => {
    navigate('/victory');
  };

  const handleBackToGame = () => {
    navigate('/game');
  };

  // Sort players by wins (desc), losses (asc), XP (desc), status
  const sortedPlayers = [...players].sort((a, b) => {
    // First by wins (descending)
    if (b.wins !== a.wins) return b.wins - a.wins;
    
    // Then by losses (ascending)
    if (a.losses !== b.losses) return a.losses - b.losses;
    
    // Then by XP (descending)
    if (b.xp !== a.xp) return b.xp - a.xp;
    
    // Finally by status (continuer > quit > executed)
    const statusOrder = { continuer: 0, quit: 1, executed: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-12 fade-in">
        <h1 className="ghost-title text-4xl md:text-6xl font-bold mb-4">
          Game Results
        </h1>
        <p className="text-muted-foreground text-lg">
          Round {currentRound} Complete
        </p>
      </div>

      {/* Results Table */}
      <div className="flex-1 max-w-6xl mx-auto w-full">
        <Card className="ps-card slide-up">
          <div className="mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <i className="fas fa-trophy mr-3 text-yellow-500"></i>
              Final Rankings
            </h2>
            <p className="text-muted-foreground mt-2">
              Players ranked by performance
            </p>
          </div>
          
          <ResultsTable players={sortedPlayers} />
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="ps-card text-center slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-2">
              <i className="fas fa-gamepad text-4xl text-primary"></i>
              <h3 className="text-xl font-bold">Total Rounds</h3>
              <p className="text-3xl font-bold text-primary">{currentRound}</p>
            </div>
          </Card>
          
          <Card className="ps-card text-center slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="space-y-2">
              <i className="fas fa-users text-4xl text-primary"></i>
              <h3 className="text-xl font-bold">Active Players</h3>
              <p className="text-3xl font-bold text-primary">
                {players.filter(p => p.status === 'continuer').length}
              </p>
            </div>
          </Card>
          
          <Card className="ps-card text-center slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="space-y-2">
              <i className="fas fa-star text-4xl text-primary"></i>
              <h3 className="text-xl font-bold">Highest XP</h3>
              <p className="text-3xl font-bold text-primary">
                {Math.max(...players.map(p => p.xp))}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-12">
        <Button 
          onClick={handleBackToGame}
          variant="outline"
          className="ps-button-secondary"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Game
        </Button>
        
        <Button 
          onClick={handleNext}
          className="ps-button text-xl px-12 py-6 shadow-2xl hover:shadow-primary/25"
        >
          Next
          <i className="fas fa-arrow-right ml-3"></i>
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
