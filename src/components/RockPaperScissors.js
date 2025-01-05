import React, { useState, useEffect } from 'react';

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const choices = ['rock', 'paper', 'scissors'];

  const images = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
  };

  const getComputerChoice = () => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const handlePlayerChoice = (choice) => {
    setResult(null);
    setShowResult(false);
    setIsAnimating(true);
    setPlayerChoice(choice);
    const computerMove = getComputerChoice();
    setComputerChoice(computerMove);
    determineWinner(choice, computerMove);
    setShowResult(true);
    setIsAnimating(false);
    
    // Reset board after showing result for 2 seconds
    setTimeout(() => {
      setPlayerChoice(null);
      setComputerChoice(null);
      setResult(null);
      setShowResult(false);
      setIsAnimating(false);
    }, 2000);
  };

  const determineWinner = (player, computer) => {
    if (player === computer) {
      setResult("It's a tie!");
    } else if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      setResult('You win!');
      setScore(prev => ({...prev, player: prev.player + 1}));
    } else {
      setResult('Computer wins!');
      setScore(prev => ({...prev, computer: prev.computer + 1}));
    }
  };

  return (
    <div className="rock-paper-scissors" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: 'var(--surface)',
      borderRadius: '20px',
      boxShadow: 'var(--card-shadow)',
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative'
    }}>
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
            <li>Click on rock, paper, or scissors to make your choice</li>
            <li>Rock beats scissors</li>
            <li>Scissors beats paper</li>
            <li>Paper beats rock</li>
            <li>First to win gets a point!</li>
          </ul>
        </div>
      )}

      <h2 style={{
        fontSize: '2.5rem',
        color: 'var(--primary)',
        marginBottom: '2rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        Rock Paper Scissors
      </h2>
      
      <div className="score" style={{
        fontSize: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        gap: '2rem'
      }}>
        <span>Player: {score.player}</span>
        <span>Computer: {score.computer}</span>
      </div>

      {!playerChoice ? (
        <div className="choices" style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          opacity: playerChoice ? 0 : 1,
          transition: 'opacity 0.5s ease'
        }}>
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handlePlayerChoice(choice)}
              style={{
                fontSize: '3rem',
                padding: '2rem',
                borderRadius: '15px',
                border: '3px solid var(--primary)',
                backgroundColor: 'var(--background)',
                color: 'var(--text)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: 'var(--button-shadow)',
              }}
            >
              {images[choice]}
            </button>
          ))}
        </div>
      ) : (
        <div className="battle-screen" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3rem',
          marginTop: '2rem',
          opacity: playerChoice ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }}>
          <div className="player-choice" style={{
            fontSize: '8rem',
            animation: isAnimating ? 'bounce 0.5s ease' : 'none'
          }}>
            {images[playerChoice]}
          </div>
          
          <div style={{ fontSize: '4rem', fontWeight: 'bold' }}>VS</div>
          
          <div className="computer-choice" style={{
            fontSize: '8rem',
            animation: 'bounce 0.5s ease'
          }}>
            {computerChoice && images[computerChoice]}
          </div>
        </div>
      )}

      {result && showResult && (
        <p style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginTop: '2rem',
          color: result === 'You win!' ? 'var(--primary)' : 
                 result === 'Computer wins!' ? 'var(--error)' : 
                 'var(--text)',
          animation: 'fadeIn 0.5s ease'
        }}>
          {result}
        </p>
      )}
    </div>
  );
};

export default RockPaperScissors;
