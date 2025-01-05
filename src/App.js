import React, { useState } from 'react';
import TicTacToe from './components/TicTacToe';
import RockPaperScissors from './components/RockPaperScissors';
import ConnectFour from './components/ConnectFour';
import Checkers from './components/Checkers';
import './App.css';

function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [key, setKey] = useState(0);

  const renderGame = () => {
    switch (currentGame) {
      case 'tictactoe':
        return React.createElement(TicTacToe, { key });
      case 'rockpaperscissors':
        return React.createElement(RockPaperScissors, { key });
      case 'connectfour':
        return React.createElement(ConnectFour, { key });
      case 'checkers':
        return React.createElement(Checkers, { key });
      default:
        return null;
    }
  };

  const handleRetry = () => {
    setKey(prevKey => prevKey + 1);
  };

  return React.createElement(
    'div',
    { className: 'App' },
    React.createElement(
      'header',
      { className: 'App-header' },
      React.createElement('h1', null, 'Arcade Gaming')
    ),
    React.createElement(
      'main',
      null,
      currentGame
        ? React.createElement(
            'div',
            null,
            renderGame(),
            React.createElement(
              'div',
              { 
                style: { 
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  marginTop: '2rem'
                }
              },
              React.createElement(
                'button',
                { 
                  onClick: handleRetry,
                  className: 'back-button',
                  style: { 
                    padding: '0.75rem 1.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--surface)',
                    backgroundColor: 'var(--warning)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'var(--button-shadow)',
                    position: 'relative',
                    overflow: 'hidden'
                  },
                  onMouseEnter: (e) => {
                    e.target.style.backgroundColor = '#b45309';
                    e.target.style.boxShadow = 'var(--button-hover-shadow)';
                    e.target.style.transform = 'translateY(-2px)';
                  },
                  onMouseLeave: (e) => {
                    e.target.style.backgroundColor = 'var(--warning)';
                    e.target.style.boxShadow = 'var(--button-shadow)';
                    e.target.style.transform = 'translateY(0)';
                  }
                },
                'Retry Game'
              ),
              React.createElement(
                'button',
                { 
                  onClick: () => setCurrentGame(null), 
                  className: 'back-button',
                  style: { 
                    padding: '0.75rem 1.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--surface)',
                    backgroundColor: 'var(--primary)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'var(--button-shadow)',
                    position: 'relative',
                    overflow: 'hidden'
                  },
                  onMouseEnter: (e) => {
                    e.target.style.backgroundColor = 'var(--primary-dark)';
                    e.target.style.boxShadow = 'var(--button-hover-shadow)';
                    e.target.style.transform = 'translateY(-2px)';
                  },
                  onMouseLeave: (e) => {
                    e.target.style.backgroundColor = 'var(--primary)';
                    e.target.style.boxShadow = 'var(--button-shadow)';
                    e.target.style.transform = 'translateY(0)';
                  }
                },
                'Back to Menu'
              )
            )
          )
        : React.createElement(
            'div',
            { className: 'game-menu' },
            React.createElement(
              'button',
              { onClick: () => setCurrentGame('tictactoe') },
              'Tic Tac Toe'
            ),
            React.createElement(
              'button',
              { onClick: () => setCurrentGame('rockpaperscissors') },
              'Rock Paper Scissors'
            ),
            React.createElement(
              'button',
              { onClick: () => setCurrentGame('connectfour') },
              'Connect Four'
            ),
            React.createElement(
              'button',
              { onClick: () => setCurrentGame('checkers') },
              'PING PONG'
            )
          )
    )
  );
}

export default App;
