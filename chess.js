// Black pawns always move down, white pawns always up

// TODO: eliminate sides array if possible
// TODO: move ranks object to external JSON file
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
	console.log('end');
})();

function Board () {
	this.pieces = [];
	this.grid = createBoard();
	this.grid.getCell = function (v, h) {
		return this.childNodes[v].childNodes[h];
	};
	this.activeCell = null;
	// Attaches board elements to specified ID
	this.embed = function (elementID) {
		var e = document.getElementById(elementID);
		if (e !== null){
			e.appendChild(this.grid);			
		}
	};
	this.init = function () {
		if (Object.keys(this.pieces).length === 0) {
			this.pieces = createPieces();
		}

		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				var cell = this.grid.getCell(i, j),
					b = this; // Need to store this in new object to pass inside cellClick since 'this' loses scope
				initCell(cell, b, i, j);
			}
		}

		for (var piece in this.pieces) {
			var p = this.pieces[piece];
			if (p.active) {
				this.grid.getCell(p.vertical, p.horizontal).displayPiece(p);
			}
		}
	}; // End this.init
	this.cellClick = function (clickedCell) {
		var activeCell = this.activeCell;
		// If nothing is already selected
		if (activeCell === null) {
			// Check if new cell is occupied
			if (clickedCell.piece !== null) {
				clickedCell.select();
			} // Do nothing if empty cell is clicked and no active cell
		} else { // If board is already selected, always unselect original
			activeCell.unselect();
			// Is it the same cell twice
			if (clickedCell !== activeCell) { // If it is a new cell, get piece to move
				var pieceToMove = activeCell.piece;
				// Check if destination cell is occupied
				if (clickedCell.piece !== null) {
					// Check if original piece and new piece are same side
					if (clickedCell.piece.side === activeCell.piece.side) {
						clickedCell.select();
					} else { // If opposite sides, attack
						clickedCell.piece.active = false;
						clickedCell.removePiece(clickedCell.piece);
						activeCell.removePiece(pieceToMove);
						pieceToMove.move(clickedCell.vertical, clickedCell.horizontal);
						clickedCell.displayPiece(pieceToMove);
					}
				} else { // If new cell is empty, move
					activeCell.removePiece(pieceToMove);
					pieceToMove.move(clickedCell.vertical, clickedCell.horizontal);
					clickedCell.displayPiece(pieceToMove);
				}
			}
		}
	}; // End cellClick
}

function Piece (side, rank, active, v, h) {
	this.rank = rank;
	this.side = side;
	this.active = active;
	this.vertical = v;
	this.horizontal = h;
	this.element = createPieceElement(this.side, this.rank);
	this.move = function (v, h) {
		this.vertical = v;
		this.horizontal = h;
	};
	this.upgrade = function (newRank) {
		if (this.rank === 'pawn') {
			this.rank = newRank;
			this.element = createPieceElement(this.side, this.rank);
		}
	};
}

function initCell (cell, board, v, h) {
	cell.piece = null;
	cell.vertical = v;
	cell.horizontal = h;
	cell.selected = false;
	cell.addEventListener('click', function() {
		board.cellClick(this);
	});
	cell.displayPiece = function (p) {
		this.appendChild(p.element);
		this.piece = p;
	};
	cell.removePiece = function (p) {
		this.removeChild(p.element);
		this.piece = null;
	};
	cell.select = function () {
		this.selected = true;
		appendClass(this.piece.element, 'active');
		board.activeCell = this;
	};
	cell.unselect = function () {
		this.selected = false;
		removeClass(this.piece.element, 'active');
		board.activeCell = null;
	};
}

// Functions that create HTML elements
function createPieceElement (side, rank) {
	var e = document.createElement('div');
	e.setAttribute('class', side);
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

// Returns object of 32 initialized Piece objects
function createPieces () {
	var p = [];
	for (var rank in ranks) {
		for (var i = 0; i < 2; i++) {
			var side = sides[i];
			for (var j = 0; j < ranks[rank].count; j++) {
				// TODO: see if possible to remove name since not being used
				var rs = ranks[rank][side],
					active = rs.active[j],
					v = rs.initPostions['vertical'][j],
					h = rs.initPostions['horizontal'][j];
				p.push(new Piece(side, rank, active, v, h));
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

function appendClass (e, newClass) {
	if (e.hasAttribute('class')) {
		e.setAttribute('class', e.getAttribute('class') + ' ' + newClass);
	} else {
		e.setAttribute('class', newClass);
	}
}

function removeClass (e, oldClass) {
	if (e.hasAttribute('class')) {
		// This assumes oldClass is not the first class listed
		var c =  e.getAttribute('class'),
			re =  new RegExp(' ' + oldClass, 'i');
		c = c.replace(re, '');
		e.setAttribute('class', c);
	}
}
// End utility functions