let mazeCanvas = document.getElementById("mazeCanvas");
let mazeCtx = mazeCanvas.getContext("2d");
mazeCtx.fillStyle = "#d4d4d4";

/*
  Dynamic variable that stores the "xy" position of
  the player within the maze. when a new maze is 
  generated the player variable is reset to
  row : 1, col : 1
 */
let player = {
	'row' : 1,
	'col' : 1
};


class Maze {
	constructor() {
		// default properties of the maze
		// size  : sidelength in px of each cell
		// cells : array containing visited value of each cell
		// start : id of the starting node
		// end   : id of the ending node
		this.properties = {
			'size' : mazeCanvas.width/15,
			'cells' : undefined,
			'start' : undefined,
			'end'   : undefined
		};

		// fill cells property with initial values
		this.properties.cells = this.mazeInit();

		// init variable storing tree data
		// stores id, parent id, xposition, yposition
		// data is processed and stored as a proper tree later.
		this.tree = [];
	}

	// helper function to
	// push data to tree
	_pushData (data) {
		this.tree.push(data);
	}

	// this function fills a 2D array with empty
	// values. The array is the maze sizes height
	// and length.
	mazeInit () {
		let m = new Array(this.properties.size);
		for (let i = 0; i < this.properties.size; i++) {
			m[i] = new Array(this.properties.size);
		}
		return m;
	}
}



