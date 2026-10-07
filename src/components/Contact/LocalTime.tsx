import React, { useState, useEffect } from 'react';

export const LocalTime: React.FC = () => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });

    const updateTime = () => {
      const now = new Date();
      const formatted = formatter.format(now).toLowerCase();
      setTimeString(`Local time · ${formatted} IST`);
    };

    updateTime();
    const interval = window.setInterval(updateTime, 30000);
    return () => window.clearInterval(interval);
  }, []);

  if (!timeString) {
    return <span className="opacity-0">Local time · --:-- IST</span>;
  }

  return <span>{timeString}</span>;
};
