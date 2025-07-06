import React from 'react';

const AnimationLoader = () => {
  return (
    <div className="flex space-x-2 justify-center items-center h-full">
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
    </div>
  );
};

export default AnimationLoader;
