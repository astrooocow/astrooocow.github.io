var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.lineWidth = 2;

var width = 25;
var height = 25;

for (var i = 1; i < width; i++) {
	var xpos = i * canvas.width / width;
	ctx.moveTo(xpos, 0);
	ctx.lineTo(xpos, canvas.height);
}
for (var i = 1; i < height; i++) {
	var ypos = i * canvas.height / width;
	ctx.moveTo(0, ypos);
	ctx.lineTo(canvas.width, ypos);
}
		
ctx.stroke();