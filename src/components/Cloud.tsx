import React from 'react';

interface CloudProps {
  size: number;
  top: string;
  delay: number;
  duration: number;
}

const Cloud: React.FC<CloudProps> = ({ size, top, delay, duration }) => {
  return (
    <div 
      className="absolute cloud"
      style={{
        top,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        width: `${size * 3}px`,
        height: `${size}px`
      }}
    >
      <div 
        className="absolute bg-white rounded-full opacity-90"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top: '0',
          left: `${size}px`
        }}
      />
      <div 
        className="absolute bg-white rounded-full opacity-90"
        style={{
          width: `${size * 1.5}px`,
          height: `${size * 1.5}px`,
          top: `${-size * 0.25}px`,
          left: `${size * 0.5}px`
        }}
      />
      <div 
        className="absolute bg-white rounded-full opacity-90"
        style={{
          width: `${size * 1.2}px`,
          height: `${size * 1.2}px`,
          top: '0',
          left: '0'
        }}
      />
      <div 
        className="absolute bg-white rounded-full opacity-90"
        style={{
          width: `${size * 1.3}px`,
          height: `${size * 1.3}px`,
          top: `${-size * 0.1}px`,
          left: `${size * 1.8}px`
        }}
      />
    </div>
  );
};

export default Cloud;