/*
	This function picks the a start positon
	randomly. Then a tree is filled using
	a random recursive depth first search
	from the randomly selected point.

	Precondition  : none
	Postcondition : 
*/
function generateMaze() {
	maze.tree = [];
	mazeCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);

	// initialize all maze cells to unvisited
	for (let i = 0; i < maze.properties.size; i++) {
		for (let j = 0; j < maze.properties.size; j++) {
			maze.properties.cells[i][j] = 0;
		}
	}

	// select starting x position
	let startCol = getRandomInt(maze.properties.size);
	while (startCol % 2 == 0) {
		startCol = getRandomInt(maze.properties.size);
	}

	// select starting y position
	let startRow = getRandomInt(maze.properties.size);
	while (startRow % 2 == 0) {
		startRow = getRandomInt(maze.properties.size);
	}

	// initialize starting xy position
	maze.properties.cells[startRow][startCol] = 1;
	if (startRow == 1 && startCol == 1) {
		maze.properties.start = 0;
	}
	if (startRow == maze.properties.size - 2 && startCol == maze.properties.size - 2) {
		maze.properties.end = 0;
	}

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
    let ctr = arr.length, temp, index;

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
	let dirs = [0, 1, 2, 3];
	shuffle(dirs);

	// for each path in dirs[] attempt to take it.
	for (let i = 0; i < dirs.length; i++) {
		switch (dirs[i]) {

		// attempt upwards path
		case 0: if (y - 2 <= 0) { continue; }
			if (maze.properties.cells[x][y - 2] != 1) {
				maze.properties.cells[x][y - 2] = 1;
				maze.properties.cells[x][y - 1] = 1;

				maze._pushData(
					{id: maze.tree.length,
					 parentId: parentData.id,
					 xPos: y - 2, yPos: x}
				);

				if (x == 1 && y - 2 == 1) {
					maze.properties.start = maze.tree.length - 1;
				}

				recursiveDepthFirst(x, y - 2, maze.tree[maze.tree.length - 1], depth+1);
			}
			break;
		
		// attempt rightwards path
		case 1: if (x + 2 >= maze.properties.size - 1) { continue; }
			if (maze.properties.cells[x + 2][y] != 1) {
				maze.properties.cells[x + 2][y] = 1;
				maze.properties.cells[x + 1][y] = 1;

				maze._pushData(
					{id: maze.tree.length,
					 parentId: parentData.id,
					 xPos: y, yPos: x + 2}
				);

				if (x + 2 == maze.properties.size - 2 && y == maze.properties.size - 2) {
					maze.properties.end = maze.tree.length - 1;
				}

				recursiveDepthFirst(x + 2, y, maze.tree[maze.tree.length - 1], depth+1);
			}
			break;

		// attempt downwards path
		case 2: if (y + 2 >= maze.properties.size - 1) { continue; }
			if (maze.properties.cells[x][y + 2] != 1) {
				maze.properties.cells[x][y + 2] = 1;
				maze.properties.cells[x][y + 1] = 1;

				maze._pushData(
					{id: maze.tree.length,
					 parentId: parentData.id,
					 xPos: y + 2, yPos: x}
				);

				if (x == maze.properties.size - 2 && y + 2 == maze.properties.size - 2) {
					maze.properties.end = maze.tree.length - 1;
				}

				recursiveDepthFirst(x, y + 2, maze.tree[maze.tree.length - 1], depth+1);
			}
			break;

		// attempt leftwards path
		case 3: if (x - 2 <= 0) { continue; }
			if (maze.properties.cells[x - 2][y] != 1) {
				maze.properties.cells[x - 2][y] = 1;
				maze.properties.cells[x - 1][y] = 1;

				maze._pushData(
					{id: maze.tree.length,
					 parentId: parentData.id,
					 xPos: y, yPos: x - 2}
				);

				if (x - 2 == 1 && y == 1) {
					maze.properties.start = maze.tree.length - 1;
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
	maze.properties.cells[1][0] = 1;
	maze.properties.cells[maze.properties.size - 2][maze.properties.size - 1] = 1;

	// color the walls light grey
	mazeCtx.fillStyle = "#d4d4d4";

	let cellWidth = mazeCanvas.width / maze.properties.size;
	let cellHeight = mazeCanvas.height / maze.properties.size;

	for (let i = 0; i < maze.properties.size; i++) {
		for (let j = 0; j < maze.properties.size; j++) {
			if(maze.properties.cells[i][j] == 0) {
				mazeCtx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
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
		case 'w':
		if (player.row != 1) {
			if (maze.properties.cells[player.row - 1][player.col] != 0) {
				player.row -= 1;
			}
		} break;

		case 'a':
		if (player.col != 1) {
			if (maze.properties.cells[player.row][player.col - 1] != 0) {
				player.col -= 1;
			}
		} break;
		
		case 's':
		if (player.row != maze.properties.size - 2) {
			if (maze.properties.cells[player.row + 1][player.col] != 0) {
				player.row += 1;
			}
		} break;
		
		case 'd':
		if (player.col != maze.properties.size - 2) {
			if (maze.properties.cells[player.row][player.col + 1] != 0) {
				player.col += 1;
			}
		} break;
	}
	showPos();
}

function showPos() {
	let cellWidth = mazeCanvas.width / maze.properties.size;
	let cellHeight = mazeCanvas.height / maze.properties.size;

	mazeCtx.fillStyle = "#42d1d6";

	mazeCtx.fillRect(player.col * cellWidth, player.row * cellHeight, cellWidth, cellHeight);
}

function solveMazeDijkstra() {

	// DEBUG
	// console.log(maze.properties.start + ", " + maze.properties.end);
	// console.log(maze.tree);

	let root;
	maze.tree.forEach(element => {
		if (element.parentId === null) {
			root = element;
			return;
		}
		const parentElement = maze.tree[element.parentId];
		parentElement.children = [...(parentElement.children || []), element];
	});

	// DEBUG
	// console.log(root);

	let startNode = searchTree(root, maze.properties.start);
	let endNode = searchTree(root, maze.properties.end);
	let path = getPath(root, startNode, endNode);

	// DEBUG
	// console.log(path);

	displaySolved(path);
}

function getPath(root, n1, n2) {

	// get each endpoints path from the root
	let pathNode1 = getPathFromRoot(root, n1);
	let pathNode2 = getPathFromRoot(root, n2);

	// initialize intersection to not found
	let intersection = -1;
	
	// find the intersection
	let i = 0; j = 0;
	while (i != pathNode1.length || j != pathNode2.length) {
		if (i == j && pathNode1[i] == pathNode2[i]) {
			i++;
			j++;
		} else {
			intersection = j - 1;
			break;
		}
	}

	let path = [];
	for (i = pathNode1.length - 1; i > intersection; i--) {
		path.push(pathNode1[i]);
	}
	for (i = intersection; i < pathNode2.length; i++) {
		path.push(pathNode2[i]);
	}
	return path;
}

function getPathFromRoot(root, node) {
	let path = [];

	let cur = root;
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
	let cellsize = mazeCanvas.width / maze.properties.size;
	for (let i = 0; i < path.length - 1; i++) {
		drawLine(path[i], path[i + 1], cellsize);
	}
}

function drawLine(p1, p2, mag) {
	mazeCtx.beginPath();
	mazeCtx.moveTo(p1.xPos * mag + mag/2, p1.yPos * mag + mag/2);
	mazeCtx.lineTo(p2.xPos * mag + mag/2, p2.yPos * mag + mag/2);
	mazeCtx.strokeStyle = "#42d1d6";
	mazeCtx.lineWidth = 2;
	mazeCtx.stroke();
	mazeCtx.closePath();
}

function searchTree(element, ID){
     if(element.id == ID){
          return element;
     }else if (element.children != null){
          let result = null;
          for(let i = 0; result == null && i < element.children.length; i++){
               result = searchTree(element.children[i], ID);
          }
          return result;
     }
     return null;
}



/* Create the maze Object */
let maze = new Maze();
generateMaze();