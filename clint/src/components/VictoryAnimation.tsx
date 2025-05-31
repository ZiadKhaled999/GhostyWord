import React from 'react';

const VictoryAnimation: React.FC = () => {
  // Generate random positions for floating elements
  const generateFloatingElements = (count: number, emoji: string) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
      size: 20 + Math.random() * 20,
    }));
  };

  const sparkles = generateFloatingElements(15, '✨');
  const confetti = generateFloatingElements(20, '🎉');
  const stars = generateFloatingElements(10, '⭐');

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10"></div>
      
      {/* Animated Circles */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/10 blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-primary/5 blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-32 w-24 h-24 rounded-full bg-primary/15 blur-xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-40 right-10 w-36 h-36 rounded-full bg-primary/8 blur-2xl animate-pulse delay-500"></div>
      
      {/* Floating Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={`sparkle-${sparkle.id}`}
          className="absolute text-yellow-300 victory-sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            fontSize: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        >
          {sparkle.emoji}
        </div>
      ))}
      
      {/* Floating Confetti */}
      {confetti.map((item) => (
        <div
          key={`confetti-${item.id}`}
          className="absolute floating-animation"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: `${item.size}px`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        >
          {item.emoji}
        </div>
      ))}
      
      {/* Floating Stars */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute text-yellow-400 pulse-animation"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            fontSize: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        >
          {star.emoji}
        </div>
      ))}
      
      {/* Radial Light Effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-radial from-primary/20 via-primary/5 to-transparent blur-3xl animate-pulse"></div>
      
      {/* Floating Letters */}
      <div className="absolute top-16 left-1/4 text-6xl text-primary/20 floating-animation font-bold">V</div>
      <div className="absolute top-20 right-1/3 text-5xl text-primary/30 floating-animation delay-500 font-bold">I</div>
      <div className="absolute bottom-32 left-1/5 text-7xl text-primary/15 floating-animation delay-1000 font-bold">C</div>
      <div className="absolute bottom-28 right-1/4 text-6xl text-primary/25 floating-animation delay-700 font-bold">T</div>
      <div className="absolute top-1/3 left-12 text-5xl text-primary/20 floating-animation delay-1200 font-bold">O</div>
      <div className="absolute top-2/3 right-16 text-6xl text-primary/30 floating-animation delay-300 font-bold">R</div>
      <div className="absolute bottom-1/4 left-1/2 text-8xl text-primary/10 floating-animation delay-900 font-bold">Y</div>
    </div>
  );
};

export default VictoryAnimation;
