import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePlayersStore } from '../lib/stores/usePlayersStore';
import { shareVictoryPage, downloadPageAsPNG } from '../lib/shareUtils';
import VictoryAnimation from '../components/VictoryAnimation';

const VictoryPage: React.FC = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const { players, resetGame } = usePlayersStore();

  // Find the winner (player with highest wins, lowest losses, highest XP)
  const winner = [...players].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (a.losses !== b.losses) return a.losses - b.losses;
    if (b.xp !== a.xp) return b.xp - a.xp;
    const statusOrder = { continuer: 0, quit: 1, executed: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  })[0];

  const handleShare = async () => {
    try {
      await shareVictoryPage(winner.name);
    } catch (error) {
      console.error('Sharing failed:', error);
      // Show user-friendly message
      alert('Unable to share automatically. Please share manually or copy the page link.');
    }
  };

  const handleDownload = async () => {
    if (pageRef.current) {
      try {
        await downloadPageAsPNG(pageRef.current, `ghosty-word-victory-${winner.name}`);
      } catch (error) {
        console.error('Download failed:', error);
        // Show user-friendly message
        alert('Unable to download image. Please take a screenshot manually.');
      }
    }
  };

  const handleStartOver = () => {
    resetGame();
    navigate('/add-players');
  };

  return (
    <div 
      ref={pageRef} 
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden"
    >
      {/* Animated Background */}
      <VictoryAnimation />
      
      {/* Main Victory Container */}
      <div className="w-full max-w-6xl mx-auto z-10 space-y-8">
        
        {/* Winner Showcase */}
        <Card className="ps-card text-center shadow-2xl slide-up border-2 border-primary/50">
          <div className="space-y-8 py-12 px-8">
            {/* Crown and Title */}
            <div className="space-y-6">
              <div className="text-9xl floating-animation filter drop-shadow-lg">
                👑
              </div>
              <div className="space-y-4">
                <h1 className="ghost-title text-6xl md:text-8xl font-black tracking-wider">
                  CHAMPION
                </h1>
                <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text">
                  <h2 className="text-4xl md:text-6xl font-bold">
                    {winner.name}
                  </h2>
                </div>
              </div>
            </div>
            
            {/* Winner Badge */}
            <div className="relative">
              <div className="text-7xl md:text-9xl font-black text-yellow-500 bounce-animation filter drop-shadow-xl">
                🏆 WINNER 🏆
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 blur-3xl"></div>
            </div>
          </div>
        </Card>

        {/* Stats and Achievement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Performance Stats */}
          <Card className="ps-card slide-up shadow-xl" style={{ animationDelay: '0.2s' }}>
            <div className="text-center space-y-4 py-8">
              <div className="text-5xl">📊</div>
              <h3 className="text-xl font-bold text-primary">Performance</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-500">{winner.wins}</div>
                  <div className="text-xs text-muted-foreground">Wins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">{winner.losses}</div>
                  <div className="text-xs text-muted-foreground">Losses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{winner.xp}</div>
                  <div className="text-xs text-muted-foreground">XP</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Achievement Badge */}
          <Card className="ps-card slide-up shadow-xl" style={{ animationDelay: '0.4s' }}>
            <div className="text-center space-y-4 py-8">
              <div className="text-5xl">🎯</div>
              <h3 className="text-xl font-bold text-primary">Status</h3>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-yellow-500">VICTORIOUS</div>
                <div className="text-sm text-muted-foreground">Word Master Champion</div>
              </div>
            </div>
          </Card>

          {/* Game Info */}
          <Card className="ps-card slide-up shadow-xl" style={{ animationDelay: '0.6s' }}>
            <div className="text-center space-y-4 py-8">
              <div className="text-5xl">⚡</div>
              <h3 className="text-xl font-bold text-primary">Ghosty Word</h3>
              <div className="space-y-2">
                <div className="text-lg font-semibold">Victory Achieved!</div>
                <div className="text-sm text-muted-foreground">Professional Word Game</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Button 
            onClick={handleShare}
            className="ps-button px-10 py-5 text-lg shadow-2xl hover:shadow-primary/25 transition-all duration-300"
          >
            <i className="fas fa-share-alt mr-3"></i>
            Share Victory
          </Button>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="ps-button-secondary px-10 py-5 text-lg shadow-xl"
          >
            <i className="fas fa-download mr-3"></i>
            Download Image
          </Button>
          
          <Button 
            onClick={handleStartOver}
            variant="outline"
            className="ps-button-secondary px-10 py-5 text-lg shadow-xl border-yellow-500 text-yellow-500 hover:bg-yellow-500/20"
          >
            <i className="fas fa-redo mr-3"></i>
            Play Again
          </Button>
        </div>
      </div>
      
      {/* Celebratory Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Books */}
        <div className="absolute top-20 left-20 text-6xl floating-animation delay-500">📚</div>
        <div className="absolute bottom-40 right-32 text-5xl floating-animation delay-1000">📖</div>
        <div className="absolute top-40 right-20 text-4xl floating-animation delay-1500">📝</div>
        
        {/* Crowns */}
        <div className="absolute top-32 left-1/3 text-4xl victory-sparkle">👑</div>
        <div className="absolute bottom-32 right-1/4 text-3xl victory-sparkle delay-700">👑</div>
        
        {/* Stars */}
        <div className="absolute top-16 right-1/3 text-5xl victory-sparkle delay-300">⭐</div>
        <div className="absolute bottom-20 left-1/4 text-4xl victory-sparkle delay-1200">⭐</div>
        <div className="absolute top-1/2 left-16 text-3xl victory-sparkle delay-900">✨</div>
        <div className="absolute top-1/3 right-16 text-3xl victory-sparkle delay-600">✨</div>
        
        {/* Letters */}
        <div className="absolute top-24 left-1/2 text-4xl text-primary/30 floating-animation delay-200">W</div>
        <div className="absolute bottom-24 left-1/3 text-3xl text-primary/40 floating-animation delay-800">I</div>
        <div className="absolute top-1/2 right-32 text-5xl text-primary/20 floating-animation delay-400">N</div>
        <div className="absolute bottom-16 right-1/2 text-4xl text-primary/35 floating-animation delay-1100">!</div>
      </div>
    </div>
  );
};

export default VictoryPage;
