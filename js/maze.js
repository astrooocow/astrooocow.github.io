let mazeCanvas = document.getElementById("mazeCanvas");
let mazeCtx = mazeCanvas.getContext("2d");
mazeCtx.fillStyle = "#b3b3b3";

let cellSize = 45;


function recursive(row, col, arr) {
	let dirs = [1, 2, 3, 4];
	dirs = randomizeArray(dirs);
	arr[row][col].visited = true;

	for (let i = 0; i < dirs.length; i++)
	{
		switch (dirs[i])
		{
		case 1:  // up
			if (row - 1 < 0) 
				continue;

			if (!arr[row - 1][col].visited)
			{
				arr[row - 1][col].visited = true;
				arr[row - 1][col].parent = arr[row][col];
				arr[row][col].children.push(arr[row - 1][col]);
				recursive(row - 1, col, arr);
			}
			break;

		case 2:  // right
			if (col + 1 > mazeCanvas.width / cellSize - 1) 
				continue;

			if (!arr[row][col + 1].visited)
			{
				arr[row][col + 1].visited = true;
				arr[row][col + 1].parent = arr[row][col];
				arr[row][col].children.push(arr[row][col + 1]);
				recursive(row, col + 1, arr);
			}
			break;

		case 3:  // down
			if (row + 1 > mazeCanvas.height / cellSize - 1) 
				continue;

			if (!arr[row + 1][col].visited)
			{
				arr[row + 1][col].visited = true;
				arr[row + 1][col].parent = arr[row][col];
				arr[row][col].children.push(arr[row + 1][col]);
				recursive(row + 1, col, arr);
			}
			break;

		case 4:  // left
			if (col - 1 < 0) 
				continue;

			if (!arr[row][col - 1].visited)
			{
				arr[row][col - 1].visited = true;
				arr[row][col - 1].parent = arr[row][col];
				arr[row][col].children.push(arr[row][col - 1]);
				recursive(row, col - 1, arr);
			}
			break;
		}
	}
}


function displayMaze(root)
{
	for (let i = 0; i < root.children.length; i++)
	{
		let child = root.children[i];
		let bounds = new Rectangle(
			root.x <= child.x ? root.x * cellSize : child.x * cellSize,
			root.y <= child.y ? root.y * cellSize : child.y * cellSize,
			root.x == child.x ? cellSize - 4 : cellSize * 2 - 4,
			root.y == child.y ? cellSize - 4 : cellSize * 2 - 4
		);
		drawCell(bounds);
		displayMaze(root.children[i]);
	}
}


function generateMaze() {
	displayMazeBackground();

	let width  = Math.floor(mazeCanvas.width  / cellSize);
	let height = Math.floor(mazeCanvas.height / cellSize);

	let arr = new Array(height);
	for (let i = 0; i < height; i++)
		arr[i] = new Array(width);

	for (let i = 0; i < height; i++) { 
		for (let j = 0; j < width; j++)
			arr[i][j] = new Node(j, i, null);
	}

	let startx = getRandomInt(width);
	let starty = getRandomInt(height);

	recursive(starty, startx, arr);
	displayMaze(arr[starty][startx]);

	let solveButton = document.getElementById("solveMazeButton");
	solveButton.disabled = false;

	solveButton.onclick = function() {
		displaySolution(arr, startx, starty, width, height);
		solveButton.disabled = true;
	}
}


function randomizeArray(array) {
	let arr = array;
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


function drawCell(bounds) {
	mazeCtx.fillStyle = "white";
	mazeCtx.fillRect(bounds.x + 4, bounds.y + 4, bounds.width, bounds.height);
}


function displaySolution(arr, startx, starty, width, height)
{
	let path1 = [];
	getPath(arr[starty][startx], arr[0][0], path1);

	let path2 = [];
	getPath(arr[starty][startx], arr[width - 1][height - 1], path2);


	let intersection = -1;

  let i = 0, j = 0;
  while (i != path1.length || j != path2.length) {

    if (i == j && path1[i] == path2[i]) {
      i++;
      j++;
    }
    else {
      intersection = j - 1;
      break;
    }
  }

  let path = [];
  for (let i = path1.length - 1; i > intersection; i--)
    path.push(path1[i]);
 
  for (let i = intersection; i < path2.length; i++)
    path.push(path2[i]);

	mazeCtx.fillStyle = "#004d66";
	for (let i = 0; i < path.length - 1; i++)
		drawLine(path[i], path[i + 1]);
}


function drawLine(node1, node2)
{
	let x = (node1.x <= node2.x) ? 
		node1.x * cellSize + Math.ceil(cellSize / 2) :
		node2.x * cellSize + Math.ceil(cellSize / 2);

	let y = (node1.y <= node2.y) ?
		node1.y * cellSize + Math.ceil(cellSize / 2) :
		node2.y * cellSize + Math.ceil(cellSize / 2);

	let width  = (node1.x == node2.x) ? 2 : cellSize + 2;
	let height = (node1.y == node2.y) ? 2 : cellSize + 2;

	mazeCtx.fillRect(x, y, width, height);
}


function displayMazeBackground()
{
	mazeCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
	mazeCtx.fillStyle = "#42d1d6";
	mazeCtx.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);
	mazeCtx.fillStyle = "white";
	mazeCtx.fillRect(0, 4, 4, cellSize - 4);
	mazeCtx.fillRect(
		mazeCanvas.width - 4,
		mazeCanvas.height - cellSize,
		4, cellSize - 4
	);
}


function getPath(root, end, path)
{
	if (root == null)
		return false;

	path.push(root);

	if (root == end)
		return true;

	for (let i = 0; i < root.children.length; i++)
	{
		if (getPath(root.children[i], end, path))
			return true;
	}

	path.pop();
	return false;
}


generateMaze();