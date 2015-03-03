var valueyear=2014

var width = 960,
height = 700;
   var colors = d3.scale.quantize()
    .range(colorbrewer.GnBu[9]);

d3.selectAll('#checktext').attr("x",500)



function colorzips(value){
 d3.csv("data/export.csv", function(error, datadummy) {



    datadummy.forEach(function(d) {
    // console.log(d.date)
     //   d.date = parseDate(d.date);
     //console.log(d.date)
        d.close = +d.close;
;
    });
  var newdate = value+"-08-31 00:00:00"
  var datadummy = datadummy.filter(function(row) {
        return row['date'] == newdate & row['zipcode'] != "AllCodes";})

    
       d3.transition()
			   .duration(500).selectAll(".zipareas")
       //.style("opacity", function(d) {return (value-2010)/5})
       .style("fill",function(d){ 
       
       var temp = datadummy.filter(function(row){return row['Zipcode'] == d.properties.zip;})
       
       
       return colors(temp[0].close/500000  )  })

       }
       )
}
var checkboxvalue = document.getElementById('checkcrime').checked;





   
var projection = d3.geo.conicEqualArea()
                       .scale([1500])
                       .translate([480,250])
                       .rotate([96])
                       .center([-0.6, 38.7])
                       .parallels([29.5,45.5])
                      .translate([-7.*width, height*4.3])
                      .scale([60000])
                      .translate([-10.5*width, height*6.4*900/700])
                      .scale([90000])
                      

var path = d3.geo.path() .projection(projection);
 
 
//d3.json("us-10m.json", function(error, us) {
  //svg.insert("path")
    //  .datum(topojson.feature(us, us.objects.land))
     // .attr("d", path)
      //.attr("stroke",'white');

//}) 



d3.json("json/osm_primary.json", function(error, pr) {
  svg.insert("path")
      .datum(topojson.feature(pr, pr.objects.osm_primary))
      .attr("d", path)
      .style("stroke-width", 1)

}) 

d3.json("json/osm_coastline.json", function(error, pr) {
  svg.insert("path")
      .datum(topojson.feature(pr, pr.objects.osm_coastline))
      .attr("d", path)
      .style("stroke-width", 1.5)


}) 



//    var path = d3.geo.path();


var svg = d3.select("#bigcontainer").append("svg").attr("id", 'containerd3')
    .attr("width", width)
    .attr("height", height)
    .style("background",null);


	// DRAW LEGEND
	
	var legend=svg.insert("g")
	var nnn=16, shift=2; var suffix='min'
	var heightlegend =80
	var sizey = heightlegend/(nnn)
	var ytext = sizey/(4-1)*0.95
	var position_legend_color_x = 30
	var position_legend_color_y = height-250
	var rangecols=d3.range(0,1.,1./nnn)
	
	// make continuous bar
	keys = legend.selectAll("key").data(rangecols).enter().append("svg:rect").attr("x",position_legend_color_x)
			.attr("y",function(d,i){return position_legend_color_y+heightlegend-sizey-i*sizey})
			.attr("height","25")
			.attr("width","25")
	        .attr("fill", function(d,i){return colors(rangecols[i])})
	
	
	legendvalues = [0,125,250,500,750]
	nlegend=5

	
	// text for legend
	var legendtext= legend.selectAll("key").data(legendvalues).enter().append("svg:text") // text
	        	.attr("x",position_legend_color_x+28)
			.attr("y",function(d,i){return position_legend_color_y+heightlegend-(i-1)*heightlegend/(nlegend-1)})
			.attr("font-size","15pt")
			.attr("fill",'white')

	                .html(function(d){return d + "K"})
	


// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);




