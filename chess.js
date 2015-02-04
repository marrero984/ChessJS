// No need to track number of moves in object; just count length of history
// Create each piece on initialization, setting vertical, horizontal, and side
// Black pawns always move down, white pawns always up
// Transform function changes piece type

// The grid is available to the whole script and stores only the individual cells
// The board returned by createBoard() is the full set of elements needed for display and used only on initialization
var grid = [];

(function () {	
	document.getElementById('board').appendChild(Board());

	// Tests TODO: remove
	tests();
})();

function Board () {
	var board = document.createElement('div');
	board.setAttribute('class','grid');
	for (var i = 0; i < 8; i++) {
		var row = document.createElement('div'),
			gridRow = [];
		row.setAttribute('class','row')
		for (var j = 0; j < 8; j++) {
			var cell = document.createElement('div');
			if (i % 2 === j % 2) {
				cell.setAttribute('class','cell alt');
			} else {
				cell.setAttribute('class', 'cell');
			}
			row.appendChild(cell);
			gridRow.push(cell);
		}
		board.appendChild(row);
		grid.push(gridRow);
	}
	return board;
}

function Piece (side, rank) {
	this.rank = rank;
	this.side = side;
	this.vertical = 0;
	this.horizontal = 0;
	this.element = pieceElement(this.side, this.rank);
	this.move = function (v, h) {
		// Verify that requested move does not leave the board before updating position
		if (inRange(v) && inRange(h)) {
			this.vertical = v;
			this.horizontal = h;
		}
		this.display();
	}
	this.display = function () {
		grid[this.vertical][this.horizontal]
			.appendChild(this.element);
	}
	this.upgrade = function (newRank) {
		if (this.rank === 'pawn') {
			this.rank = newRank;
		} else {
			console.log('Can only upgrade pawns');
		}
	}
}

// See if possible to move this function to inside the Piece object
function pieceElement (side, rank) {
	var e = document.createElement('div');
	e.setAttribute('class','piece ' + side);
	e.innerHTML = 'P'
	return e;
}

//Returns pieces object that contains 32 Piece objest
function createPieces () {
	var pieces = {};
	var sides = ['white','black'];
	var ranks = {
		'Pawn': 8,
		'Bishop': 2,
		'Knight': 2,
		'Rook': 2,
		'Queen': 1,
		'King': 1
	};

	for (var rank in ranks) {
		creationLoop(rank, ranks[rank]);
	}

	function creationLoop (rank, x) {
		for (var i = 0; i < 2; i++) {
			var side = sides[i];
			for (var j = 1; j <= x; j++) {
				pieces[side + rank + j] = new Piece(side, rank);
			}
		}
	}

	return pieces;
}

//Utility functions
function inRange (i) {
	if (i >= 0 || i < 8) {
		return true;
	} else {
		return false;
	}
}

// Tests
function tests () {
	console.log(createPieces());
}