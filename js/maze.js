var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#d4d4d4";

var mazeProperties = {
	'width'  : canvas.width/15,
	'height' : canvas.height/15
};

// player properties
var player = {
	'row' : 1,
	'col' : 1
};

// init maze
var maze = new Array(mazeProperties.height);

// make maze 2D
for (var i = 0; i < mazeProperties.height; i++) {
	maze[i] = new Array(mazeProperties.width);
}

function generateMaze() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// initialize maze values to un-visted;0
	for (var i = 0; i < mazeProperties.height; i++) {
		for (var j = 0; j < mazeProperties.width; j++) {
			maze[i][j] = 0;
		}
	}

	// select starting x position
	var startCol = getRandomInt(mazeProperties.width);
	while (startCol % 2 == 0) {
		startCol = getRandomInt(mazeProperties.width);
	}

	// select starting y position
	var startRow = getRandomInt(mazeProperties.height);
	while (startRow % 2 == 0) {
		startRow = getRandomInt(mazeProperties.height);
	}

	// initialize starting xy position
	maze[startCol][startRow] = 1;

	// generate maze
	recursiveDepthFirst(startCol, startRow);

	displayMaze();
}

// random int from 0 - max
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// shuffle an array
function shuffle(arr) {
    var ctr = arr.length, temp, index;

    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = arr[ctr];
        arr[ctr] = arr[index];
        arr[index] = temp;
    }
    return arr;
}

// recursive algorithm for generating a maze
function recursiveDepthFirst(x, y) {
	var d = [0, 1, 2, 3];
	shuffle(d);

	for (var i = 0; i < d.length; i++) {
		switch (d[i]) {
		case 0: // up
			if (y - 2 <= 0)
				continue;
			if (maze[x][y - 2] != 1) {
				maze[x][y - 2] = 1;
				maze[x][y - 1] = 1;
				recursiveDepthFirst(x, y - 2);
			}
			break;
			
		case 1: // right
			if (x + 2 >= mazeProperties.width - 1)
				continue;
			if (maze[x + 2][y] != 1) {
				maze[x + 2][y] = 1;
				maze[x + 1][y] = 1;
				recursiveDepthFirst(x + 2, y);
			}
			break;
			
		case 2: // down
			if (y + 2 >= mazeProperties.height - 1)
				continue;
			if (maze[x][y + 2] != 1) {
				maze[x][y + 2] = 1;
				maze[x][y + 1] = 1;
				recursiveDepthFirst(x, y + 2);
			}
			break;
			
		case 3: // left
			if (x - 2 <= 0)
				continue;
			if (maze[x - 2][y] != 1) {
				maze[x - 2][y] = 1;
				maze[x - 1][y] = 1;
				recursiveDepthFirst(x - 2, y);
			}
			break;
		}
	}
}

/*
  Draws the maze as a series of cells
  Left to right, then increment down
*/
function displayMaze() {
	// Create the maze entrance and exit
	maze[1][0] = 1;
	maze[mazeProperties.height - 2][mazeProperties.width - 1] = 1;

	// log for debug
	console.log(maze);

	// color the walls light grey
	ctx.fillStyle = "#d4d4d4";

	var cellWidth = canvas.width / mazeProperties.width;
	var cellHeight = canvas.height / mazeProperties.height;

	for (var i = 0; i < mazeProperties.height; i++) {
		for (var j = 0; j < mazeProperties.width; j++) {
			if(maze[i][j] == 0) {
				ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
			}
		}
	}
	playMaze();
}

function playMaze() {
	player.col = 1;
	player.row = 1;
	showPos();

	document.onkeypress = handleKeyPress;
}

function handleKeyPress(e) {
	switch (e.key) {
		case "w":
			movePlayer("up");
			break;
    	case "a":
    		movePlayer("left");
			break;
    	case "s":
    		movePlayer("down");
			break;
    	case "d":
    		movePlayer("right");
			break;
    	default: break;
    }
}

function movePlayer(dir) {
	if (dir == "up") {
		if (player.row != 1) {
			if (maze[player.row - 1][player.col] != 0) {
				player.row -= 1;
			}
		}
		showPos();
	}
	if (dir == "left") {
		if (player.col != 1) {
			if (maze[player.row][player.col - 1] != 0) {
				player.col -= 1;
			}
		}
		showPos();
	}
	if (dir == "down") {
		if (player.row != mazeProperties.height - 2) {
			if (maze[player.row + 1][player.col] != 0) {
				player.row += 1;
			}
		}
		showPos();
	}
	if (dir == "right") {
		if (player.col != mazeProperties.width - 2) {
			if (maze[player.row][player.col + 1] != 0) {
				player.col += 1;
			}
		}
		showPos();
	}
}

function showPos() {
	var cellWidth = canvas.width / mazeProperties.width;
	var cellHeight = canvas.height / mazeProperties.height;

	ctx.fillStyle = "#42d1d6";

	ctx.fillRect(player.col * cellWidth, player.row * cellHeight, cellWidth, cellHeight);
}