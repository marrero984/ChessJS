// Black pawns always move down, white pawns always up

// The grid is available to the whole script and stores only the individual cells
// The board returned by createBoard() is the full set of elements needed for display and used only on initialization
var grid = []; // Must be initialized before anonymous function call
var pieces= {};
var sides = ['white','black'];
var ranks = {
	'Pawn': {
		'count': 8,
		'elementText': 'P',
		'initHorizontal': [0, 1, 2, 3, 4, 5, 6, 7]
	},
	'Bishop': {
		'count': 2,
		'elementText': 'B',
		'initHorizontal': [2, 5]
	},
	'Knight': {
		'count': 2,
		'elementText': 'Kn',
		'initHorizontal': [1, 6]
	},
	'Rook': {
		'count': 2,
		'elementText': 'R',
		'initHorizontal': [0, 7]
	},
	'Queen': {
		'count': 1,
		'elementText': 'Q',
		'initHorizontal': [4]
	},
	'King': {
		'count': 1,
		'elementText': 'K',
		'initHorizontal': [3]
	}
};

(function () {	
	document.getElementById('board').appendChild(Board());
	createPieces();

	// Tests TODO: remove
	console.log(pieces);
	console.log(pieces['whitePawn1']);
	pieces['whitePawn1'].display();
	for (var piece in pieces) {
		pieces[piece].display();
	}
})();

function Board () {
	var board = document.createElement('div');
	board.setAttribute('class','grid');
	for (var i = 0; i < 8; i++) {
		var row = document.createElement('div'),
			gridRow = [];
		for (var j = 0; j < 8; j++) {
			var cell = document.createElement('div');
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
			this.element = pieceElement(this.side, this.rank);
			this.display();
		} else {
			console.log('Can only upgrade pawns');
		}
	}

	//Does not need to be accessible outside of the object
	function pieceElement (side, rank) {
		var e = document.createElement('div');
		e.setAttribute('class','piece ' + side);
		e.innerHTML = ranks[rank].elementText;
		return e;
	}
}

// Returns pieces object that contains 32 Piece objects
// See if possible to move pieces into Board object
function createPieces () {
	for (var rank in ranks) {
		for (var i = 0; i < 2; i++) {
			var side = sides[i];
			for (var j = 1; j <= ranks[rank].count; j++) {
				var name = side + rank + j;
				pieces[name] = new Piece(side, rank);
				pieces[name].vertical = initVertical(side, rank);
				pieces[name].horizontal = ranks[rank].initHorizontal[j - 1];
			}
		}
	}

	function initVertical (side, rank) {
		var v;
		if (rank === 'Pawn') {
			if (side === 'white') {
				v = 6;
			} else {
				v = 1;
			}
		} else {
			if (side === 'white') {
				v = 7;
			} else {
				v = 0;
			}
		}
		return v;
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