    jsPlumb.ready(function() {
        jsPlumb.connect({
              paintStyle:{lineWidth:15,strokeStyle:'rgb(243,230,18)'},

            source:"item_trulia",
            target:"item_data",
                anchor: ["Left", "Right"],
                connector: ["Flowchart"],
                    endpoint:["Dot", {radius:0.2}], 

            overlays:[ 
                    ["Arrow" , { width:12, length:12, location:0.67 }]
                    
                ]

        });


        jsPlumb.connect({
            source:"item_Chicago",
            target:"item_geocode",
                anchor: ["Right", "Left"],
                    endpoint:["Dot", {radius:0.2}], 
        connector: ["Flowchart"],

            overlays:[ 
                    ["Arrow" , { width:12, length:12, location:0.67 }]
                    
                ]

        });



        jsPlumb.connect({
            source:"item_geocode",
            target:"item_data",
                anchor: ["Top", "Bottom"],
                    endpoint:["Dot", {radius:0.2}], 
        connector: ["Flowchart"],

            overlays:[ 
                    ["Arrow" , { width:12, length:12, location:0.67 }]
                    
                ]

        });



        jsPlumb.connect({
            source:"item_data",
            target:"item_k-means",
                anchor: ["Bottom", "Top"],
                    endpoint:["Dot", {radius:0.2}], 
        connector: ["Flowchart"],

            overlays:[ 
                    ["Arrow" , { width:12, length:12, location:0.67 }]
                    
                ]

        });

     jsPlumb.connect({
            source:"item_data",
            target:"item_regression",
                anchor: ["Right", "Left"],
                    endpoint:["Dot", {radius:0.2}], 
        connector: ["Flowchart"],

            overlays:[ 
                    ["Arrow" , { width:12, length:12, location:0.67 }]
                    
                ]

        });

   
        jsPlumb.connect({
            source:"item_regression",
            target:"item_regression2",
                anchor: ["Right", "Left"],
                    endpoint:["Dot", {radius:0.2}], 
        connector: ["Flowchart"],

            overlays:[ 
                    ["Arrow" , { width:12, length:12, location:0.67 }]
                    
                ]

        });


        jsPlumb.connect({
            
            source:"item_k-means",
            target:"item_k-means2",
                anchor: ["Right", "Left"],
                    endpoint:["Dot", {radius:0.2}], 
        connector: ["Flowchart"],

            overlays:[ 
                    ["Arrow" , { width:12, length:12, location:0.67 }]
                    
                ]

        });


        jsPlumb.connect({
            
            source:"item_k-means2",
            target:"item_visualize",
                anchor: ["Top", "Bottom"],
                    endpoint:["Dot", {radius:0.2}], 
        connector: ["Flowchart"],

            overlays:[ 
                    ["Arrow" , { width:12, length:12, location:0.67 }]
                    
                ]

        });


        jsPlumb.connect({
            
            source:"item_regression2",
            target:"item_visualize",
                anchor: ["Bottom", "Top"],
                    endpoint:["Dot", {radius:0.2}], 
        connector: ["Flowchart"],

            overlays:[ 
                    ["Arrow" , { width:12, length:12, location:0.67 }]
                    
                ]

        });



    });


