/*** SPIDER GRAPH ***/
function drawSpiderGraph(selector, stat, options)
{
	var spiderGraph  = document.querySelector(selector);
	var context 	 = spiderGraph.getContext("2d");

	var canvasWidth  = spiderGraph.width;
	var canvasHeight = spiderGraph.height;

	var xPadding   	 = canvasWidth / 10;
	var yPadding   	 = canvasHeight / 10;

	var graphSize 	 = { value: 75000, pixel: (canvasHeight - 2 * yPadding) / 2 };
	var points 		 =
				[
					{ alias: 'Java', x: canvasWidth / 2, y: yPadding },
					{ alias: 'JS',   x: canvasWidth - xPadding, y: yPadding + (canvasHeight - 2 * yPadding) / 4 },
					{ alias: 'C',    x: canvasWidth - xPadding, y: 3 * (canvasHeight - 2 * yPadding) / 4 + yPadding },
					{ alias: 'Objc', x: canvasWidth / 2, y: canvasHeight - yPadding },
					{ alias: 'C#',   x: xPadding, y: 3 * (canvasHeight - 2 * yPadding) / 4 + yPadding },
					{ alias: 'PHP',  x: xPadding, y: yPadding + (canvasHeight - 2 * yPadding) / 4 }
				];

	drawCrossLinesNetwork(context, points, options);
	drawHexagon(context, points, options);
	for (var i = 0; i <= options.delimeterCount; i++) {
		drawHexagon(context, points, options);
		if (i == 1) {
			options.offset += 60;
		} else {
			options.offset += 50;
		}
	}
	drawLineNames(context, stat);
	drawStatistic(context, points, stat, graphSize);
}

function drawCrossLinesNetwork (context, points, options)
{
	for (var j = 0; j < points.length / 2; j++) {
		context.lineWidth = options.lineWidth;
		context.moveTo(points[j].x, points[j].y);
		context.lineTo(points[j + 3].x, points[j + 3].y);
		context.strokeStyle = options.strokeStyle;
		context.stroke();
	}
}

function drawHexagon (context, points, options)
{
	var config = {};
	var startPointOffset = endPointOffset = { x: 0, y: 0};

	for ( var i = 0; i < points.length; i++ ) {
		/* if offset not 0, drawing hexagon is inner */
		if (options.offset != 0) {
			startPointOffset = getPointOffset(i, options.offset);
			endPointOffset   = getPointOffset(i + 1, options.offset);
		}

		if (i != points.length - 1) {
			context.beginPath();
			context.moveTo(points[i].x + startPointOffset.x, points[i].y + startPointOffset.y);
			context.lineTo(points[i + 1].x + endPointOffset.x, points[i + 1].y + endPointOffset.y );
			context.strokeStyle = options.strokeStyle;
			context.stroke();
		 	if (options.offset == 0) {
		 		var eventTextOffset = getEventNameTextOffset(points, points[i].alias);
				context.beginPath();
				context.fillStyle = '#9BA3AF';
		  		context.font = "20px Tahoma";
		  		context.fillText(points[i].alias, points[i].x + eventTextOffset.x, points[i].y + eventTextOffset.y);
		  		context.stroke();
		  	}
			config.startX = points[i + 1].x + endPointOffset.x;
			config.startY = points[i + 1].y + endPointOffset.y;
			config.radius = 1;
		} else {
			/* Hexagon last point case */
			context.beginPath();
			context.moveTo(points[points.length - 1].x + startPointOffset.x, points[points.length - 1].y + startPointOffset.y);
			context.lineTo(points[0].x + endPointOffset.x, points[0].y + endPointOffset.y);
			context.stroke();

			if (options.offset == 0) {
				context.beginPath();
		  		context.font = "20px Tahoma";
		  		context.fillText(points[i].alias, points[i].x - 35, points[i].y + startPointOffset.y);
		  		context.stroke();
		  	}
			config.startX = points[0].x + endPointOffset.x;
			config.startY = points[0].y + endPointOffset.y;
			config.radius = 1;
		}
	}
}

