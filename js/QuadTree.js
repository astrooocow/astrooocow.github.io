let quadCanvas = document.getElementById("quadCanvas");
let quadCtx = quadCanvas.getContext("2d");
quadCtx.fillStyle = "#d4d4d4";


class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}


class Rectangle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width  = width;
		this.height = height;

		this.centerx = x + (width  / 2);
		this.centery = y + (height / 2);
	}

	contains(point) {
		if (point.x >= this.x && point.x <= this.x + this.width) {
			if (point.y >= this.y && point.y <= this.y + this.height)
				return true;
		}

		return false;
	}
}


/* Sorts given points in space into manageable rectangles
*  in this instance, only leaf nodes can contain point(s)
*  
*  @param capacity: max number of points per leaf
*  @param bounds  : bounding rectangle
*  @param points[]: point values
*  @param divided : boolean determining if this quadTree
*                   has divided yet.
*/
class QuadTree {

	constructor(bounds) {
		this.capacity = 1;
		this.bounds = bounds;
		this.points = [];
		this.divided = false;

		// subtrees
		this.northWest = undefined;
		this.northEast = undefined;
		this.southEast = undefined;
		this.southWest = undefined;
	}


	insert(point) {
		// dont insert if out of bounds
		if (!this.bounds.contains(point)) {
			return false;
		}

		if (this._query(point)) {
			return false;
		}

		// insert if there is space, and has no children
		if (this.points.length < this.capacity && !this.divided) {
			this.points.push(point);
			return true;

		// otherwise divide this quadTree
		} else if (!this.divided) {
			this._subdivide();

			// insert old point(s) into children
			for (let i = 0; i < this.points.length; i++) {
				if (this.northWest.insert(this.points[i])) 
					{ this.points = []; continue; }
				if (this.northEast.insert(this.points[i]))
					{ this.points = []; continue; }
				if (this.southEast.insert(this.points[i]))
					{ this.points = []; continue; }
				if (this.southWest.insert(this.points[i]))
					{ this.points = []; continue; }
			}
		}

		// insert new point into children
		if (this.northWest.insert(point)) return true;
		if (this.northEast.insert(point)) return true;
		if (this.southEast.insert(point)) return true;
		if (this.southWest.insert(point)) return true;
	}


	// subdivides this quadTree and draws bounding rect
	// to canvas
	_subdivide() {
		let NWbounds = new Rectangle(
			this.bounds.x,
			this.bounds.y,
			this.bounds.width  / 2,
			this.bounds.height / 2 );
		let NEbounds = new Rectangle(
			this.bounds.centerx,
			this.bounds.y,
			this.bounds.width  / 2,
			this.bounds.height / 2 );
		let SEbounds = new Rectangle(
			this.bounds.centerx,
			this.bounds.centery,
			this.bounds.width  / 2,
			this.bounds.height / 2 );
		let SWbounds = new Rectangle(
			this.bounds.x,
			this.bounds.centery,
			this.bounds.width  / 2,
			this.bounds.height / 2 );

		this.northWest = new QuadTree(NWbounds);
		this.northEast = new QuadTree(NEbounds);
		this.southEast = new QuadTree(SEbounds);
		this.southWest = new QuadTree(SWbounds);

		drawRect(NWbounds);
		drawRect(NEbounds);
		drawRect(SEbounds);
		drawRect(SWbounds);

		this.divided = true;
	}

	_query(point) {
		if (this.divided) {
			if (this.northEast._query(point)) return true;
			if (this.northWest._query(point)) return true;
			if (this.southEast._query(point)) return true;
			if (this.southWest._query(point)) return true;
			return false;

		} else {
			for (let i = 0; i < this.points.length; i++) {
				if (this.points[i].x == point.x &&
						this.points[i].y == point.y)
					return true;
			}
			return false;
		}
	}
}


function getMousePosition(canvas, event) {
	let bounds = canvas.getBoundingClientRect();
  let x = Math.floor(event.clientX - bounds.left);
  let y = Math.floor(event.clientY - bounds.top);

  if (x >= 0 && y >= 0)
	  return new Point(x, y);
}


