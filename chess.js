// Black pawns always move down, white pawns always up

var initialPositions = {
	'a8': 'black rook',
	'b8': 'black knight',
	'c8': 'black bishop',
	'd8': 'black queen',
	'e8': 'black king',
	'f8': 'black bishop',
	'g8': 'black knight',
	'h8': 'black rook',
	'a7': 'black pawn',
	'b7': 'black pawn',
	'c7': 'black pawn',
	'd7': 'black pawn',
	'e7': 'black pawn',
	'f7': 'black pawn',
	'g7': 'black pawn',
	'h7': 'black pawn',
	'a2': 'white pawn',
	'b2': 'white pawn',
	'c2': 'white pawn',
	'd2': 'white pawn',
	'e2': 'white pawn',
	'f2': 'white pawn',
	'g2': 'white pawn',
	'h2': 'white pawn',
	'a1': 'white rook',
	'b1': 'white knight',
	'c1': 'white bishop',
	'd1': 'white queen',
	'e1': 'white king',
	'f1': 'white bishop',
	'g1': 'white knight',
	'h1': 'white rook',
};

var alphaPosition = ['a','b','c','d','e','f','g','h'];

(function () {
    var board = new Board();
	board.init('board');
})();

function Board () {
	var activeCell = null;
	this.pieces = [];
	this.history = [];
	this.grid = createBoard();
	this.getCell = function (v, h) {
		return this.grid.childNodes[v].childNodes[h];
	};
	this.init = function (elementID) {
		// Embed
		var e = document.getElementById(elementID);
		if (e !== null){
			e.appendChild(this.grid);	
		}
		// Takes each html element for cell and adds properties and functions
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				var cell = this.getCell(i, j);
				initCell(cell, i, j);
			}
		}
		// Creates all the piece objects and adds them to appropriate cell
		for (var ip in initialPositions) {
			var piece = new Piece(initialPositions[ip].substring(0,5), initialPositions[ip].substring(6)),
				position = convertToArrayCoordinates(ip),
				c = this.getCell(position[0], position[1]);
			c.addPiece(piece);
		}
	}; // End this.init

	// Takes a div element and turns it into an object
	function initCell (cell, v, h) {
		cell.piece = null;
		cell.vertical = v;
		cell.horizontal = h;
		cell.selected = false;
		cell.addEventListener('click', function() {
			var ac = activeCell;
			if (ac === null) {
				if (this.piece !== null) {
					this.highlight('active');
				} // Do nothing if empty cell is clicked and no active cell
			} else {
				ac.unHighlight('active');
				if (this !== ac) {
					if (this.piece !== null) {
						if (this.piece.side === ac.piece.side) {
							this.highlight('active');
						} else {
							ac.attack(this);
						}
					} else { 
						ac.moveTo(this);
					}
				}
			}
		});
		cell.addPiece = function (p) {
			this.appendChild(p.element);
			this.piece = p;
		};
		cell.removePiece = function (p) {
			this.removeChild(p.element);
			this.piece = null;
		};
		cell.highlight = function (cssClass) {
			this.selected = true;
			appendClass(this.piece.element, cssClass);
			activeCell = this;
		};
		cell.unHighlight = function (cssClass) {
			this.selected = false;
			removeClass(this.piece.element, cssClass);
			activeCell = null;
		};
		cell.moveTo = function (clickedCell) {
			var pieceToMove = this.piece;
			this.removePiece(pieceToMove);
			clickedCell.addPiece(pieceToMove);
		};
		cell.attack = function (clickedCell) {
			clickedCell.piece.active = false;
			clickedCell.removePiece(clickedCell.piece);
			this.moveTo(clickedCell);
		};
	}
}

function Piece (side, rank) {
	this.rank = rank;
	this.side = side;
	this.active = true;
	this.element = createPieceElement(this.side, this.rank);
	this.upgrade = function (newRank) {
		if (this.rank === 'Pawn') {
			this.rank = newRank;
			this.element = createPieceElement(this.side, this.rank);
		}
	};
}

// Functions that create HTML elements
function createPieceElement (side, rank) {
	var e = document.createElement('div');
	var	notationName = {
		'pawn': 'P',
		'bishop': 'B',
		'knight': 'N',
		'rook': 'R',
		'queen': 'Q',
		'king': 'K'
	};
	e.setAttribute('class', side);
	// Lowercase is not needed, but included as a just-in-case
	e.innerHTML = notationName[rank.toLowerCase()];
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

// Utility functions
function inRange (i) {
	if (i >= 0 || i < 8) {
		return true;
	} else {
		return false;
	}
}

function appendClass (el, newClass) {
	if (el.hasAttribute('class')) {
		el.setAttribute('class', el.getAttribute('class') + ' ' + newClass);
	} else {
		el.setAttribute('class', newClass);
	}
}

function removeClass (el, oldClass) {
	if (el.hasAttribute('class')) {
		// This assumes oldClass is not the first class listed
		var c =  el.getAttribute('class'),
			re =  new RegExp(' ' + oldClass, 'i');
		c = c.replace(re, '');
		el.setAttribute('class', c);
	}
}

function convertToArrayCoordinates (boardPostion) {
	return [(boardPostion.substring(1) - 1), alphaPosition.indexOf(boardPostion.substring(0, 1))];
}

function convertToAlgebraicNotation (v, h) {
	return alphaPosition[h] + (v + 1);
}
// End utility functions