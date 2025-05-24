import React from 'react';
import Sky from './Sky';
import Cloud from './Cloud';
import Airplane from './Airplane';
import Quote from './Quote';

const AnimatedScene: React.FC = () => {
  // Generate clouds with different properties
  const clouds = [
    { size: 40, top: '15%', delay: 0, duration: 60 },
    { size: 60, top: '30%', delay: 15, duration: 75 },
    { size: 50, top: '60%', delay: 5, duration: 65 },
    { size: 70, top: '70%', delay: 25, duration: 80 },
    { size: 45, top: '40%', delay: 35, duration: 70 },
    { size: 55, top: '25%', delay: 45, duration: 85 },
    { size: 65, top: '50%', delay: 10, duration: 90 },
  ];

  // Inspirational quotes
  const quotes = [
    { text: "Life is a journey, not a destination", top: '20%', delay: 0, duration: 40 },
    { text: "The sky is not the limit", top: '45%', delay: 15, duration: 45 },
    { text: "Spread your wings and soar", top: '75%', delay: 30, duration: 42 },
    { text: "Dream big, fly high", top: '35%', delay: 20, duration: 38 },
    { text: "Every day is a new horizon", top: '60%', delay: 10, duration: 44 }
  ];

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Sky />
      
      {/* Render all clouds */}
      {clouds.map((cloud, index) => (
        <Cloud 
          key={index}
          size={cloud.size}
          top={cloud.top}
          delay={cloud.delay}
          duration={cloud.duration}
        />
      ))}

      {/* Render all quotes */}
      {quotes.map((quote, index) => (
        <Quote
          key={index}
          text={quote.text}
          top={quote.top}
          delay={quote.delay}
          duration={quote.duration}
        />
      ))}
      
      <Airplane />
    </div>
  );
};

export default AnimatedScene;