function drawPoint(point, s) {
	quadCtx.fillStyle = "#42d1d6";
	quadCtx.fillRect(point.x - s/2, point.y - s/2, s, s);
}


function drawRect(r) {
	quadCtx.beginPath();

	quadCtx.moveTo(Math.round(r.x), Math.round(r.y));
	quadCtx.lineTo(Math.round(r.x), Math.round(r.y + r.height));

	quadCtx.moveTo(Math.round(r.x), Math.round(r.y + r.height));
	quadCtx.lineTo(Math.round(r.x + r.width), Math.round(r.y + r.height));

	quadCtx.moveTo(Math.round(r.x + r.width), Math.round(r.y + r.height));
	quadCtx.lineTo(Math.round(r.x + r.width), Math.round(r.y));

	quadCtx.moveTo(Math.round(r.x + r.width), Math.round(r.y));
	quadCtx.lineTo(Math.round(r.x), Math.round(r.y));

	quadCtx.strokeStyle = "#d4d4d4";
	quadCtx.linewidth = 2;
	quadCtx.stroke();
	quadCtx.closePath();

}


function displayQuadTreeBounds(quadTree) {
	drawRect(quadTree.bounds);
	if (quadTree.divided) {
		displayQuadTreeBounds(quadTree.northEast);
		displayQuadTreeBounds(quadTree.northWest);
		displayQuadTreeBounds(quadTree.southEast);
		displayQuadTreeBounds(quadTree.southWest);
	}
}


function displayQuadTreePoints(quadTree) {
	if (quadTree.divided) {
		displayQuadTreePoints(quadTree.northEast);
		displayQuadTreePoints(quadTree.northWest);
		displayQuadTreePoints(quadTree.southEast);
		displayQuadTreePoints(quadTree.southWest);

	} else {
		for (let i = 0; i < quadTree.points.length; i++) {
			drawPoint(quadTree.points[i], 4);
		}
	}
}


function start() {
	let bounds = new Rectangle(0, 0, quadCanvas.width, quadCanvas.height);
	let quadTree = new QuadTree(bounds);

	let splashMessageDisplayed = drawCanvasSplash();
	drawCanvasBounds();
	
	quadCanvas.addEventListener("click", function(e) {
		let point = getMousePosition(quadCanvas, e);

		if (point) {

			if (splashMessageDisplayed) {
				quadCtx.clearRect(0, 0, quadCanvas.width, quadCanvas.height);
				drawCanvasBounds();
				splashMessageDisplayed = false;
			}

			if (quadTree.insert(point)) {
				quadCtx.clearRect(0, 0, quadCanvas.width, quadCanvas.height);
				drawCanvasBounds();
				displayQuadTreeBounds(quadTree);
				displayQuadTreePoints(quadTree);
			}
		}
	});
}


function drawCanvasBounds() {
	quadCtx.beginPath();

	quadCtx.moveTo(1, 1);
	quadCtx.lineTo(1, quadCanvas.height - 1);

	quadCtx.moveTo(1, quadCanvas.height - 1);
	quadCtx.lineTo(quadCanvas.width - 1, quadCanvas.height - 1);

	quadCtx.moveTo(quadCanvas.width - 1, quadCanvas.height - 1);
	quadCtx.lineTo(quadCanvas.width - 1, 1);

	quadCtx.moveTo(quadCanvas.width - 1, 1);
	quadCtx.lineTo(1, 1);

	quadCtx.strokeStyle = "#d4d4d4";
	quadCtx.linewidth = 4;
	quadCtx.stroke();
	quadCtx.closePath();
}


function drawCanvasSplash() {
	quadCtx.font = '48px Verdana';
	quadCtx.textBaseline = 'middle';
	quadCtx.textAlign = 'center';
	quadCtx.fillText("Click anywhere!",
		quadCanvas.width  / 2,
		quadCanvas.height / 2);

	return true;
}


start();