import React, { useEffect, useState } from 'react';

interface StatusProps {
  status: 'listening' | 'generating' | 'connected' | 'disconnected';
}

const Status = ({ status }: StatusProps) => {
  const [isBlinking, setIsBlinking] = useState(false); // Whether the circle should blink

  // Set blinking state based on the status
//   useEffect(() => {
//     if (status === 'generating') {
//       setIsBlinking(true);  // Set blinking when generating
//     } else {
//       setIsBlinking(false); // Turn off blinking for other statuses
//     }
//   }, [status]);

  const getStatusDetails = () => {
    switch (status) {
      case 'listening':
        return { color: 'bg-blue-500', message: 'Listening' };
      case 'generating':
        return { color: 'bg-sky-500', message: 'Generating' };
      case 'connected':
        return { color: 'bg-green-500', message: 'Connected' };
      case 'disconnected':
        return { color: 'bg-red-500', message: 'Disconnected' };
      default:
        return { color: 'bg-gray-500', message: 'Unknown' };
    }
  };

  const { color, message } = getStatusDetails();

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-4 h-4 rounded-full ${isBlinking ? 'animate-pulse' : ''} ${color}`}
      ></div>
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default Status;
