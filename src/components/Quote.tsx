import React from 'react';

interface QuoteProps {
  text: string;
  top: string;
  delay: number;
  duration: number;
}

const Quote: React.FC<QuoteProps> = ({ text, top, delay, duration }) => {
  return (
    <div 
      className="absolute quote text-white text-xl md:text-2xl font-light tracking-wider"
      style={{
        top,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
      }}
    >
      {text}
    </div>
  );
};

export default Quote;