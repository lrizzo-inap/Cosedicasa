// src/components/shared/GracePeriodIndicator.jsx
import React, { useState, useEffect } from 'react';

export default function GracePeriodIndicator({ endTime }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endTime);
      const now = new Date();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Time expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m remaining`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex items-center mt-1 text-xs text-orange-600">
      <span className="mr-1">⏳</span>
      {timeLeft}
    </div>
  );
};

export default GracePeriodIndicator;