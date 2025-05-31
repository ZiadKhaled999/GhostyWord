import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GhostLogo from '../assets/ghost-logo.svg';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const handleJoinGame = () => {
    navigate('/add-players');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-32 h-32 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 rounded-full bg-primary/15 blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 rounded-full bg-primary/25 blur-lg animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center space-y-12 z-10">
        {/* Logo */}
        <div className="floating-animation">
          <img 
            src={GhostLogo} 
            alt="Ghosty Word Logo" 
            className="w-64 h-64 drop-shadow-2xl"
          />
        </div>

        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="ghost-title text-6xl md:text-8xl font-black tracking-wider">
            GHOSTY
          </h1>
          <h2 className="ghost-title text-4xl md:text-6xl font-bold tracking-widest">
            WORD
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto">
            Professional PlayStation-styled multiplayer word formation game
          </p>
        </div>

        {/* Decorative elements */}
        <div className="flex space-x-8 text-primary/60">
          <i className="fas fa-crown text-3xl floating-animation delay-500"></i>
          <i className="fas fa-trophy text-3xl floating-animation delay-1000"></i>
          <i className="fas fa-star text-3xl floating-animation delay-1500"></i>
        </div>
      </div>

      {/* Join Game Button */}
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <Button 
          onClick={handleJoinGame}
          className="ps-button text-xl px-12 py-6 shadow-2xl hover:shadow-primary/25"
        >
          <i className="fas fa-play mr-3"></i>
          Join Game
        </Button>
      </div>

      {/* Floating letters animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 text-primary/30 text-2xl font-bold floating-animation">W</div>
        <div className="absolute top-40 right-32 text-primary/20 text-3xl font-bold floating-animation delay-700">O</div>
        <div className="absolute bottom-32 left-16 text-primary/25 text-2xl font-bold floating-animation delay-1200">R</div>
        <div className="absolute bottom-20 right-24 text-primary/30 text-2xl font-bold floating-animation delay-300">D</div>
        <div className="absolute top-60 left-1/2 text-primary/15 text-4xl font-bold floating-animation delay-900">S</div>
      </div>
    </div>
  );
};

export default MainPage;
