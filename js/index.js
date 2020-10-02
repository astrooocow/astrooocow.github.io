var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#d3d3d3";

var width = canvas.width/15;
var height = canvas.height/15;

// init maze
var maze = new Array(height);

// make maze 2D
for (var i = 0; i < maze.length; i++) {
	maze[i] = new Array(width);
}

function generateMaze() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// initialize maze values to 0
	for (var i = 0; i < maze.length; i++) {
		for (var j = 0; j < maze[0].length; j++) {
			maze[i][j] = 0;
		}
	}

	// select starting x position
	var x = getRandomInt(width);
	while (x % 2 == 0) {
		x = getRandomInt(width);
	}

	// select starting y position
	var y = getRandomInt(height);
	while (y % 2 == 0) {
		y = getRandomInt(height);
	}

	// initialize starting xy position
	maze[x][y] = 1;

	// generate maze
	recursiveDepthFirst(x, y);

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
			if (x + 2 >= width - 1)
				continue;
			if (maze[x + 2][y] != 1) {
				maze[x + 2][y] = 1;
				maze[x + 1][y] = 1;
				recursiveDepthFirst(x + 2, y);
			}
			break;
			
		case 2: // down
			if (y + 2 >= height - 1)
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

function displayMaze() {
	ctx.fillStyle = "#d3d3d3";

	var cellWidth = canvas.width / width;
	var cellHeight = canvas.height / height;

	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			if(maze[i][j] == 0) {
				ctx.fillRect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
			}
		}
	}

	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, cellHeight, cellWidth, cellHeight);
	ctx.fillRect(canvas.width - cellWidth, canvas.height - 2*cellHeight, cellWidth, cellHeight);
}