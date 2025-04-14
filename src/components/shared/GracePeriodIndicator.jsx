// src/components/shared/GracePeriodIndicator.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

// Keyframes for the countdown animation
const countdown = keyframes`
  from {
    stroke-dashoffset: 0px;
  }
  to {
    stroke-dashoffset: 113px; // Circumference of the circle (2 * pi * r = 2 * 3.14159 * 18)
  }
`;

// Styled container for the indicator
const IndicatorContainer = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  margin: 5px auto; // Reduced margin
`;

// SVG element for the circle timer
const TimerCircle = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotateY(-180deg) rotateZ(-90deg); // Correct orientation
  overflow: visible; // Ensure the stroke isn't clipped

  circle {
    stroke-dasharray: 113px; // Circumference
    stroke-dashoffset: 0px;
    stroke-linecap: round;
    stroke-width: 4px; // Stroke width
    stroke: #00aaff; // Color of the timer line
    fill: none;
    animation: ${countdown} ${props => props.duration}s linear infinite forwards;
  }
`;

// Styled component for the time left text
const StyledTimeLeft = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8em; // Slightly smaller font size
  font-weight: bold;
  color: #333;
`;
// <<< REMOVED LINE: export default StyledTimeLeft; >>> This was the cause of the syntax error

const GracePeriodIndicator = ({ gracePeriodEnds }) => {
  const [timeLeft, setTimeLeft] = React.useState('');
  const [duration, setDuration] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const ends = new Date(gracePeriodEnds);
      const diff = ends - now;

      if (diff <= 0) {
        setTimeLeft('0s');
        clearInterval(intervalId);
        // Optionally trigger an action when the grace period ends
        return;
      }

      const totalDurationInSeconds = (new Date(gracePeriodEnds) - new Date()) / 1000; // Calculate initial duration dynamically if needed or set fixed
      // For animation duration, calculate the initial total seconds
      if(duration === 0) {
          const start = new Date(); // Ideally, we'd know when the grace period *started*
          const initialDuration = (ends - start) / 1000; // This might not be accurate if component mounts later
          // A better approach is to pass the original duration or calculate based on creation time + grace period length
          setDuration(Math.max(initialDuration, 1)); // Ensure duration is at least 1s
      }


      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      // Add hours or days if needed
      // setTimeLeft(`${minutes}m ${seconds}s`);
      setTimeLeft(`${seconds}s`); // Simplified to seconds for the example

    }, 1000);

    // Calculate initial duration for the animation when component mounts
    const initialEnds = new Date(gracePeriodEnds);
    const initialNow = new Date();
    const initialDiff = (initialEnds - initialNow) / 1000;
    setDuration(Math.max(initialDiff, 1)); // Use the actual remaining time as duration

    return () => clearInterval(intervalId);
  }, [gracePeriodEnds]); // Removed 'duration' from deps as it's set inside

  if (!gracePeriodEnds || new Date(gracePeriodEnds) < new Date()) {
    return null; // Don't render if grace period is over or not set
  }

  return (
    <IndicatorContainer>
      <TimerCircle viewBox="0 0 40 40" duration={duration}>
        {/* Background Circle */}
        <circle cx="20" cy="20" r="18" stroke="#e6e6e6" strokeWidth="4" fill="none" />
        {/* Timer Circle */}
        <circle cx="20" cy="20" r="18" />
      </TimerCircle>
      <StyledTimeLeft>{timeLeft}</StyledTimeLeft>
    </IndicatorContainer>
  );
};

GracePeriodIndicator.propTypes = {
  gracePeriodEnds: PropTypes.string.isRequired, // ISO string format date
};

export default GracePeriodIndicator; // Keep this as the only default export
