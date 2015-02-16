// Black pawns always move down, white pawns always up

var sides = ['white','black'];
var ranks = {
	'Pawn': {
		'count': 8,
		'elementText': 'P',
		'black': {
			'initPostions': {
				'vertical': [1, 1, 1, 1, 1, 1, 1, 1],
				'horizontal': [0, 1, 2, 3, 4, 5, 6, 7]
			},
			'active': [true, true, true, true, true, true, true, true]
		},
		'white': {
			'initPostions': {
				'vertical': [6, 6, 6, 6, 6, 6, 6, 6],
				'horizontal': [0, 1, 2, 3, 4, 5, 6, 7]
			},
			'active': [true, true, true, true, true, true, true, true]
		}
	},
	'Bishop': {
		'count': 2,
		'elementText': 'B',
		'black': {
			'initPostions': {
				'vertical': [0, 0,],
				'horizontal': [2, 5]
			},
			'active': [true, true]
		},
		'white': {
			'initPostions': {
				'vertical': [7, 7],
				'horizontal': [2, 5]
			},
			'active': [true, true]
		}
	},
	'Knight': {
		'count': 2,
		'elementText': 'Kn',
		'black': {
			'initPostions': {
				'vertical': [0, 0],
				'horizontal': [1, 6]
			},
			'active': [true, true]
		},
		'white': {
			'initPostions': {
				'vertical': [7, 7],
				'horizontal': [1, 6]
			},
			'active': [true, true]
		}
	},
	'Rook': {
		'count': 2,
		'elementText': 'R',
		'black': {
			'initPostions': {
				'vertical': [0, 0],
				'horizontal': [0, 7]
			},
			'active': [true, true]
		},
		'white': {
			'initPostions': {
				'vertical': [7, 7],
				'horizontal': [0, 7]
			},
			'active': [true, true]
		}
	},
	'Queen': {
		'count': 1,
		'elementText': 'Q',
		'black': {
			'initPostions': {
				'vertical': [0],
				'horizontal': [3]
			},
			'active': [true]
		},
		'white': {
			'initPostions': {
				'vertical': [7],
				'horizontal': [3]
			},
			'active': [true]
		}
	},
	'King': {
		'count': 1,
		'elementText': 'K',
		'black': {
			'initPostions': {
				'vertical': [0],
				'horizontal': [4]
			},
			'active': [true]
		},
		'white': {
			'initPostions': {
				'vertical': [7],
				'horizontal': [4]
			},
			'active': [true]
		}
	}
};

(function () {
	var board = new Board();
	board.embed('board');
	board.init();

	// TODO: Remove these tests
	loopThroughGrid(board.grid, function (cell) {
		console.log(cell.occupied);
	});
	console.log('end');
})();

function Board () {
	this.pieces = {};
	this.grid = [];
	// Attaches board elements to element feed in parameter
	this.embed = function (el) {
		var e = document.getElementById(el);
		if (e !== null){
			var b = createBoard();		
			this.grid = getGrid(b);
			e.appendChild(b);			
		}
	};
	this.init = function () {
		// Check if pieces already exist
		if (Object.keys(this.pieces).length === 0) {
			this.pieces = createPieces();
		}
		// Ensure all cells are set to unoccupied before displaying pieces
		loopThroughGrid(this.grid, function (cell) {
			cell.occupied = false;
		});

		for (var piece in this.pieces) {
			if (this.pieces[piece].active) {
				this.displayPiece(this.pieces[piece]);
			}
		}
	};
	this.displayPiece = function (p) {
		this.grid[p.vertical][p.horizontal].appendChild(p.element);
		this.grid[p.vertical][p.horizontal].occupied = true;
	};
	this.removePiece = function (p) {
		this.grid[p.vertical][p.horizontal].removeChild(p.element);
		this.grid[p.vertical][p.horizontal].occupied = false;
	};
	this.inactivatePiece = function (p) {
		p.active = false;
	};
}

function Piece (side, rank, active, v, h) {
	this.rank = rank;
	this.side = side;
	this.active = active;
	this.vertical = v;
	this.horizontal = h;
	this.element = createPieceElement(this.side, this.rank);
	this.upgrade = function (newRank) {
		if (this.rank === 'pawn') {
			this.rank = newRank;
			this.element = createPieceElement(this.side, this.rank);
		} else {
			console.log('Can only upgrade pawns');
		}
	};
}

// Functions that create HTML elements
function createPieceElement (side, rank) {
	var e = document.createElement('div');
	e.setAttribute('class','piece ' + side);
	e.innerHTML = ranks[rank].elementText;
	return e;
}

function createBoard() {
	var b = document.createElement('div');
	b.setAttribute('class','grid');
	for (var i = 0; i < 8; i++) {
		var row = document.createElement('div');
		for (var j = 0; j < 8; j++) {
			var cell = document.createElement('div');
			row.appendChild(cell);
		}
		b.appendChild(row);
	}
	return b;
}
// End functions that create HTML elements

// Returns just the cell elements from the board
function getGrid (b) {
	var g = [];
	for (var i = 0; i < b.childNodes.length; i++) {
		var r = b.childNodes[i],
			row = [];
		for (var j = 0; j < r.childNodes.length; j++) {
			row.push(r.childNodes[j]);
		}
		g.push(row);
	}
	return g;
}

// Returns object of 32 initialized Piece objects
function createPieces () {
	var p = {};
	for (var rank in ranks) {
		for (var i = 0; i < 2; i++) {
			var side = sides[i];
			for (var j = 0; j < ranks[rank].count; j++) {
				var name = side + rank + j,
					rs = ranks[rank][side],
					active = rs.active[j],
					v = rs.initPostions['vertical'][j],
					h = rs.initPostions['horizontal'][j];
				p[name] = new Piece(side, rank, active, v, h);
			}
		}
	}
	return p;
}

// Utility functions
function inRange (i) {
	if (i >= 0 || i < 8) {
		return true;
	} else {
		return false;
	}
}

function loopThroughGrid (grid, callback) {
	for (var i = 0; i < grid.length; i++) {
		var row = grid[i];
		for (var j = 0; j < row.length; j++) {
			callback(row[j]);
		}
	}
}
// End utility functions