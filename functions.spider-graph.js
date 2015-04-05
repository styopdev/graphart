function drawHexagon(context, points, offset)
{
	var config = {};
	var startPointOffset = endPointOffset = {'x':0, 'y':0};
	
	for ( var i = 0; i < points.length; i++ ) {
	
		/* if offset not 0, drawing hexagon is inner */
		if ( offset != 0 ) {
			startPointOffset = getPointOffset(i, offset);
			endPointOffset   = getPointOffset(i + 1, offset);
		}

		if ( i != points.length - 1 ) {				
			context.beginPath();
			context.moveTo(points[i].x + startPointOffset.x, points[i].y + startPointOffset.y);
			context.lineTo(points[i + 1].x + endPointOffset.x, points[i + 1].y + endPointOffset.y );
			context.stroke();
		 	if ( offset == 0 ) {
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
			config.color  = 'red';
		//	drawArc(context, points, config);
		} else {
			/* Hexagon last point case*/
			context.beginPath(); 
			context.moveTo(points[points.length - 1].x + startPointOffset.x, points[points.length - 1].y + startPointOffset.y);
			context.lineTo(points[0].x + endPointOffset.x, points[0].y + endPointOffset.y);
			context.stroke();

			if ( offset == 0 ) {
				context.beginPath();
		  		context.font = "20px Tahoma";
		  		context.fillText(points[i].alias, points[i].x - 20, points[i].y + startPointOffset.y);	
		  		context.stroke();
		  	}

			config.startX = points[0].x + endPointOffset.x;
			config.startY = points[0].y + endPointOffset.y;
			config.radius = 1;
			config.color  = 'red';
			//drawArc(context, points, config);
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

function drawCrossLinesNetwork(context, points)
{
	for ( var j = 0; j < points.length / 2; j++ ) {
		context.lineWidth = 1;
		context.moveTo(points[j].x, points[j].y);
		context.lineTo(points[j + 3].x, points[j + 3].y);
		context.stroke();
	}
}

function drawStatistic(context, points, statistic, graphSize)
{
	var offsetPixel, offsetPercent, eventAlias, pointOffset, config = {}, statisticPointCoordinatesList = [];
	for ( var i = 0; i < statistic.length; i++ ) {
			statisticPointCoordinatesList = [];
		for ( var j = 1; j < statistic[i].length; j++ ) {
			offsetPercent = (graphSize.value - statistic[i][j].value) / graphSize.value * 100;
			offsetPixel   = graphSize.pixel / 100 * offsetPercent;
			for ( key in points ) {
				if ( points[key].alias == statistic[i][j].type ) {
					pointOffset = getStatisticsPointOffset(key, offsetPixel);
					config.radius = 5;
					config.color  = statistic[i][0].color;
					config.startX = parseInt(points[key].x) + parseInt(pointOffset.x);
					config.startY = parseInt(points[key].y)   + parseInt(pointOffset.y);
					statisticPointCoordinatesList.push({'x' : config.startX, 'y' : config.startY, 'color':config.color, 'name' : config.name}); 
					drawArc(context, config);
				}
			}
		}
		joinPoints(context, statisticPointCoordinatesList);
		//break;
	}
}
function joinPoints(context, statisticPointCoordinatesList)
{
	for ( key in statisticPointCoordinatesList ) {
		if ( key == statisticPointCoordinatesList.length - 1 )
			break;
			context.beginPath();
			context.lineWidth = 2;
			context.strokeStyle = statisticPointCoordinatesList[key].color;
			context.moveTo(statisticPointCoordinatesList[key].x, statisticPointCoordinatesList[key].y);
			context.lineTo(statisticPointCoordinatesList[parseInt(key) + 1].x, statisticPointCoordinatesList[parseInt(key) + 1].y);
			context.stroke();
	}
	context.moveTo(statisticPointCoordinatesList[0].x, statisticPointCoordinatesList[0].y);
	context.lineTo(statisticPointCoordinatesList[statisticPointCoordinatesList.length - 1].x, statisticPointCoordinatesList[statisticPointCoordinatesList.length - 1].y);
	context.stroke();

}

function drawLineNames(context, statisticList)
{
	var config = {};
	config.radius 	 = 5;
	for ( key in statisticList ) {
		context.beginPath();
		context.lineWidth = 3;
		context.strokeStyle = statisticList[key][0].color;
		
		config.color  = context.strokeStyle;
		config.startX = 30	;
		config.startY = 10 + parseInt(key) * 20;
		
		context.moveTo(10, 10 + parseInt(key) * 20);
		context.lineTo(50 , 10 + parseInt(key) * 20);
		context.stroke();
		drawArc(context, config);
		
		context.beginPath();
		context.fillStyle = "#9BA3AF";
	  	context.font = "12px Tahoma";
	  	context.fillText(statisticList[key][0].name.toUpperCase(), 55, 15 + parseInt(key) * 20);
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

	if ( aliasIndex % 3 == 0 ) {
		xOffset = -offset;
		yOffset = -2 * offset;
	} else {
		yOffset = Math.floor(offset / 2);
		/* Pythagoras theorem */
		xOffset = Math.floor(Math.sqrt( Math.pow(offset, 2) - Math.pow(yOffset, 2) )) + 8;
		xOffset += 4;
		yOffset += 1;
	}
	/* find offset direction */
	switch ( aliasIndex ) {
		case 3 :
			yOffset = -3 * yOffset;
			break;
		case 4 :
			yOffset =  1 * yOffset;
			xOffset = -5 * offset
			break;
	}
	return {'x':xOffset, 'y':yOffset};
}