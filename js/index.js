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

	intersects(rect) {
		if (this.x >= rect.x + rect.width || rect.x >= this.x + this.width)
			return false;

		if (this.y >= rect.y + rect.height || rect.y >= this.y + this.height)
			return false;

		return true;
	}
}


class Node {
	constructor(x, y, parent) {
		this.x = x;
		this.y = y;
		this.parent = parent;
		this.children = [];
		this.visited = false;
	}


	contains(node)
	{
		if (this.children.length = 0)
			return false;

		for (let i = 0; i < this.children.length; i++)
		{
			
		}
	}
}