queue().defer(d3.json, "json/Chicago_small.json")
    .await(ready);

    drawline("AllCodes")

    

	svg.append("svg:text").attr("id","legendtext").attr("x",450).attr("y",70).text("CHICAGO").attr("font-size","30pt").style("fill",colors(0.1));


    function ready(error, us) {
        
    g=svg.append("g")
      .attr("class", "zips")
     
     
    d3.select('#slider6').call(slider=d3.slider().axis(true).value(2014).min(2009).max(2014).orientation("horizontal"));


  zips=g.selectAll("path")
      .data(topojson.feature(us, us.objects.zip_codes_for_the_usa).features)
      .enter().append("path")
      .attr("class", "zipareas")
      .attr("data-zip", function(d) {return d.properties.zip; })
      .attr("d", path)
      .style("fill",function(d){colors(0)});

       colorzips("2014")

// this variable controls click - no click
var click = false

zips.on("click",function(d){
  click = !click  
  
   if (click == false){
         d3.selectAll(".zipareas_hl").attr("class","zipareas");   
         }

})

       zips.on("mouseover", function(d){
            
            if (click == false){
            var input = d.properties.zip
            d3.selectAll('.line').remove() ;
            d3.selectAll('.xaxis').remove() ;
            d3.selectAll('.yaxis').remove() ;
            d3.selectAll('#label1').remove() ;
            d3.selectAll('#label2').remove() ;

            drawline(input);


         d3.select(this).attr("class","zipareas_hl");   

         d3.select('#legendtext').text(d.properties.zip);   
            }
         
    // OFFSETS FOR TOOLTIP   //
	var offsetL = document.getElementById('containerd3').offsetLeft+200;
	var offsetT = document.getElementById('containerd3').offsetTop+100;

	var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );


	tooltip.transition()
	   .duration(200)
	   .attr("r",6)
	   .style("opacity", 1)
	    tooltip.html("HERE I WILL <br> WRITE SOME <br> STUFF <br>"+ d.properties.zip +"")
		  		  
	   .style("left", (d3.event.pageX + 100) + "px")
	   .style("top", (d3.event.pageY - 40) + "px");


					         }



        
            )
             

        zips.on("mouseout", function(d){
//                        drawline('AllCodes')

//          path1.style("display", 'none')
//            path2.style("display", 'none')

            if (click == false){
         d3.select(this).attr("class","zipareas");   
            }

    tooltip.transition()
	   .duration(200).style("opacity",0);

         if (click == False) {d3.select('#legendtext').text("CHICAGO"); }  
        }
            ) 
    
  
  
slider.on("slide", function(evt, value) {

colorzips(value)
drawcrimes(value,'slider')
        
} 
)

      



    } // END OF FUNCTION READY

  


// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 150},
    width = 800 - margin.left*2 - margin.right,
    height = 270 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse,
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function(d) { return "$" + formatValue(d); };

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);





var    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(d);}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).tickFormat(function(d){return yScale.tickFormat(4,d3.format(",d"))(d)}).orient("left");




var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

//var yAxis = d3.svg.axis().scale(yScale)
  //  .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return yMap(d.close); });
    
// Adds the svg canvas
var svg2 = svg
    .append("svg")
        .attr("width", width + 2*margin.left + 2*margin.right)
        .attr("height", height + 2*margin.top + 2*margin.bottom)
        .attr("x", 350)
        .attr("y", 100)

    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");



