#### Dont use library in production.
Graphart is HTML5/JavaScript charting library based on the Canvas, which allows you to 
create rich charts that are completely responsive and work in all browsers.
Nowadays, data visualization and analysis is now an key factor of business processes. That makes it all the more important to choose the right kind of JavaScript Charting library that best matches your needs.

## Benefits:

	-  Modern flat design
	-  High performance
	-  Easy to integrate
	-  Analytical experience

#### Spider graph:
###### Demo:
![Graph Chart](http://content.screencast.com/users/johannesMt/folders/Jing/media/5c4c1fb5-cad9-4aaf-b23b-c4968b783fc7/2015-06-29_1313.png)
###### Usage:
``` 
    $(function() {
    	var stat  = [
    		[{'name':'2011', 'color' : '#03C9A9'},
    			{'type':'Java', 'value':50000},
    			{'type':'JS',   'value':55000},
    			{'type':'C',  'value':40000},
    			{'type':'Objc', 'value':60000},
    			{'type':'C#',   'value':63000},
    			{'type':'PHP',  'value':65000},
    		  	
    		], 
    		[{'name':'2012', 'color' : '#F64747'},
    			{'type':'Java', 'value':45000},
    			{'type':'JS',   'value':68000},
    			{'type':'C',  'value':43000},
    			{'type':'Objc', 'value':40000},
    			{'type':'C#',   'value':50000},
    			{'type':'PHP',  'value':37000},
    		], 
    		[{'name':'2013', 'color' : '#19B5FE'},
    			{'type':'Java', 'value':24000},
    			{'type':'JS',   'value':77000},
    			{'type':'C',  'value':29000},
    			{'type':'Objc', 'value':20000},
    			{'type':'C#',   'value':48000},
    			{'type':'PHP',  'value':21000},
      		],
      		[{'name':'2014', 'color' : '#6C7A89'},
    			{'type':'Java', 'value':65000},
    			{'type':'JS',   'value':70000},
    			{'type':'C',  'value':55000},
    			{'type':'Objc', 'value':60000},
    			{'type':'C#',   'value':37000},
    			{'type':'PHP',  'value':55000},
      		]
      	];
        
    	var options = {
    		strokeStyle : '#E9E9E9',
    		shadowColor : '#2ECC71',
    		offset : 0,
    		delimeterCount : 2,
    		lineWidth : 1
    	};
    
    	drawSpiderGraph("#mycanvas", stat, options);
    });
```

#### Linear graph:
###### Demo: 
![Line Graph](http://content.screencast.com/users/johannesMt/folders/Jing/media/b9480293-6e1d-442b-88ff-4c215b0ea3fa/2015-06-29_1319.png)
![Line Graph](http://content.screencast.com/users/johannesMt/folders/Jing/media/ce454fd4-e195-4862-83c8-9e442896b0f8/2015-06-29_1317.png)
###### Usage:
```
var data = { values:[
                { X: "January", Y: 8 },
                { X: "February", Y: 2 },
                { X: "March", Y: 4 },
                { X: "April", Y: 3 },
                { X: "May", Y: 13},
                { X: "June", Y: 15 },
                { X: "July", Y: 21 },
                { X: "August", Y: 19 },
                { X: "September", Y: 25 },
                { X: "October", Y: 15 },
                { X: "November", Y: 18 },
                { X: "December", Y: 2 }
            ]};
            var previousData = { values:[
                { X: "January", Y: 4 },
                { X: "February", Y: 9 },
                { X: "March", Y: 6 },
                { X: "April", Y: 1 },
                { X: "May", Y: 8},
                { X: "June", Y: 6.8 },
                { X: "July", Y: 12 },
                { X: "August", Y: 14 },
                { X: "September", Y: 22 },
                { X: "October", Y: 17 },
                { X: "November", Y: 11 },
                { X: "December", Y: 9 }
            ]};

            var options = {
                xPadding : 30,
                yPadding : 30,
				lineWidth : 2,
				currCircleColor : '#2A4269',
				prevCircleColor :  'rgba(101, 181, 178, 0.5)',
				currColor : '#2A4269',
				prevColor : 'rgba(101, 181, 178, 0.8)'			
            }

            $(function() {
                drawLinearGraph("#linear-graph", data, previousData, options)
            });
```

#### Pie chart:
###### Demo:
![Pie Chart](http://content.screencast.com/users/johannesMt/folders/Jing/media/f8de6e27-0362-4699-9796-a2b9e41c2e2e/2015-06-29_1322.png)
![Pie Chart](http://content.screencast.com/users/johannesMt/folders/Jing/media/b7a9189a-dbea-4a0b-a518-3518d556cb09/2015-06-30_1540.png)
###### Usage:
```
    var pieData =[
        {"size" : 42, "title" : "Russia", "color": "#FF0000"},
        {"size" : 21, "title" : "Canada", "color": "#FF9934"},                
        {"size" : 19, "title" : "United States", "color": "#F778A1"},
        {"size" : 18, "title" : "China", "color": "#CC0001"}
    ];

    var options = {
        radius          : 100,
        fillStyle       : '#CCDCCD',
        borderColor     : '#C6DBEF',
        borderLineWidth : 1
    }

    drawPieChart(pieData, options);
    
```
#### Circle graphs:
###### Demo:
![Circle Graph](http://content.screencast.com/users/johannesMt/folders/Jing/media/c60dd1c8-b1bd-471e-b296-4a96ac5a46bb/2015-06-29_1327.png)
![Circle Graph](http://content.screencast.com/users/johannesMt/folders/Jing/media/b5a9bf3b-e9c2-42f0-9593-1495bb04daaa/2015-06-29_1330.png)
###### Usage:
```
	$(function() {
		var max   = 1000; 
		var stat  = 750;
		var options = {
			radius : 90,
			innerLineWidth : 24,
			outerLineWidth : 22,
			innerFillColor : "#FFFFFF",
			outerFillColor : "#2ECC71",
			textColor	   : "#FFFFFF",
			shadowColor	   : "#34495E"
		}

		drawCircleGraph("#circle-graph", stat, max, options);
	});
```

