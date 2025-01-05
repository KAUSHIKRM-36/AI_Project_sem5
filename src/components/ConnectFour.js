import React, { useState, useEffect } from 'react';

const ConnectFour = () => {
  const rows = 6;
  const cols = 7;
  const [board, setBoard] = useState(Array(rows).fill().map(() => Array(cols).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [winner, setWinner] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [winningCells, setWinningCells] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);

  const checkWinner = (board, row, col, player) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (let [dx, dy] of directions) {
      let count = 1;
      let cells = [[row, col]];
      
      // Check forward direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) break;
        if (board[newRow][newCol] !== player) break;
        count++;
        cells.push([newRow, newCol]);
      }
      
      // Check backward direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;
        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) break;
        if (board[newRow][newCol] !== player) break;
        count++;
        cells.push([newRow, newCol]);
      }
      
      if (count >= 4) {
        setWinningCells(cells);
        return true;
      }
    }
    return false;
  };

  const handleClick = (col) => {
    if (winner || showRestart) return;
    for (let row = rows - 1; row >= 0; row--) {
      if (!board[row][col]) {
        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        if (checkWinner(newBoard, row, col, currentPlayer)) {
          setWinner(currentPlayer);
          setShowResult(true);
          setTimeout(() => {
            setShowResult(false);
            setShowRestart(true);
          }, 2000);
        } else {
          setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
        }
        break;
      }
    }
  };

  const evaluatePosition = (board, row, col, player) => {
    if (checkWinner(board, row, col, player)) {
      return player === 'yellow' ? 100 : -100;
    }

    let score = 0;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (let [dx, dy] of directions) {
      let consecutive = 0;
      let blocked = 0;

      // Check both directions
      for (let dir of [-1, 1]) {
        for (let i = 1; i < 4; i++) {
          const newRow = row + i * dx * dir;
          const newCol = col + i * dy * dir;
          
          if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
            blocked++;
            break;
          }
          
          if (board[newRow][newCol] === player) {
            consecutive++;
          } else if (board[newRow][newCol]) {
            blocked++;
            break;
          } else {
            break;
          }
        }
      }

      if (blocked < 2) {
        score += consecutive * 2;
      }
    }

    return score;
  };

  const findBestMove = () => {
    let bestScore = -Infinity;
    let bestCol = 0;

    for (let col = 0; col < cols; col++) {
      // Find the lowest empty row in this column
      let row = rows - 1;
      while (row >= 0 && board[row][col]) {
        row--;
      }
      
      if (row >= 0) { // If column is not full
        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = 'yellow';
        
        // Check immediate win
        if (checkWinner(newBoard, row, col, 'yellow')) {
          return col;
        }

        // Check if opponent would win next move
        for (let blockCol = 0; blockCol < cols; blockCol++) {
          let blockRow = rows - 1;
          while (blockRow >= 0 && newBoard[blockRow][blockCol]) {
            blockRow--;
          }
          if (blockRow >= 0) {
            const testBoard = newBoard.map(row => [...row]);
            testBoard[blockRow][blockCol] = 'red';
            if (checkWinner(testBoard, blockRow, blockCol, 'red')) {
              return blockCol; // Block opponent's winning move
            }
          }
        }

        const score = evaluatePosition(newBoard, row, col, 'yellow');
        if (score > bestScore) {
          bestScore = score;
          bestCol = col;
        }
      }
    }

    return bestCol;
  };

  const computerMove = () => {
    const bestCol = findBestMove();
    handleClick(bestCol);
  };

  useEffect(() => {
    if (currentPlayer === 'yellow' && !winner) {
      const timer = setTimeout(() => {
        computerMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, winner]);

  const handleRestart = () => {
    setBoard(Array(rows).fill().map(() => Array(cols).fill(null)));
    setCurrentPlayer('red');
    setWinner(null);
    setShowRestart(false);
    setWinningCells([]);
  };

  return React.createElement(
    'div',
    { className: 'connect-four', style: { position: 'relative' } },
    React.createElement('h2', { 
      style: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: '2.5rem',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }
    }, 'Connect Four'),
    React.createElement(
      'button',
      {
        onClick: () => setShowInstructions(!showInstructions),
        style: {
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
        }
      },
      '?'
    ),
    showInstructions && React.createElement(
      'div',
      {
        style: {
          position: 'absolute',
          top: '4rem',
          right: '1rem',
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '250px',
          zIndex: 1000
        }
      },
      React.createElement('h3', { style: { marginBottom: '0.5rem' } }, 'How to Play:'),
      React.createElement(
        'ul',
        { style: { paddingLeft: '1.2rem' } },
        React.createElement('li', null, 'Click on any column to drop your piece '),
        React.createElement('li', null, 'Try to connect 4 pieces horizontally, vertically, or diagonally'),
        React.createElement('li', null, 'The computer will play after your turn'),
        React.createElement('li', null, 'Block the computer\'s moves to prevent it from winning'),
        React.createElement('li', null, 'First to connect 4 pieces wins!')
      )
    ),
    React.createElement(
      'div',
      { 
        className: 'board',
        style: { position: 'relative' }
      },
      board.map((row, rowIndex) =>
        React.createElement(
          'div',
          { key: rowIndex, className: 'row' },
          row.map((cell, colIndex) =>
            React.createElement('div', {
              key: colIndex,
              className: `cell ${cell || ''} ${
                winningCells.some(([r, c]) => r === rowIndex && c === colIndex) ? 'winning' : ''
              }`,
              onClick: () => handleClick(colIndex)
            })
          )
        )
      ),
      winner && winningCells.length >= 2 && React.createElement(
        'svg',
        {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }
        },
        React.createElement('line', {
          x1: `${(winningCells[0][1] + 0.5) * (100 / cols)}%`,
          y1: `${(winningCells[0][0] + 0.5) * (100 / rows)}%`,
          x2: `${(winningCells[winningCells.length - 1][1] + 0.5) * (100 / cols)}%`,
          y2: `${(winningCells[winningCells.length - 1][0] + 0.5) * (100 / rows)}%`,
          style: {
            stroke: winner === 'red' ? '#ff0000' : '#ffff00',
            strokeWidth: '4',
            strokeLinecap: 'round',
            opacity: '0.8'
          }
        })
      ),
      showResult && React.createElement(
        'div',
        {
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            fontSize: '24px',
            fontWeight: 'bold'
          }
        },
        winner === 'red' ? 'You Win!' : 'Computer Wins!'
      ),
      showRestart && React.createElement(
        'div',
        {
          onClick: handleRestart,
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }
        },
        React.createElement(
          'div',
          {
            style: {
              color: 'white',
              fontSize: '20px',
              textAlign: 'center'
            }
          },
          'Click anywhere to restart'
        )
      )
    )
  );
};

export default ConnectFour;
