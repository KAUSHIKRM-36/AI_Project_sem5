import React, { useState, useEffect } from 'react';

const Pong = () => {
  // Core game state
  const [playerY, setPlayerY] = useState(250);
  const [aiY, setAiY] = useState(250);
  const [ballPos, setBallPos] = useState({ x: 390, y: 290 });
  const [ballVelocity, setBallVelocity] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, scored
  const [lastScorer, setLastScorer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Game constants
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  const PADDLE_WIDTH = 15;
  const PADDLE_HEIGHT = 100;
  const BALL_SIZE = 10;
  const BALL_SPEED = 8;
  const PADDLE_SPEED = 10; // Reduced for even smoother movement
  const AI_DIFFICULTY = 0.95;
  const AI_REACTION_SPEED = 12;

  // Handle keyboard input with enhanced smooth movement
  useEffect(() => {
    let moveInterval;
    let direction = 0;
    let currentVelocity = 0;
    const acceleration = 0.15;
    const deceleration = 0.1;
    const maxVelocity = PADDLE_SPEED;

    const startMoving = (dir) => {
      direction = dir;
      if (!moveInterval) {
        moveInterval = setInterval(() => {
          setPlayerY(prev => {
            // Accelerate gradually
            if (Math.abs(currentVelocity) < maxVelocity) {
              currentVelocity += direction * acceleration;
            }
            
            const targetPos = prev + currentVelocity;
            const smoothing = 0.92; // Increased smoothing factor
            const newPos = prev + (targetPos - prev) * smoothing;
            return Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newPos));
          });
        }, 16);
      }
    };

    const stopMoving = () => {
      direction = 0;
      // Gradual deceleration instead of immediate stop
      const decelerateInterval = setInterval(() => {
        if (Math.abs(currentVelocity) < 0.1) {
          currentVelocity = 0;
          clearInterval(moveInterval);
          clearInterval(decelerateInterval);
          moveInterval = null;
        } else {
          currentVelocity *= (1 - deceleration);
        }
      }, 16);
    };

    const handleKeyDown = (e) => {
      if (e.key === ' ' && gameState === 'waiting') {
        startRound();
      }
      
      if (gameState === 'playing') {
        if ((e.key === 'ArrowUp' || e.key === 'w') && direction !== -1) {
          startMoving(-1);
        }
        if ((e.key === 'ArrowDown' || e.key === 's') && direction !== 1) {
          startMoving(1);
        }
      }
    };

    const handleKeyUp = (e) => {
      if ((e.key === 'ArrowUp' || e.key === 'w') && direction === -1) {
        stopMoving();
      }
      if ((e.key === 'ArrowDown' || e.key === 's') && direction === 1) {
        stopMoving();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(moveInterval);
    };
  }, [gameState]);

  // Main game loop with enhanced smoothing
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Update ball position with enhanced interpolation
      setBallPos(prev => {
        const nextX = prev.x + ballVelocity.x;
        const nextY = prev.y + ballVelocity.y;
        const smoothing = 0.95; // Increased smoothing factor
        
        return {
          x: prev.x + (nextX - prev.x) * smoothing,
          y: prev.y + (nextY - prev.y) * smoothing
        };
      });

      // Enhanced AI movement with improved smoothing
      const aiTarget = predictBallPosition();
      if (Math.abs(aiY + PADDLE_HEIGHT/2 - aiTarget) > AI_REACTION_SPEED) {
        setAiY(prev => {
          const targetPos = aiTarget > (prev + PADDLE_HEIGHT/2) ? 
            prev + PADDLE_SPEED : prev - PADDLE_SPEED;
          const smoothing = 0.92; // Increased smoothing factor
          const newPos = prev + (targetPos - prev) * smoothing * AI_DIFFICULTY;
          return Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newPos));
        });
      }

      // Check collisions
      checkCollisions();
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, ballPos, ballVelocity, playerY, aiY]);

  const startRound = () => {
    setShowResult(false);
    const direction = lastScorer === 'ai' ? 1 : -1;
    setBallPos({ x: GAME_WIDTH/2, y: GAME_HEIGHT/2 });
    setBallVelocity({
      x: BALL_SPEED * direction,
      y: (Math.random() - 0.5) * BALL_SPEED * 0.7 // Further reduced initial vertical speed
    });
    setGameState('playing');
  };

  const checkCollisions = () => {
    // Enhanced wall collisions with smoother bounce physics
    if (ballPos.y <= 0 || ballPos.y >= GAME_HEIGHT - BALL_SIZE) {
      const dampening = 0.98; // Reduced dampening for smoother bounces
      const restitution = 1.01; // Reduced restitution for more natural bounces
      
      setBallVelocity(prev => ({ 
        x: prev.x * dampening,
        y: -prev.y * restitution * dampening
      }));
      
      setBallPos(prev => ({
        ...prev,
        y: prev.y <= 0 ? 
          BALL_SIZE/2 : 
          GAME_HEIGHT - BALL_SIZE - BALL_SIZE/2
      }));
    }

    // Enhanced paddle collisions with smoother angle-based bouncing
    const playerCollision = ballPos.x <= PADDLE_WIDTH + 50 && 
                          ballPos.y >= playerY - BALL_SIZE && 
                          ballPos.y <= playerY + PADDLE_HEIGHT;
                          
    const aiCollision = ballPos.x >= GAME_WIDTH - PADDLE_WIDTH - 50 - BALL_SIZE &&
                       ballPos.y >= aiY - BALL_SIZE &&
                       ballPos.y <= aiY + PADDLE_HEIGHT;

    if (playerCollision || aiCollision) {
      const paddleY = playerCollision ? playerY : aiY;
      const relativeIntersectY = (paddleY + PADDLE_HEIGHT/2) - ballPos.y;
      const normalizedIntersect = relativeIntersectY / (PADDLE_HEIGHT/2);
      const bounceAngle = normalizedIntersect * 0.7; // Reduced angle factor for smoother bounces
      const speedIncrease = 1.02; // Further reduced speed increase
      
      setBallVelocity({
        x: (playerCollision ? BALL_SPEED : -BALL_SPEED) * speedIncrease,
        y: -BALL_SPEED * bounceAngle * speedIncrease
      });
    }

    // Scoring with delay
    if (ballPos.x <= 0 || ballPos.x >= GAME_WIDTH) {
      const scorer = ballPos.x <= 0 ? 'ai' : 'player';
      setScore(prev => ({ ...prev, [scorer]: prev[scorer] + 1 }));
      setLastScorer(scorer);
      setGameState('waiting');
      setShowResult(true);
      
      setTimeout(() => {
        setShowResult(false);
      }, 2000);
    }
  };

  const predictBallPosition = () => {
    if (ballVelocity.x < 0) return GAME_HEIGHT/2;
    
    let predictedY = ballPos.y;
    let predictedVelY = ballVelocity.y;
    let steps = (GAME_WIDTH - ballPos.x) / ballVelocity.x;
    
    for (let i = 0; i < steps; i++) {
      predictedY += predictedVelY;
      if (predictedY <= 0 || predictedY >= GAME_HEIGHT - BALL_SIZE) {
        predictedVelY = -predictedVelY * 0.98; // Reduced dampening for prediction
      }
    }
    
    return predictedY;
  };

  return (
    <div style={{ 
      width: `${GAME_WIDTH}px`, 
      height: `${GAME_HEIGHT}px`,
      backgroundColor: '#000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Instructions Button */}
      <button
        onClick={() => setShowInstructions(!showInstructions)}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
      >
        ?
      </button>

      {/* Instructions Dropdown */}
      {showInstructions && (
        <div style={{
          position: 'absolute',
          top: '4rem',
          right: '1rem',
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '250px',
          zIndex: 1000
        }}>
          <h3 style={{ marginBottom: '0.5rem' }}>How to Play:</h3>
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li>Use Arrow Keys or W/S to move your paddle up and down</li>
            <li>Press SPACE to start the game</li>
            <li>Hit the ball with your paddle to return it</li>
            <li>Score points by getting the ball past the AI's paddle</li>
            <li>First to score wins the round!</li>
          </ul>
        </div>
      )}

      {(gameState === 'waiting' && !showResult) && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2>Press SPACE to Start</h2>
          <p>Use Arrow Keys or W/S to move</p>
        </div>
      )}

      {showResult && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          <h2>{lastScorer === 'player' ? 'You Scored!' : 'AI Scored!'}</h2>
        </div>
      )}

      {/* Paddles */}
      <div style={{
        position: 'absolute',
        left: '50px',
        top: `${playerY}px`,
        width: `${PADDLE_WIDTH}px`,
        height: `${PADDLE_HEIGHT}px`,
        backgroundColor: 'white',
        transition: 'top 0.016s linear'
      }} />

      <div style={{
        position: 'absolute',
        right: '50px',
        top: `${aiY}px`,
        width: `${PADDLE_WIDTH}px`,
        height: `${PADDLE_HEIGHT}px`,
        backgroundColor: 'white',
        transition: 'top 0.016s linear'
      }} />

      {/* Ball */}
      <div style={{
        position: 'absolute',
        left: `${ballPos.x}px`,
        top: `${ballPos.y}px`,
        width: `${BALL_SIZE}px`,
        height: `${BALL_SIZE}px`,
        backgroundColor: 'white',
        borderRadius: '50%',
        transition: 'all 0.016s linear',
        transform: 'translate3d(0,0,0)' // Hardware acceleration
      }} />

      {/* Player Labels */}
      <div style={{
        position: 'absolute',
        width: '100%',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        color: 'white',
        fontSize: '24px'
      }}>
        <span>Player</span>
        <span>AI</span>
      </div>
    </div>
  );
};

export default Pong;