/* Used for statistics points */
function getStatisticsPointOffset (i, offset)
{
	var xOffset, yOffset;
	if (i % 3 == 0) {
		xOffset = 0;
		yOffset = offset;
	} else {
		yOffset = Math.floor(offset / 2);
		/* Pythagoras theorem */
		xOffset = Math.ceil(Math.sqrt( Math.pow(offset, 2) - Math.pow(yOffset, 2) )) + 8;
	}
	/* find offset direction */
	switch (i) {
		case '1' :
			xOffset = -1 * xOffset;
			break;
		case '2' :
			xOffset = -1 * xOffset;
			yOffset = -1 * yOffset;
			break;
		case '3' :
			yOffset = -1 * yOffset;
			break;
		case '4' :
			yOffset = -1 * yOffset;
			break;
	}
	return { x: xOffset, y: yOffset };
}
/* Used for frame hexagons points*/
function getPointOffset (i, offset)
{
	var xOffset, yOffset;
	if (i % 3 == 0) {
		xOffset = 0;
		yOffset = offset;
	} else {
		yOffset = Math.floor(offset / 2);
		/* Pythagoras theorem */
		xOffset = Math.ceil(Math.sqrt(Math.pow(offset, 2) - Math.pow(yOffset, 2))) + 8;
		xOffset += 4;
		yOffset += 1;
	}
	/* find offset direction */
	switch (i) {
		case 1 :
			xOffset = -1 * xOffset;
			break;
		case 2 :
			xOffset = -1 * xOffset;
			yOffset = -1 * yOffset;
			break;
		case 3 :
			yOffset = -1 * yOffset;
			break;
		case 4 :
			yOffset = -1 * yOffset;
			break;
	}
	return { x: xOffset, y: yOffset};
}

function drawArc(context, config)
{
	context.beginPath();
	context.strokeStyle = config.color;
	context.fillStyle   = config.color;
 	context.arc(config.startX, config.startY, config.radius, 0, 2 * Math.PI, false);
 	context.fill();
	context.stroke();
}

function drawStatistic(context, points, stat, graphSize)
{
	var offsetPixel, offsetPercent, eventAlias, pointOffset, config = {}, statPointCoordinatesList = [];
	for (var i = 0; i < stat.length; i++) {
			statPointCoordinatesList = [];
		for (var j = 1; j < stat[i].length; j++) {
			offsetPercent = (graphSize.value - stat[i][j].value) / graphSize.value * 100;
			offsetPixel   = graphSize.pixel / 100 * offsetPercent;

			for (key in points) {
				if (points[key].alias == stat[i][j].type) {
					pointOffset = getStatisticsPointOffset(key, offsetPixel);
					config.radius = 5;
					config.color  = stat[i][0].color;
					config.startX = parseInt(points[key].x) + parseInt(pointOffset.x);
					config.startY = parseInt(points[key].y)   + parseInt(pointOffset.y);
					statPointCoordinatesList.push({ x: config.startX, y: config.startY, color: config.color, name: config.name});
					drawArc(context, config);
				}
			}
		}
		joinPoints(context, statPointCoordinatesList);
	}
}

function joinPoints(context, statPointCoordinatesList)
{
	for (key in statPointCoordinatesList) {
		if (key == statPointCoordinatesList.length - 1)
			break;
			context.beginPath();
			context.lineWidth = 2;
			context.strokeStyle = statPointCoordinatesList[key].color;
			context.moveTo(statPointCoordinatesList[key].x, statPointCoordinatesList[key].y);
			context.lineTo(statPointCoordinatesList[parseInt(key) + 1].x, statPointCoordinatesList[parseInt(key) + 1].y);
			context.stroke();
	}
	context.moveTo(statPointCoordinatesList[0].x, statPointCoordinatesList[0].y);
	context.lineTo(statPointCoordinatesList[statPointCoordinatesList.length - 1].x, statPointCoordinatesList[statPointCoordinatesList.length - 1].y);
	context.stroke();
}

function drawLineNames(context, statList)
{
	var config = {};
	config.radius = 5;
	for (key in statList) {
		context.beginPath();
		context.lineWidth = 3;
		context.strokeStyle = statList[key][0].color;

		config.color  = context.strokeStyle;
		config.startX = 30	;
		config.startY = 10 + parseInt(key) * 20;

		context.moveTo(10, 10 + parseInt(key) * 20);
		context.lineTo(50 , 10 + parseInt(key) * 20);
		context.stroke();
		drawArc(context, config);

		context.beginPath();
		context.fillStyle = "#9BA3AF";
	  	context.font = "14px Tahoma";
	  	context.fillText(statList[key][0].name.toUpperCase(), 55, 15 + parseInt(key) * 20);
	}
}

function getEventNameTextOffset(points, alias)
{
	var offset = 5;
	var xOffset, yOffset, aliasIndex;
	for (key in points) {
		if (points[key].alias == alias) {
			aliasIndex = parseInt(key);
			break;
		}
	}

	switch (aliasIndex) {
		case 0 :
	 		xOffset = -15;
			yOffset = -10;
			break;
		case 1 :
	 		xOffset = 10;
			yOffset = 0;
			break;
		case 2 :
	 		xOffset = 10;
			yOffset = 10;
			break;
		case 3 :
	 		xOffset = -15;
			yOffset = 25;
			break;
		case 4 :
	 		xOffset = -30;
			yOffset = 15;
			break;
		case 5 :
	}
	return { x: xOffset, y: yOffset };
}

