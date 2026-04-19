import { useState, useEffect } from 'react';

const PromoBanner = () => {
  const [seconds, setSeconds] = useState(900
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs < 10 ? '0' : ''}${rs}`;
  };

  return (
    <div className="promo-banner">
      Акція: Орендуй протягом 15 хвилин і отримай знижку 10%! Таймер: <strong>{formatTime(seconds)}</strong>
    </div>
  );
};

export default PromoBanner;