function drawline(input){
    input_str=input
 
// Get the data
d3.csv("data/export.csv", function(error, data) {


    var data2 = data.filter(function(row) {
        return row['Zipcode'] == "AllCodes" ;
   
    }
    );
    
    var data1 = data.filter(function(row) {
        return row['Zipcode'] == input;
   
    }
    );
        
    
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
;
    });



    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.close; })]);
    
    maxvalue=d3.max([d3.max(data1, function(d) { return d.close; }),d3.max(data2, function(d) { return d.close; }) ] ) + 50000
    minvalue=d3.min([d3.min(data1, function(d) { return d.close; }),d3.min(data2, function(d) { return d.close; }) ] ) - 50000

    yScale.domain([minvalue,maxvalue]);
    
     // Define the axes


    // Add the valueline path.
    path1=svg2.append("path")
        .attr("class", "line")
        .style("stroke", colors(0.4))
        .attr("d", valueline(data1));

    path2=svg2.append("path")
        .attr("class", "line")
        .attr("d", valueline(data2))
       
    
    path2.style("stroke", "white");
    
      
    svg2.append("text").attr("id","label1").attr("class","labelchart2")
         .data(data1)
         .attr("transform", function(d) {outy= 20+yScale(d.close); return "translate(" +x(d.date)  + "," + outy + ")"; })
         .attr("x", 15)
         .attr("fill", colors(0.4))
         .attr("dy", "1.35em")
         .text(function(d){if (input_str !="AllCodes") {return input_str} });

    svg2.append("text").attr("id","label2").attr("class","labelchart2")
         .data(data2)
         .attr("transform", function(d) {outy= yScale(d.close)-30; return "translate(" +x(d.date)  + "," + outy+ ")"; })
         .attr("x", 15)
         .attr("fill", 'white')
         .attr("dy", "1.35em")
         .text("Chicago");
    
    svg2.on("mouseover", function(d,i){
    
    
      var focus = svg2.append("g")
      .attr("class", "focus")
       .style("display", "none");

      var focus2 = svg2.append("g")
      .attr("class", "focus")
      .style("display", "none");

      focus.append("circle")
          .attr("r", 10)
          .style("stroke",colors(0.4));

      focus2.append("circle")
          .attr("r", 10)
          .style("stroke","white");
    

    
      focus.append("text")
          .attr("x", 9)
                   .attr("fill", 'white')

          .attr("dy", ".35em");

      focus2.append("text")
          .attr("x", 9)
                   .attr("fill", 'white')

          .attr("dy", ".35em");

    
      var rectt=svg2.append("rect")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function() { focus.style("display", null); focus2.style("display", null);})
          .on("mouseout", function() { focus.style("display", "none"); focus2.style("display", "none");})
          .on("mousemove", mousemove);
    
  
    
      function mousemove() {

        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data1, x0, 1),
            d0 = data1[i - 1],
            d1 = data1[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
       //  console.log(d.date, d.close)
        focus.attr("transform", "translate(" + x(d.date) + "," + yScale(d.close) + ")");
        focus.select("text").text(formatCurrency(d.close));
     
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data2, x0, 1),
            d0 = data2[i - 1],
            d1 = data2[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
         //console.log(d.date, d.close)

        focus2.attr("transform", "translate(" + x(d.date) + "," + yScale(d.close) + ")");
        focus2.select("text").text(formatCurrency(d.close));


      }
    });


d3.csv("data/exportcrime.csv", function(error, cdata) {

                // this is how i will select data
                cdata = cdata.filter(function(row) {
                return row['Primary Type'] == 'HOMICIDE';
                        })
          
                var aggregated = d3.nest()
                 .key(function(d) { return (new Date(+d.x * 1000)).getMonth(); })
                 .rollup(function(d) {return d.length})
                 .entries(cdata)
                 .map(function(d) { return {x: +d.key, y: d.values}; });

         
                console.log('here')
                console.log(aggregated)
         
              })   

        
        
   


    // Add the X Axis
    svg2.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg2.append("g")
        .attr("class", "yaxis")
        .call(yAxis);
        
        
        

});
};


function drawcrimes(date,change){
    
        console.log('start', checkboxvalue,change, date, valueyear)

        valueyear=date

    if (change == 'check')
        {console.log('change checkbox!'); checkboxvalue = !checkboxvalue}
    
        console.log('after', checkboxvalue,change, date, valueyear)

   if  (checkboxvalue == false) {

    d3.selectAll('.dots').remove()
   }
    
 

   if  (checkboxvalue == true) {
               console.log('checkboxtrue', checkboxvalue, date, valueyear)
 
                d3.selectAll('.dots').remove()

                d3.csv("data/exportcrime.csv", function(error, cdata) {

                // this is how i will select data
                cdata = cdata.filter(function(row) {
                return row['Primary Type'] == 'HOMICIDE' & row['Date'] > date+"-01-31 00:00:00" & row['Date'] <date+"-12-31 00:00:00";
                        })
          
                svg.append("g").attr("class", "dots").selectAll("circle")
                   .data(cdata)
                   .enter()
                   .append("circle")
                   .attr("class", "dots")
                   .attr("cx", function(d) {
                           return projection([d.lon, d.lat])[0];
                   })
                   .attr("cy", function(d) {
                           return projection([d.lon, d.lat])[1];
                   })
                   .attr("r", 3)
                   .style("opacity", 0.7)

                   .style("fill", "#F05B05")
                   .style("display",null)
         
         
              })   


   } 



}