/*** LINEAR GRAPH FUNCTIONS ***/

function getMaxY() {
    var max = 0;

    for (var i = 0; i < data.values.length; i++) {
        if (data.values[i].Y > max) {
            max = data.values[i].Y;
        }
    }

	for (var i = 0; i < previousData.values.length; i++) {
        if (previousData.values[i].Y > max) {
            max = previousData.values[i].Y;
        }
    }

    max += 10 - max % 10;
    return max;
}

function drawLinearGraph(selector, data, previousData, options)
{
    var graph = document.querySelector(selector);
	var drawedCirclesPrevGraph 	  = [];
	var drawedCirclesCurrentGraph = [];

    var c = graph.getContext('2d');

    c.lineWidth = options.lineWidth;
    c.strokeStyle = '#333';

    c.font = 'italic 8pt sans-serif';
    c.textAlign = "center";

    // Draw the axises
    c.beginPath();
    c.moveTo(options.xPadding, 0);
    c.lineTo(options.xPadding, graph.height - options.yPadding);
    c.lineTo(graph.width, graph.height - options.yPadding);
    c.stroke();

    // Draw the X value texts
	var maxLengthData = previousData;
	if (data.values.length > previousData.values.length) {
		maxLengthData = data;
	}
	for (var i = 0; i < maxLengthData.values.length; i++) {
		c.fillStyle = '#808080';
		c.fillText(maxLengthData.values[i].X, getXPixel(i), graph.height - options.yPadding + 20);
	}
    // Draw the Y value texts
    c.textAlign = "right"
    c.textBaseline = "middle";

    for (var i = 0; i < getMaxY(); i += 10) {
		c.fillStyle = '#808080';
        c.fillText(i, options.xPadding - 10, getYPixel(i));
    }

    c.strokeStyle = options.currColor;

    c.beginPath();
    c.moveTo(getXPixel(0), getYPixel(data.values[0].Y));
    for(var i = 1; i < data.values.length; i ++) {
        c.lineTo(getXPixel(i), getYPixel(data.values[i].Y));
    }
    c.stroke();

    c.fillStyle = options.currCircleColor;

    for (var i = 0; i < data.values.length; i++) {
        c.beginPath();
        c.arc(getXPixel(i), getYPixel(data.values[i].Y), 4, 0, Math.PI * 2, true);
		drawedCirclesCurrentGraph.push({ x: Math.round(getXPixel(i)), y: Math.round(getYPixel(data.values[i].Y)) });
        c.fill();
    }

    // Draw Previous Graph
	c.lineWidth = options.lineWidth;
    c.strokeStyle = '#333';

    c.font = 'italic 8pt sans-serif';
    c.textAlign = "center";

    c.beginPath();
    c.moveTo(options.xPadding, 0);
    c.lineTo(options.xPadding, graph.height - options.yPadding);
    c.lineTo(graph.width, graph.height - options.yPadding);
    c.stroke();

	c.strokeStyle = options.prevColor;

    c.beginPath();
    c.moveTo(getXPixel(0), getYPixel(previousData.values[0].Y));
    for (var i = 1; i < previousData.values.length; i ++) {
        c.lineTo(getXPixel(i), getYPixel(previousData.values[i].Y));
    }
    c.stroke();

    c.fillStyle = options.prevCircleColor;

    for (var i = 0; i < previousData.values.length; i ++) {
        c.beginPath();
        c.arc(getXPixel(i), getYPixel(previousData.values[i].Y), 4, 0, Math.PI * 2, true);
		drawedCirclesPrevGraph.push({ x: Math.round(getXPixel(i)), y: Math.round(getYPixel(data.values[i].Y))})
        c.fill();
    }

    function getXPixel(val) {
    	return ((graph.width - options.xPadding) / data.values.length) * val + ( options.xPadding * 1.5);
	}

	function getYPixel(val) {
	    return graph.height - (((graph.height - options.yPadding) / getMaxY()) * val) -  options.yPadding;
	}
}

