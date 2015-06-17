function drawSpiderGraph(selector, stat, options)
{
	var spiderGraph  = $(selector);
	var context 	 = spiderGraph[0].getContext("2d");
	
	var canvasWidth  = $("canvas").width();
	var canvasHeight = $("canvas").height();
	
	var xPadding   	 = canvasWidth / 10;
	var yPadding   	 = canvasHeight / 10;
	
	var graphSize 	 = {'value':75000, 'pixel':(canvasHeight - 2 * yPadding) / 2};
	var points 		 = 
				[
					{'alias' : 'Java', 'x' : canvasWidth / 2, 'y' : yPadding},
					{'alias' : 'JS',   'x' : canvasWidth - xPadding, 'y' : yPadding + (canvasHeight - 2 * yPadding) / 4},
					{'alias' : 'C',  'x' : canvasWidth - xPadding, 'y' : 3 * (canvasHeight - 2 * yPadding) / 4 + yPadding},
					{'alias' : 'Objc', 'x' : canvasWidth / 2, 'y' : canvasHeight - yPadding},
					{'alias' : 'C#',   'x' : xPadding, 'y' : 3 * (canvasHeight - 2 * yPadding) / 4 + yPadding},
					{'alias' : 'PHP',  'x' : xPadding, 'y' : yPadding + (canvasHeight - 2 * yPadding) / 4}
				];

	
	drawCrossLinesNetwork(context, points, options);
	drawHexagon(context, points, options);
	for ( var i = 0; i <= options.delimeterCount; i++) {
		drawHexagon(context, points, options);
		if ( i == 1)
			options.offset += 60;
		else 
			options.offset += 50;
	}
	drawLineNames(context, stat);
	drawStatistic(context, points, stat, graphSize);
}

function drawCrossLinesNetwork(context, points, options)
{
	for ( var j = 0; j < points.length / 2; j++ ) {
		context.lineWidth = options.lineWidth;
		context.moveTo(points[j].x, points[j].y);
		context.lineTo(points[j + 3].x, points[j + 3].y);
		context.strokeStyle = options.strokeStyle;
		context.stroke();
	}
}

function drawHexagon(context, points, options)
{
	var config = {};
	var startPointOffset = endPointOffset = {'x' : 0, 'y' : 0};
	
	for ( var i = 0; i < points.length; i++ ) {
	
		/* if offset not 0, drawing hexagon is inner */
		if ( options.offset != 0 ) {
			startPointOffset = getPointOffset(i, options.offset);
			endPointOffset   = getPointOffset(i + 1, options.offset);
		}

		if ( i != points.length - 1 ) {				
			context.beginPath();
			context.moveTo(points[i].x + startPointOffset.x, points[i].y + startPointOffset.y);
			context.lineTo(points[i + 1].x + endPointOffset.x, points[i + 1].y + endPointOffset.y );
			context.strokeStyle = options.strokeStyle;
			context.stroke();
		 	if ( options.offset == 0 ) {
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

			if ( options.offset == 0 ) {
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

/* Used for statristics points */
function getStatisticsPointOffset( i, offset )
{
	var xOffset, yOffset;
	if ( i % 3 == 0 ) {
		xOffset = 0;
		yOffset = offset;
	} else {
		yOffset = Math.floor(offset / 2);
		/* Pythagoras theorem */
		xOffset = Math.ceil(Math.sqrt( Math.pow(offset, 2) - Math.pow(yOffset, 2) )) + 8;
		//xOffset += 4;
		//yOffset += 1;
	}
	/* find offset direction */
	switch ( i ) {
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
	return {'x':xOffset, 'y':yOffset};
}
/* Used for frame hexagons points*/
function getPointOffset( i, offset )
{
	var xOffset, yOffset;
	if ( i % 3 == 0 ) {
		xOffset = 0;
		yOffset = offset;
	} else {
		yOffset = Math.floor(offset / 2);
		/* Pythagoras theorem */
		xOffset = Math.ceil(Math.sqrt( Math.pow(offset, 2) - Math.pow(yOffset, 2) )) + 8;
		xOffset += 4;
		yOffset += 1;
	}
	/* find offset direction */
	switch ( i ) {
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
	return {'x':xOffset, 'y':yOffset};
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
	for ( var i = 0; i < stat.length; i++ ) {
			statPointCoordinatesList = [];
		for ( var j = 1; j < stat[i].length; j++ ) {
			offsetPercent = (graphSize.value - stat[i][j].value) / graphSize.value * 100;
			offsetPixel   = graphSize.pixel / 100 * offsetPercent;
			for ( key in points ) {
				if ( points[key].alias == stat[i][j].type ) {
					pointOffset = getStatisticsPointOffset(key, offsetPixel);
					config.radius = 5;
					config.color  = stat[i][0].color;
					config.startX = parseInt(points[key].x) + parseInt(pointOffset.x);
					config.startY = parseInt(points[key].y)   + parseInt(pointOffset.y);
					statPointCoordinatesList.push({'x' : config.startX, 'y' : config.startY, 'color':config.color, 'name' : config.name}); 
					drawArc(context, config);
				}
			}
		}
		joinPoints(context, statPointCoordinatesList);
	}
}

function joinPoints(context, statPointCoordinatesList)
{
	for ( key in statPointCoordinatesList ) {
		if ( key == statPointCoordinatesList.length - 1 )
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
	config.radius 	 = 5;
	for ( key in statList ) {
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
	for ( key in points ) {
		if ( points[key].alias == alias ) {
			aliasIndex = parseInt(key);
			break;
		}
	}
	// if ( aliasIndex % 3 == 0 ) {
	// 	xOffset = -offset;
	// 	yOffset = -2 * offset;
	// } else {
	// 	yOffset = Math.floor(offset / 2);
	// 	/* Pythagoras theorem */
	// 	xOffset = Math.floor(Math.sqrt( Math.pow(offset, 2) - Math.pow(yOffset, 2) ));
	// }
	// /* find offset direction */
	// switch ( aliasIndex ) {
	// 	case 3 :
	// 		yOffset = -3 * yOffset;
	// 		break;
	// 	case 4 :
	// 		yOffset =  1 * yOffset;
	// 		xOffset = -6 * offset
	// 		break;
	// }

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
	return {'x':xOffset, 'y':yOffset};
}