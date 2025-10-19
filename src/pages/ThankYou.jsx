import React, { useEffect } from 'react';
import './ThankYou.css';

const ThankYou = () => {
  useEffect(() => {
    new Audio('/sounds/complete.mp3').play();
  }, []);

  return (
    <div className="thankyou-container">
      <p>Thank you for participating in <strong>ALGO HUNT</strong>!</p>
      <p>Your responses have been recorded.</p>
    </div>
  );
};

export default ThankYou;