/*** CIRCLE GRAPH ***/
function drawCircleGraph(selector, stat, max, options) {
	var canvas = document.querySelector(selector);
	var context = canvas.getContext('2d');
	var x = canvas.width / 2;
	var y = canvas.height / 2;

	var endPercentCurrent = (stat + 10) / max * 100 ;
	var endPercentCurrentText = (stat) / max * 100 ;

	var curPerc = 0;
	var counterClockwise = true;
	var circ = Math.PI * 2;
	var quart = Math.PI / 2;

	context.lineWidth = options.innerLineWidth;
	context.strokeStyle = options.innerFillColor;
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur  = 1;
	context.shadowColor = options.shadowColor;
	context.arc(x, y, options.radius, 0, 2 * Math.PI);
	context.stroke();
	context.shadowColor = "white";
	context.fillStyle = options.textColor;
	context.font = "normal 50px ProximaNova-Regular";
	context.fillText(endPercentCurrentText, 108, 155);

	context.fillStyle = options.textColor;
	context.font = "normal 22px  ProximaNova-Regular";
	context.fillText("%", 160, 135);

	context.lineWidth = options.outerLineWidth;

	function animateCurrent(current) {
	    context.beginPath();
		context.shadowColor = options.outerFillColor;
		context.strokeStyle = options.outerFillColor;
	    context.arc(x, y, options.radius, -(quart), ((circ) * current) - quart, false);
	    context.stroke();
	    curPerc++;
	    if (curPerc < endPercentCurrent) {
	        requestAnimationFrame(function () {
	           animateCurrent(curPerc / 100);
	        });
	    }
	}
	animateCurrent();
	document.getElementById('#total-count').innerHTML = endPercentCurrent + '<span class = "total-percent">%</span>';
}

/*** PIE GRAPH ***/

function drawPieChart(pieData, options)
{
    var canvas = document.getElementById('myCanvas');
    var base = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;

    base.beginPath();
    base.arc(centerX, centerY, options.radius, 0, 2 * Math.PI, false);
    base.fillStyle = options.fillStyle;
    drawBorder(base);
    base.stroke();

    var startAngle = 0;

    for (var key in pieData) {
        document.getElementById("pie-item-list").innerHTML += '<li><div style="width: 10px; height: 10px; margin: 10px 5px 0 2px; display: inline-block; background: '+ pieData[key].color +';"></div> ' + pieData[key].title + ' <span class="pieItem"> ' + pieData[key].size + '</span>%</li>';

        base.beginPath();
        drawSlice(startAngle, startAngle + (pieData[key].size * 2 * Math.PI / 100), pieData[key].color, false);
        drawBorder();
        base.stroke();
        startAngle += (pieData[key].size * 2 * Math.PI / 100);
    }

    function drawSlice(startAngle, endAngle, color, val)
    {
        base.moveTo(centerX, centerY);
        base.arc(centerX, centerY, options.radius, startAngle, endAngle, val);
        base.lineTo(centerX, centerY);
        base.fillStyle = color;
    }
    /* Pie Chart slices */
    function drawBorder()
    {
        base.lineWidth = options.borderLineWidth;
        base.fill();
        base.strokeStyle = options.borderColor;
    }
}

function drawPyramid(selector, data, opt) {
	var options = Object.assign({ sort: { field: 'value', order: 'asc' }, offset: 0 }, opt);
	var canvas = document.querySelector(selector);
	var base = canvas.getContext('2d');

  var startPoint = { x: 0, y: canvas.height };

  data = formatData(data);

  var i = data.length;
  var remainingHeight = canvas.height,
  		remainingWidth  = canvas.width;
	while (i--) {
  	var height = data[i].value * canvas.height / 100;
		var widthToCut = remainingWidth * height / 2 / startPoint.y;

  	var points = {
		  bl: { x: startPoint.x, y: startPoint.y },
		  tl: { x: startPoint.x + widthToCut, y: startPoint.y - height },
		  tr: { x: startPoint.x + remainingWidth - widthToCut, y: startPoint.y - height },
		  br: { x: startPoint.x + remainingWidth, y: startPoint.y }
		};

		drawTrapezoid(points, data[i].color);
		startPoint.x = startPoint.x + widthToCut;
		startPoint.y = startPoint.y - height;
  	remainingWidth = remainingWidth - (2 * widthToCut);
  }

  function drawTrapezoid (points, color) {
		base.fillStyle = color;
		base.beginPath();
		base.moveTo(points.bl.x, points.bl.y);
		base.lineTo(points.tl.x, points.tl.y);
		base.lineTo(points.tr.x, points.tr.y);
		base.lineTo(points.br.x, points.br.y);
		base.closePath();
		base.fill();
  }

  function formatData (data) {
		var total = 0;
  	data = data.sort(function(a, b) {
  		if (options.sort.order !== 'desc') {
  			return a[options.sort.field] > b[options.sort.field];
  		} else {
  			return a[options.sort.field] < b[options.sort.field];
  		}
  	});

		data.filter(function (elem) {
			total += elem.value;
			return true;
		}).map(function (elem) {
			elem.value = elem.value * 100 / total;
			return elem;
		});
		return data;
  }
}
