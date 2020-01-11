import React from 'react';
import ReactDom from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className='btn' onClick={props.onClick}>{props.value}</button>
	);
}

function create2D(nb_row, nb_col) {
	let array = Array(nb_row).fill(null);
	return array.map((row, index) => Array(nb_col).fill(null));
}

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			board: create2D(props.length, props.length),
			isXNext: true
		};
	}

	vector(row, col) {
		return {row: row, col: col};
	}

	checkWinner(board) {
		const winCondition = 3; //3 'X' or 'O' in a row, col, or diagonal
		const positions = [
			this.vector(0, 1),//horizontal
			this.vector(1, 0), //vertical
			this.vector(1,1), //leftDiagonal
			this.vector(1, -1) //rightDiagonal
		]
		const player = this.props.player ? 'X' : 'O';
		for (let row = 0; row < 3; ++row) {
			for (let col = 0; col < 3; ++col) {
				if (board[row][col] === player) {
					for (let pos = 0; pos < 4; ++pos) {
						let t_row =  row;
						let t_col = col;
						let winCounter = 1;
						for (let i = 1; i < winCondition; ++i) {
							t_row += positions[pos].row;
							t_col += positions[pos].col;
							if (board[t_row] && board[t_row][t_col] === player)
								winCounter += 1;
							else
								break;
						}

						if (winCounter === winCondition)
						{
							console.log("Winner is: ", player)
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	handleButton(rowIndex, colIndex) {
		if (this.props.winner)
			return ;
		let newBoard = this.state.board.slice();
		if (newBoard[rowIndex][colIndex])
			return ;
		newBoard[rowIndex][colIndex] = this.props.player ? 'X' : 'O';
		const hasWinner = this.checkWinner(newBoard);
		this.props.onPlayer({hasWinner: hasWinner});
		this.setState({
			board: newBoard
		});
	}

	renderRow(length) {
		const board = this.state.board;
		const rows = board.map( (row, rowIndex) => {
			const squares = row.map( (value, colIndex) => {
				return <Square key={colIndex} value={value} onClick={() => this.handleButton(rowIndex, colIndex)}/>
			});

			return (
				<div className="board-row" key={rowIndex}>
					{squares}
				</div>
			);
		});

		return rows;
	}

	render() {
		return (
			<div className="board">
				{this.renderRow(this.props.length)}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 'Next player is: X',
			isXNext: true,
			hasWinner: false
		}
	}

	handlePlayer(data) {
		let status = "";
		if (data.hasWinner)
			status = 'Winner is: ' + (this.state.isXNext ? 'X' : 'O');
		else
			status = 'Next player is: ' + (!this.state.isXNext ? 'X' : 'O');
		this.setState({
			status: status,
			isXNext: !this.state.isXNext,
			hasWinner: data.hasWinner,
		});
	}

	render() {
		const length = 3;

		return (
			<>
				<div className="player-status">
					{this.state.status}
				</div>
				<Board length={length} player={this.state.isXNext} winner={this.state.hasWinner} onPlayer={(data) => this.handlePlayer(data)} />//Why this work?? Why do I have to use inline function like this//
			</>
		);
	}
}

ReactDom.render(
	<Game />,
	document.getElementById('root')
);
