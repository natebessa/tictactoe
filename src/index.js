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
                key={i}
            />
        );
    }

    render() {
        return (
            <div>
                {Array(3).fill(null).map((element, i) =>
                    <div className="board-row" key={i}>
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
                stepNumber: 0,
                colPlayed: null,
                rowplayed: null,
            }],
            moveHistorySortAsc: true,
            currentStep: 0,
            xIsNext: true,
        };
        // Remember the original state to facilitate game restarts.
        this.baseState = this.state;
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.currentStep + 1);
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
                stepNumber: history.length,
                colPlayed: getColFromSquare(i),
                rowPlayed: getRowFromSquare(i),
            }]),
            currentStep: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    restartGame() {
        this.setState(this.baseState);
    }

    toggleSort() {
        this.setState({
            moveHistorySortAsc: !this.state.moveHistorySortAsc
        });
    }

    jumpTo(step) {
        this.setState({
            currentStep: step,
            xIsNext: (step % 2) === 0,
        });
    }

    renderMoves() {
        // If sorting by desc, then create a copy of the history to reverse it.
        const historicalSteps = this.state.moveHistorySortAsc ?
            this.state.history :
            this.state.history.slice().reverse();

        let steps = [];
        historicalSteps.map((step, move) => {
            // Hide if this is the empty state move.
            if (step.stepNumber === 0) return null;

            // Player X to (col, row)
            const desc = 'Player ' + step.player + ' to (' + step.colPlayed + ', ' + step.rowPlayed + ')';

            // Highlight if current move
            const currentMoveClass = step.stepNumber === this.state.currentStep ? 'current-move' : ''

            steps.push(
                <li className="move" key={step.stepNumber}>
                    <button onClick={() => this.jumpTo(move)}>
                        <span className={currentMoveClass}>{desc}</span>
                    </button>
                </li>
            );
        })

        return steps;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.currentStep];
        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                    <button
                        className="restart-game-button"
                        onClick={() => this.restartGame()}
                    >
                        Restart game
                    </button>
                </div>
                <div className="game-info">
                    <div className="player-status">{status}</div>
                    <hr></hr>
                    <div>
                        Move history:
                        <button className="move-sort-button" onClick={() => this.toggleSort()}>
                            Sort {this.state.moveHistorySortAsc ? 'desc' : 'asc'}?
                        </button>
                        <ol>{this.renderMoves()}</ol>
                    </div>
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