// No need to track number of moves in object; just count length of history
// Create each piece on initialization, setting vertical, horizontal, and side
// Black pawns always move down, white pawns always up
// Transform function changes piece type



(function () {	
	var board = document.getElementById('board');
	board.appendChild(createBoard());

	// Tests TODO: remove
	tests();
})();

function createBoard () {
	var grid = document.createElement('div');
	grid.setAttribute('class','grid');
	for (var i = 0; i < 8; i++) {
		var row = document.createElement('div');
		row.setAttribute('class','row')
		for (var j = 0; j < 8; j++) {
			var cell = document.createElement('div');
			if (i % 2 === j % 2) {
				cell.setAttribute('class','cell alt');
			} else {
				cell.setAttribute('class', 'cell');
			}
			row.appendChild(cell);
		}
		grid.appendChild(row);
	}
	return grid;
}

function Piece (side, rank) {
	this.rank = rank;
	this.inplay = true;
	this.active = false;
	this.side = side;
	this.vertical = 0;
	this.horizontal = 0;
	this. history = [];
	this.move = function (v, h) {
		// Verify that requested move does not leave the board before updating position
		if (inRange(v) && inRange(h)) {
			this.vertical = v;
			this.horizontal = h;
		}
		// TODO: update history after move (decide what history should look like)
	}
	this.display = function () {
		// Grid is not global; test if Piece instance can find grid object
		// TODO: Copy original element into new location
		// 	Remove from old location
		// 	Use childNodes
	}
	this.upgrade = function (newRank) {
		if (this.rank === 'pawn') {
			this.rank = newRank;
		} else {
			console.log('Can only upgrade pawns');
		}
	}
	this.remove = function () {
		this.inplay = false;
	}
	this.select = function () {
		this.active === true ? this.active = false : this.active = true;
	}
}

function inRange (i) {
	if (i >= 0 || i < 8) {
		return true;
	} else {
		return false;
	}
}

// Tests
 function tests () {
 	var whitePawn1 = new Piece('white','pawn');
 	whitePawn1.move(1, 0);
	console.log(whitePawn1);
 }