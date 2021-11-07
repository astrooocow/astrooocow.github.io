let quadCanvas = document.getElementById("quadCanvas");
let quadCtx = quadCanvas.getContext("2d");
quadCtx.fillStyle = "#d4d4d4";




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

		if (this._contains(point)) {
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


	// subdivides self into 4 equal subtrees
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

		this.divided = true;
	}

	_contains(point) {
		if (this.divided) {
			if (this.northEast._contains(point)) return true;
			if (this.northWest._contains(point)) return true;
			if (this.southEast._contains(point)) return true;
			if (this.southWest._contains(point)) return true;
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

	_queryRect(boundary, pointsArr) {
		if (!this.bounds.intersects(boundary))
			return false;

		if (this.divided) {
			this.northWest._queryRect(boundary, pointsArr);
			this.northEast._queryRect(boundary, pointsArr);
			this.southWest._queryRect(boundary, pointsArr);
			this.southEast._queryRect(boundary, pointsArr);
		}

		else {
			for (let i = 0; i < this.points.length; i++) {
				if (boundary.contains(this.points[i]))
					drawPoint(this.points[i], 8, "#d6428a");
				else
					drawPoint(this.points[i], 6, "#d6b442");
			}
		}
	}
}


let bounds = new Rectangle(0, 0, quadCanvas.width, quadCanvas.height);
let quadTree = new QuadTree(bounds);
let queryRect = new Rectangle(
	randn_bm() * 769, randn_bm() * 769, 150, 100
);


function getMousePosition(canvas, event) {
	let bounds = canvas.getBoundingClientRect();
  let x = Math.floor(event.clientX - bounds.left);
  let y = Math.floor(event.clientY - bounds.top);

  if (x >= 0 && y >= 0)
	  return [x, y];
}


function drawPoint(point, s, c) {
	quadCtx.fillStyle = c;
	quadCtx.fillRect(point.x - s/2, point.y - s/2, s, s);
}


function drawRect(r, color) {
	quadCtx.beginPath();

	quadCtx.moveTo(Math.round(r.x), Math.round(r.y));
	quadCtx.lineTo(Math.round(r.x), Math.round(r.y + r.height));

	quadCtx.moveTo(Math.round(r.x), Math.round(r.y + r.height));
	quadCtx.lineTo(Math.round(r.x + r.width), Math.round(r.y + r.height));

	quadCtx.moveTo(Math.round(r.x + r.width), Math.round(r.y + r.height));
	quadCtx.lineTo(Math.round(r.x + r.width), Math.round(r.y));

	quadCtx.moveTo(Math.round(r.x + r.width), Math.round(r.y));
	quadCtx.lineTo(Math.round(r.x), Math.round(r.y));

	quadCtx.strokeStyle = color;
	quadCtx.linewidth = 2;
	quadCtx.stroke();
	quadCtx.closePath();

}


function displayQuadTreeBounds(quadTree) {
	drawRect(quadTree.bounds, "#b3b3b3");
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
			drawPoint(quadTree.points[i], 4, "#42d1d6");
		}
	}
}


function isIntersecting(r1, r2) {
	return !(r2.x > r1.x + r1.width || 
           r2.x + r2.width < r1.x || 
           r2.y > r1.y + r1.height ||
           r2.y + r2.height < r1.y);
}


function randn_bm() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -5.0 * Math.log( u ) );
  num *= Math.cos( 2.0 * Math.PI * v );
  num = num / 10.0 + 0.5; 
  if (num > 1 || num < 0) return randn_bm() 
  return num
}


function generateQuadTree() {
	quadTree = new QuadTree(bounds);
	drawCanvasBounds();

	for (let i = 0; i < 500; i++)
	{
    let x = Math.floor(randn_bm() * 769);
    let y = Math.floor(randn_bm() * 769);
    quadTree.insert(new Point(x, y));
	}

	displayQuadTreeBounds(quadTree);
	displayQuadTreePoints(quadTree);

	queryRect = new Rectangle(
		randn_bm() * 769, randn_bm() * 769, 150, 100
	);

	drawRect(queryRect, "#004d66");
	quadTree._queryRect(queryRect, []);

	drawCanvasSplash();
}


function drawCanvasBounds() {
	quadCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);

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
	quadCtx.fillStyle = '#b3b3b3';
	quadCtx.font = '32px Verdana';
	quadCtx.textBaseline = 'middle';
	quadCtx.textAlign = 'center';
	quadCtx.fillText("Click and drag",
		quadCanvas.width  / 2,
		25);

	return true;
}


generateQuadTree();

let mouseDown = false;
quadCanvas.addEventListener("mousedown", e => {
	mouseDown = true;
});

quadCanvas.addEventListener("mouseup", e => {
	mouseDown = false;
});

drawRect(queryRect, "#004d66");
quadTree._queryRect(queryRect, []);

quadCanvas.addEventListener("mousemove", e => {
	if (mouseDown) {
		quadCtx.clearRect(0, 0, quadCanvas.width, quadCanvas.height);
		drawCanvasBounds();
		displayQuadTreeBounds(quadTree);
		displayQuadTreePoints(quadTree);
		let xy = getMousePosition(quadCanvas, e);
		queryRect.x = xy[0] - 75;
		queryRect.y = xy[1] - 50;
		drawRect(queryRect, "#004d66");
		quadTree._queryRect(queryRect, []);

		drawCanvasSplash();
	}
});