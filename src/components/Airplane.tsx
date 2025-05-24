import React from 'react';

const Airplane: React.FC = () => {
  return (
    <div className="airplane absolute">
      <div className="relative w-20 h-20 md:w-32 md:h-32">
        {/* Main Fuselage */}
        <div className="absolute w-[70%] h-[25%] bg-blue-400 rounded-[30px] left-[15%] top-[40%] z-10" />
        
        {/* Nose Cone */}
        <div className="absolute w-[25%] h-[20%] bg-blue-400 left-[80%] top-[42.5%] z-10"
             style={{
               clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
               backgroundColor: '#60A5FA'
             }} />
        
        {/* Tail Section */}
        <div className="absolute w-[20%] h-[40%] left-[5%] top-[20%] z-20"
             style={{
               clipPath: 'polygon(100% 100%, 0 0, 100% 0)',
               backgroundColor: '#60A5FA'
             }} />
        
        {/* Main Wing */}
        <div className="absolute w-[60%] h-[8%] left-[25%] top-[55%] z-0"
             style={{
               clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)',
               backgroundColor: '#93C5FD'
             }} />
        
        {/* Horizontal Stabilizer */}
        <div className="absolute w-[30%] h-[6%] left-[10%] top-[45%] z-0"
             style={{
               clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)',
               backgroundColor: '#93C5FD'
             }} />
        
        {/* Windows */}
        <div className="absolute w-[40%] h-[12%] left-[35%] top-[43%] bg-sky-200 rounded-[20px] z-20 flex justify-around items-center">
          <div className="w-[15%] h-[60%] bg-white rounded-full" />
          <div className="w-[15%] h-[60%] bg-white rounded-full" />
          <div className="w-[15%] h-[60%] bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Airplane;