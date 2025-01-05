import React, { useState, useEffect } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const findBestMove = (squares, player) => {
    // Check for winning move
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const boardCopy = [...squares];
        boardCopy[i] = player;
        if (checkWinner(boardCopy) === player) {
          return i;
        }
      }
    }

    // Block opponent's winning move
    const opponent = player === 'O' ? 'X' : 'O';
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const boardCopy = [...squares];
        boardCopy[i] = opponent;
        if (checkWinner(boardCopy) === opponent) {
          return i;
        }
      }
    }

    // Take center if available
    if (!squares[4]) return 4;

    // Take corners if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !squares[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available edge
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(i => !squares[i]);
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }
  };

  const computerMove = () => {
    const bestMove = findBestMove(board, 'O');
    if (bestMove !== undefined) {
      const newBoard = [...board];
      newBoard[bestMove] = 'O';
      setBoard(newBoard);
      setIsPlayerTurn(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setShowCelebration(false);
  };

  useEffect(() => {
    const winner = checkWinner(board);
    if (winner) {
      setWinner(winner);
      setShowCelebration(true);
    } else if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        computerMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [board, isPlayerTurn]);

  const squareSize = 'min(120px, 25vw)'; // Responsive square size

  const renderSquare = (index) =>
    React.createElement('button', {
      className: `square ${board[index]}`,
      onClick: () => handleClick(index),
      key: index,
      style: {
        width: squareSize,
        height: squareSize,
        margin: 'min(8px, 2vw)',
        fontSize: 'min(4rem, 10vw)',
        fontWeight: 'bold',
        borderRadius: 'min(12px, 3vw)',
        border: '3px solid var(--primary)',
        backgroundColor: board[index] ? 'var(--surface)' : '#f1f5f9',
        color: board[index] === 'X' ? 'var(--error)' : 'var(--primary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          backgroundColor: 'var(--surface)'
        }
      }
    }, board[index]);

  return React.createElement(
    'div',
    { 
      className: 'tic-tac-toe',
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: 'min(1rem, 4vw)',
        position: 'relative',
        width: '100%'
      }
    },
    React.createElement(
      'button',
      {
        onClick: () => setShowInstructions(!showInstructions),
        style: {
          position: 'absolute',
          top: 'min(1rem, 4vw)',
          right: 'min(1rem, 4vw)',
          width: 'min(40px, 10vw)',
          height: 'min(40px, 10vw)',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          fontSize: 'min(1.5rem, 5vw)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 1000
        }
      },
      '?'
    ),
    showInstructions && React.createElement(
      'div',
      {
        style: {
          position: 'absolute',
          top: 'min(4rem, 15vw)',
          right: 'min(1rem, 4vw)',
          backgroundColor: 'white',
          padding: 'min(1rem, 4vw)',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: 'min(250px, 80vw)',
          zIndex: 1000,
          fontSize: 'min(1rem, 4vw)'
        }
      },
      React.createElement('h3', { style: { marginBottom: '0.5rem' } }, 'How to Play:'),
      React.createElement(
        'ul',
        { style: { paddingLeft: '1.2rem' } },
        React.createElement('li', null, 'You play as X and the computer plays as O'),
        React.createElement('li', null, 'Click on any empty square to make your move'),
        React.createElement('li', null, 'Try to get three X\'s in a row - horizontally, vertically, or diagonally'),
        React.createElement('li', null, 'Block the computer\'s moves to prevent it from winning'),
        React.createElement('li', null, 'First to get three in a row wins!')
      )
    ),
    React.createElement('h2', {
      style: {
        fontSize: 'min(3rem, 10vw)',
        marginBottom: 'min(1.5rem, 5vw)',
        color: 'var(--primary)',
        textAlign: 'center'
      }
    }, 'Tic Tac Toe'),
    React.createElement(
      'div',
      { 
        className: 'board',
        style: {
          display: 'inline-block',
          padding: 'min(1.5rem, 4vw)',
          borderRadius: 'min(20px, 5vw)',
          backgroundColor: 'var(--surface)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          width: 'fit-content',
          position: 'relative',
          maxWidth: '95vw'
        }
      },
      React.createElement(
        'div',
        { className: 'board-row' },
        [0, 1, 2].map(renderSquare)
      ),
      React.createElement(
        'div',
        { className: 'board-row' },
        [3, 4, 5].map(renderSquare)
      ),
      React.createElement(
        'div',
        { className: 'board-row' },
        [6, 7, 8].map(renderSquare)
      ),
      (winner || board.every(Boolean)) && React.createElement(
        'div',
        {
          onClick: resetGame,
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            cursor: 'pointer',
            zIndex: 1001,
            borderRadius: 'min(20px, 5vw)'
          }
        },
        React.createElement(
          'div',
          {
            style: {
              fontSize: 'min(2.5rem, 8vw)',
              fontWeight: 'bold',
              marginBottom: 'min(1rem, 4vw)',
              textAlign: 'center',
              animation: showCelebration ? 'bounce 0.5s ease infinite' : 'none',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-20px)' }
              }
            }
          },
          winner ? `Winner: ${winner}` : "It's a draw!"
        ),
        React.createElement(
          'div',
          {
            style: {
              fontSize: 'min(1.2rem, 4vw)',
              opacity: 0.8,
              textAlign: 'center'
            }
          },
          'Click anywhere to restart'
        )
      )
    )
  );
};

export default TicTacToe;
