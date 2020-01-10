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
		super(props)
		this.state = {
			board: create2D(props.length, props.length),
			isXNext: true
		}
	}

	handleButton(rowIndex, colIndex) {
		let newBoard = this.state.board.slice();
		newBoard[rowIndex][colIndex] = this.state.isXNext ? 'X' : 'O';
		this.setState({
			board: newBoard,
			isXNext: !this.state.isXNext
		})
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
	render() {
		const length = 3;

		return (
			<Board length={length}/>
		)
	}
}
ReactDom.render(
	<Game />,
	document.getElementById('root')
);
