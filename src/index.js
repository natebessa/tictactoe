import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                {Array(3).fill(null).map((element, i) =>
                    <div className="board-row">
                        {Array(3).fill(null).map((element, j) =>
                            this.renderSquare(j + (i * 3))
                        )}
                    </div>
                )}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                player: null,
                colPlayed: null,
                rowplayed: null,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                player: this.state.xIsNext ? 'X' : 'O',
                colPlayed: getColFromSquare(i),
                rowPlayed: getRowFromSquare(i),
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = history.map((step, move) => {
            const desc = move ?
                'Player ' + step.player + ' to (' + step.colPlayed + ', ' + step.rowPlayed + ')' :
                'Go to game start';
            const textClass = move === this.state.stepNumber ? 'current-move' : ''
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        <span className={textClass}>{desc}</span>
                    </button>
                </li>
            );
        })

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
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
}

function getRowFromSquare(square) {
    if (square < 3) {
        return 0;
    } else if (square < 6) {
        return 1;
    } else {
        return 2;
    }
}

function getColFromSquare(square) {
    if (square === 0 || square === 3 || square === 6) {
        return 0;
    } else if (square === 1 || square === 4 || square === 7) {
        return 1;
    } else {
        return 2;
    }
}