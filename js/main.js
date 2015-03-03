// HELPERS
function parseData(d) {
  var keys = _.keys(d[0]);
  return _.map(d, function(d) {
    var o = {};
    _.each(keys, function(k) {
      if( k == 'Country' )
        o[k] = d[k];
      else
        o[k] = parseFloat(d[k]);
    });
    return o;
  });
}

function getBounds(d, paddingFactor) {
  // Find min and maxes (for the scales)
  paddingFactor = typeof paddingFactor !== 'undefined' ? paddingFactor : 1;

  var keys = _.keys(d[0]), b = {};
  _.each(keys, function(k) {
    b[k] = {};
    _.each(d, function(d) {
      if(isNaN(d[k]))
        return;
      if(b[k].min === undefined || d[k] < b[k].min)
        b[k].min = d[k];
      if(b[k].max === undefined || d[k] > b[k].max)
        b[k].max = d[k];
    });
    b[k].max > 0 ? b[k].max *= paddingFactor : b[k].max /= paddingFactor;
    b[k].min > 0 ? b[k].min /= paddingFactor : b[k].min *= paddingFactor;
  });
  return b;
}

function getCorrelation(xArray, yArray) {
  function sum(m, v) {return m + v;}
  function sumSquares(m, v) {return m + v * v;}
  function filterNaN(m, v, i) {isNaN(v) ? null : m.push(i); return m;}

  // clean the data (because we know that some values are missing)
  var xNaN = _.reduce(xArray, filterNaN , []);
  var yNaN = _.reduce(yArray, filterNaN , []);
  var include = _.intersection(xNaN, yNaN);
  var fX = _.map(include, function(d) {return xArray[d];});
  var fY = _.map(include, function(d) {return yArray[d];});

  var sumX = _.reduce(fX, sum, 0);
  var sumY = _.reduce(fY, sum, 0);
  var sumX2 = _.reduce(fX, sumSquares, 0);
  var sumY2 = _.reduce(fY, sumSquares, 0);
  var sumXY = _.reduce(fX, function(m, v, i) {return m + v * fY[i];}, 0);

  var n = fX.length;
  var ntor = ( ( sumXY ) - ( sumX * sumY / n) );
  var dtorX = sumX2 - ( sumX * sumX / n);
  var dtorY = sumY2 - ( sumY * sumY / n);
 
  var r = ntor / (Math.sqrt( dtorX * dtorY )); // Pearson ( http://www.stat.wmich.edu/s216/book/node122.html )
  var m = ntor / dtorX; // y = mx + b
  var b = ( sumY - m * sumX ) / n;

  // console.log(r, m, b);
  return {r: r, m: m, b: b};
}

var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

