var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#d4d4d4";

// player properties
var player = {
	'row' : 1,
	'col' : 1
};

var solver = {
	'row' : 1,
	'col' : 1
};

// maze class
class Maze {
	constructor() {
		this.prop = {
			'size' : canvas.width/15,
			'cells' : null,
			'start' : null,
			'end'   : null
		};
		this.prop.cells = this._mazeInit();
		this.tree = [];
	}

	_pushData (data) {
		this.tree.push(data);
	}

	_mazeInit () {
		var m = new Array(this.prop.size);
		for (var i = 0; i < this.prop.size; i++) {
			m[i] = new Array(this.prop.size);
		}
		return m;
	}
}

var maze = new Maze();

function generateMaze() {
	maze.tree = [];
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// initialize maze values to un-visted;0
	for (var i = 0; i < maze.prop.size; i++) {
		for (var j = 0; j < maze.prop.size; j++) {
			maze.prop.cells[i][j] = 0;
		}
	}

	// select starting x position
	var startCol = getRandomInt(maze.prop.size);
	while (startCol % 2 == 0) {
		startCol = getRandomInt(maze.prop.size);
	}

	// select starting y position
	var startRow = getRandomInt(maze.prop.size);
	while (startRow % 2 == 0) {
		startRow = getRandomInt(maze.prop.size);
	}

	// initialize starting xy position
	maze.prop.cells[startRow][startCol] = 1;
	if (startRow == 1 && startCol == 1) {
		maze.prop.start = 0;
	}
	if (startRow == maze.prop.size - 2 && startCol == maze.prop.size - 2) {
		maze.prop.end = 0;
	}

	// DEBUG
	// console.log(startCol + ", " + startRow);

	// generate maze
	maze._pushData({id: 0, parentId: null, xPos: startCol, yPos: startRow});
	recursiveDepthFirst(startRow, startCol, maze.tree[0], 0);

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
function recursiveDepthFirst(x, y, parentData, depth) {

	// randomly selects the paths to take
	var dirs = [0, 1, 2, 3];
	shuffle(dirs);

	// for each path in dirs[] attempt to take it.
	for (var i = 0; i < dirs.length; i++) {
		switch (dirs[i]) {

		// attempt upwards path
		case 0: if (y - 2 <= 0) { continue; }
			if (maze.prop.cells[x][y - 2] != 1) {
				maze.prop.cells[x][y - 2] = 1;
				maze.prop.cells[x][y - 1] = 1;

				maze._pushData(
					{id: maze.tree.length,
					 parentId: parentData.id,
					 xPos: y - 2, yPos: x}
				);

				if (x == 1 && y - 2 == 1) {
					maze.prop.start = maze.tree.length - 1;
				}

				recursiveDepthFirst(x, y - 2, maze.tree[maze.tree.length - 1], depth+1);
			}
			break;
		
		// attempt rightwards path
		case 1: if (x + 2 >= maze.prop.size - 1) { continue; }
			if (maze.prop.cells[x + 2][y] != 1) {
				maze.prop.cells[x + 2][y] = 1;
				maze.prop.cells[x + 1][y] = 1;

				maze._pushData(
					{id: maze.tree.length,
					 parentId: parentData.id,
					 xPos: y, yPos: x + 2}
				);

				if (x + 2 == maze.prop.size - 2 && y == maze.prop.size - 2) {
					maze.prop.end = maze.tree.length - 1;
				}

				recursiveDepthFirst(x + 2, y, maze.tree[maze.tree.length - 1], depth+1);
			}
			break;

		// attempt downwards path
		case 2: if (y + 2 >= maze.prop.size - 1) { continue; }
			if (maze.prop.cells[x][y + 2] != 1) {
				maze.prop.cells[x][y + 2] = 1;
				maze.prop.cells[x][y + 1] = 1;

				maze._pushData(
					{id: maze.tree.length,
					 parentId: parentData.id,
					 xPos: y + 2, yPos: x}
				);

				if (x == maze.prop.size - 2 && y + 2 == maze.prop.size - 2) {
					maze.prop.end = maze.tree.length - 1;
				}

				recursiveDepthFirst(x, y + 2, maze.tree[maze.tree.length - 1], depth+1);
			}
			break;

		// attempt leftwards path
		case 3: if (x - 2 <= 0) { continue; }
			if (maze.prop.cells[x - 2][y] != 1) {
				maze.prop.cells[x - 2][y] = 1;
				maze.prop.cells[x - 1][y] = 1;

				maze._pushData(
					{id: maze.tree.length,
					 parentId: parentData.id,
					 xPos: y, yPos: x - 2}
				);

				if (x - 2 == 1 && y == 1) {
					maze.prop.start = maze.tree.length - 1;
				}

				recursiveDepthFirst(x - 2, y, maze.tree[maze.tree.length - 1], depth+1);
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
	maze.prop.cells[1][0] = 1;
	maze.prop.cells[maze.prop.size - 2][maze.prop.size - 1] = 1;

	// DEBUG
	// console.log(maze);

	// color the walls light grey
	ctx.fillStyle = "#d4d4d4";

	var cellWidth = canvas.width / maze.prop.size;
	var cellHeight = canvas.height / maze.prop.size;

	for (var i = 0; i < maze.prop.size; i++) {
		for (var j = 0; j < maze.prop.size; j++) {
			if(maze.prop.cells[i][j] == 0) {
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
	if (['w', 'a', 's', 'd'].includes(e.key)) {
		movePlayer(e.key);
	}
}

function movePlayer(dir) {
	if (dir == "w") {
		if (player.row != 1) {
			if (maze.prop.cells[player.row - 1][player.col] != 0) {
				player.row -= 1;
			}
		}
		showPos();
	}
	if (dir == "a") {
		if (player.col != 1) {
			if (maze.prop.cells[player.row][player.col - 1] != 0) {
				player.col -= 1;
			}
		}
		showPos();
	}
	if (dir == "s") {
		if (player.row != maze.prop.size - 2) {
			if (maze.prop.cells[player.row + 1][player.col] != 0) {
				player.row += 1;
			}
		}
		showPos();
	}
	if (dir == "d") {
		if (player.col != maze.prop.size - 2) {
			if (maze.prop.cells[player.row][player.col + 1] != 0) {
				player.col += 1;
			}
		}
		showPos();
	}
}

function showPos() {
	var cellWidth = canvas.width / maze.prop.size;
	var cellHeight = canvas.height / maze.prop.size;

	ctx.fillStyle = "#42d1d6";

	ctx.fillRect(player.col * cellWidth, player.row * cellHeight, cellWidth, cellHeight);
}

function solveMazeDijkstra() {

	// DEBUG
	// console.log(maze.prop.start + ", " + maze.prop.end);
	// console.log(maze.tree);

	const idMapping = maze.tree.reduce((acc, element, i) => {
		acc[element.id] = i;
		return acc;
	}, {});

	// DEBUG
	// console.log(maze.tree);
	// console.log(idMapping);

	let root;
	maze.tree.forEach(element => {
		if (element.parentId === null) {
			root = element;
			return;
		}
		const parentElement = maze.tree[idMapping[element.parentId]];
		parentElement.children = [...(parentElement.children || []), element];
	});

	// DEBUG
	// console.log(root);

	var startNode = searchTree(root, maze.prop.start);
	var endNode = searchTree(root, maze.prop.end);
	var path = getPath(root, startNode, endNode);

	// DEBUG
	// console.log(path);

	displaySolved(path);
}

function getPath(root, n1, n2) {

	// get each endpoints path from the root
	var pathNode1 = getPathFromRoot(root, n1);
	var pathNode2 = getPathFromRoot(root, n2);

	// initialize intersection to not found
	var intersection = -1;
	
	// find the intersection
	var i = 0; j = 0;
	while (i != pathNode1.length || j != pathNode2.length) {
		if (i == j && pathNode1[i] == pathNode2[i]) {
			i++;
			j++;
		} else {
			intersection = j - 1;
			break;
		}
	}

	var path = [];
	for (i = pathNode1.length - 1; i > intersection; i--) {
		path.push(pathNode1[i]);
	}
	for (i = intersection; i < pathNode2.length; i++) {
		path.push(pathNode2[i]);
	}
	return path;
}

function getPathFromRoot(root, node) {
	var path = [];

	var cur = root;
	while (cur.id != node.id) {
		path.push(cur);

		// first branch has the node we are looking for
		if (searchTree(cur.children[0], node.id) != null) {
			cur = cur.children[0];
		}

		// second branch has the node we are looking for
		else if (searchTree(cur.children[1], node.id) != null) {
			cur = cur.children[1];
		}

		// third branch has the node we are looking for
		else if (searchTree(cur.children[2], node.id) != null) {
			cur = cur.children[2];
		}
	}
	return path;
}

function displaySolved(path) {
	var cellsize = canvas.width / maze.prop.size;
	for (var i = 0; i < path.length - 1; i++) {
		drawLine(path[i], path[i + 1], cellsize);
	}
}

function drawLine(p1, p2, mag) {
	ctx.beginPath();
	ctx.moveTo(p1.xPos * mag + mag/2, p1.yPos * mag + mag/2);
	ctx.lineTo(p2.xPos * mag + mag/2, p2.yPos * mag + mag/2);
	ctx.strokeStyle = "#42d1d6";
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();
}

function searchTree(element, ID){
     if(element.id == ID){
          return element;
     }else if (element.children != null){
          var result = null;
          for(var i = 0; result == null && i < element.children.length; i++){
               result = searchTree(element.children[i], ID);
          }
          return result;
     }
     return null;
}