//Zipcode,Date,Avg2Bd,Avg2BdNorm,NormCrimes,NormThefts,NormAssaults,NormHomicides,Distance_from_center,CommuteTime,Population
//d3.csv('summary.csv', function(data) {
d3.csv('data/exporttableclusters.csv', function(data) {
//d3.csv('data/exporttable.csv', function(data) {


    var data = data.filter(function(row) {
        return row['Avg2Bd'] > 0 & row['Date'] > "2010-01-00 00:00:00"  & row['Date'] < "2014-06-00 00:00:00"
    }
    );

    data.forEach(function(d) {

            d.Avg2Bd = Math.log10(+d.Avg2Bd);
            d.Zipcode = d.Zipcode;
            d.Date = parseDate(d.Date);
            d.Month=d.Date.getMonth();
            d.Year=d.Date.getFullYear();
            d.Distance_from_Chicago_Loop =d.Distance_from_Chicago_Loop*0.000189394; //converting from feet to miles

        });


  var yAxis = 'Avg2Bd', xAxis = 'Total_Crimes';
  var xAxisOptions = ["Total_Crimes", "Thefts", "Assaults", "Homicides", "Commute_Time", "Distance_from_Chicago_Loop"]  // var yAxisOptions = 

  var descriptions = {
    "Total_Crimes" : "Crimes [per person, normalized by city total]",
    "Thefts" : "Thefts [per person, normalized by city total] ",
    "Assaults" : "Assaults [per person, normalized by city total]",
    "Homicides" : "Homicides [per person, normalized by city total]",
    "Commute_Time" : "Mean commute time [min]", 
    "Distance_from_Chicago_Loop" : "Distance from Chicago Loop [miles]"
    
    
    };

  var keys = _.keys(data[0]);
  var data = parseData(data);
  var bounds = getBounds(data, 1);

var width = 900;
var height = 500;





  // SVG AND D3 STUFF
//  var svg = d3.select("#chart")
  //  .append("svg")

  var svg = d3.select("#chart1")
    .attr("width", width)
    .attr("height", height).style('float', 'left');
  var xScale, yScale;

 svg.append('g')
    .classed('chart', true)
    .attr('transform', 'translate(80, -70)')

                   
var projection = d3.geo.mercator()
   .center([-87.68, 41.83])
   .scale(39000) // 64000
   .translate([width/1.12, height / 2.4])
                      

var path = d3.geo.path() .projection(projection);


queue().defer(d3.json, "json/Chicago_morecodes.json")
   .await(ready);


//d3.json("json/Chicago_small.json", function(error, us){
//d3.json("json/Chicago_morecodes.json", function(error, us){
    function ready(error, us) {

console.log(us)

g=d3.select("#chart")
    .append("g")
      .attr("class", "zips")
     

  zips=svg.selectAll("path")
      .data(topojson.feature(us, us.objects.zip_codes_for_the_usa).features)
      .enter().append("path")
      .attr("class", "zipareas2")

      .attr("id", function(d) {return "Zip" + d.properties.zip; })
      .attr("d", path)
       .attr('opacity',0.6)
        

      .style("fill",'white')
      .on("mouseover", function(d){
        d3.selectAll("#dot"+ d.properties.zip).attr('opacity',1)
                d3.select(this).attr('opacity',1)

        })
      .on("mouseout", function(d){
        d3.selectAll("#dot"+ d.properties.zip).attr('opacity',0.2)
                d3.select(this).attr('opacity',0.6)

        })
     

 d3.csv("data/clustermap.csv", function(error, datadummy) {



console.log('i am here ready to color the map')
   d3.transition()
			   .duration(0).selectAll(".zipareas2")
       //.style("opacity", function(d) {return (value-2010)/5})
       .style("fill",function(d){ 
       
       var temp = datadummy.filter(function(row){return row['Zipcode'] == d.properties.zip;})
       
       return pointColor(temp[0].Cluster )  })

       }
       )

    } // END OF FUNCTION JSON



  // Build menus
  d3.select('#menuchart')
    .selectAll('li')
    .data(xAxisOptions)
    .enter()
    .append('li')
    .attr('class', 'li2')
    .text(function(d) {return d;})
    .classed('selected', function(d) {
      return d === xAxis;
      
    })
    .on('click', function(d) {
        
      xAxis = d;
      updateChart();
      updateMenus();
    });


  // Country name
  d3.select('svg g.chart')
    .append('text')
    .attr({'id': 'countryLabel', 'x': 50, 'y': height-20})
    .style({'font-size': '20px', 'font-weight': 'bold', 'fill': '#ddd'});

  // Best fit line (to appear behind points)
  d3.select('svg g.chart')
    .append('line')
    .attr('id', 'bestfit');

  // Axis labels
  d3.select('svg g.chart')
    .append('text')
    .attr({'id': 'xLabel', 'x': 400, 'y': height*1.1, 'text-anchor': 'middle'})
    .text(descriptions[xAxis])
    .attr('fill', 'white')
    .style('font-size', '20px');

  d3.select('svg g.chart')
    .append('text')
    .attr('transform', 'translate(-60,' +height/1.8+')rotate(-90)')
    .attr({'id': 'yLabel', 'text-anchor': 'middle'})
    .text('Price of a 2 Bedroom Apartment [log, K$]')
    .attr('fill', 'white')
    .style('font-size', '20px');

  // Render points
  updateScales();
  
//pointColor=d3.scale.ordinal().domain(["60601", "60602", "60603", "60604"]).range(colorbrewer.GnBu[9]);
pointColor=d3.scale.ordinal().domain(["60601", "60602", "60603", "60604"]).range(['#018571','#FFF9C1','#3498DB','#FF6138']);



  d3.select('svg g.chart')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dotssecond')
    .attr('id', function(d){return 'dot'+d.Zipcode})

    .attr('cx', function(d) {
      return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xScale(d[xAxis]);
    })
    .attr('cy', function(d) {
      return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : yScale(d[yAxis]);
    })
   //.attr('fill', '#43a2ca')
//    .attr('fill', d.Zipcode)
    .attr("r", 6)
    .attr('fill', function(d,i) {return pointColor(d.Cluster)})
//    .style('stroke','black')
//    .style('stroke-width', 1)

    .attr('opacity', 0.2)
    .style('cursor', 'pointer')
    .on('mouseover', function(d) {
     
     d3.select("#Zip"+d.Zipcode).attr('opacity',1)
        
      d3.select('svg g.chart #countryLabel')
        .text('Zipcode ' +d.Zipcode + ', Period ' + d.Year + '-' + d.Month )
        .transition()
        .style('opacity', 1);
        
     
    })
    .on('mouseout', function(d) {
        
             d3.select("#Zip"+d.Zipcode).attr('opacity',0.6)
        

      d3.select('svg g.chart #countryLabel')
        .transition()
        .duration(200)
        .style('opacity', 0);
    });

  updateChart(true);
  updateMenus();

  // Render axes
  d3.select('svg g.chart')
    .append("g")
    .attr('transform', 'translate(0, '+height+')')
    .attr('id', 'xAxis')
    .call(makeXAxis);

  d3.select('svg g.chart')
    .append("g")
    .attr('id', 'yAxis')
    .attr('transform', 'translate(-10, 0)')
    .call(makeYAxis);


	legendvalues = [1,2,3,4]
	legendnotes = ['Cheap and crime free', 'Cheap, high crime', 'Intermediate', 'High prices, downtown']

	
	// text for legend/
	//	var legendtext= svg.selectAll("key").data(legendvalues).enter().append("svg:text") // text
//	        	.attr("x",width/2.5)
//			.attr("y",function(d,i){return 50+i*20})
//			.attr("font-size","15pt")
//			.style("fill",function(d,i){return pointColor(i)})

//	                .html(function(d,i){return "Cluster" + d + ': ' + legendnotes[i]})


   var legendtext = svg.append("svg:text") // text
	        .attr("x",width /2.5)
			.attr("y",50)
			.attr("font-size","12pt")
			.attr("fill",'white')
			.style("text-align", "right") 
			.append('svg:tspan').attr('x', width /2.5).attr('dy', 5).text("Cluster 1:" + legendnotes[0]).style("fill",function(d){return pointColor(0)})
            .append('svg:tspan').attr('x', width /2.5).attr('dy', 25).text("Cluster 2:" + legendnotes[1]).style("fill",function(d){return pointColor(1)})
            .append('svg:tspan').attr('x', width /2.5).attr('dy', 25).text("Cluster 3:" + legendnotes[2]).style("fill",function(d){return pointColor(2)})
            .append('svg:tspan').attr('x', width /2.5).attr('dy', 25).text("Cluster 4:" + legendnotes[3]).style("fill",function(d){return pointColor(3)})






  //// RENDERING FUNCTIONS
  function updateChart(init) {
    updateScales();

    d3.select('svg g.chart')
      .selectAll('circle')
      .transition()
      .duration(500)
      .ease('quad-out')
      .attr('cx', function(d) {
        return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xScale(d[xAxis]);
      })
      .attr('cy', function(d) {
        return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : yScale(d[yAxis]);
      });
//      .attr('r', function(d) {
  //      return isNaN(d[xAxis]) || isNaN(d[yAxis]) ? 0 : 12;
    //  });

    // Also update the axes
    d3.select('#xAxis')
      .transition()
      .call(makeXAxis);

    d3.select('#yAxis')
      .transition()
      .call(makeYAxis);

    // Update axis labels
    d3.select('#xLabel')
      .text(descriptions[xAxis]);

    // Update correlation
    var xArray = _.map(data, function(d) {return d[xAxis];});
    var yArray = _.map(data, function(d) {return d[yAxis];});
    var c = getCorrelation(xArray, yArray);
    var x1 = xScale.domain()[0], y1 = c.m * x1 + c.b;
    var x2 = xScale.domain()[1], y2 = c.m * x2 + c.b;

    // Fade in
    d3.select('#bestfit')
      .style('opacity', 0)
      .attr({'x1': xScale(x1), 'y1': yScale(y1), 'x2': xScale(x2), 'y2': yScale(y2)})
      .transition()
      .duration(1500)
      .style('opacity', 1);
  }

  function updateScales() {
    xScale = d3.scale.linear()
                    .domain([bounds[xAxis].min, bounds[xAxis].max])
                    .range([20, width * 0.7]);

    yScale = d3.scale.linear()
        //            .domain([bounds[yAxis].min, bounds[yAxis].max])
                     .domain([4.2, bounds[yAxis].max])
        
                    .range([height, 120]);    
  }

  function makeXAxis(s) {
    s.call(d3.svg.axis()
      .scale(xScale)
      .orient("bottom"));
  }

  function makeYAxis(s) {
    s.call(d3.svg.axis()
      .scale(yScale)
      .orient("left"));
  }

  function updateMenus() {
    d3.select('#x-axis-menu')
      .selectAll('li')
      .classed('selected', function(d) {
        return d === xAxis;
      })
      ;
    d3.select('#y-axis-menu')
      .selectAll('li')
      .classed('selected', function(d) {
        return d === yAxis;
    });
  }

})





