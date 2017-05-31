var add_tab;
var newItemConfig;

add_tab = function(id,myLayout){
    newItemConfig = {
        title:id,
        type:'component',
        componentName:'Map',
        componentState:{text:'You did it! Well ID is: ' + id,
                        myId:id,
                        },
    };
//    myLayout.root.contentItems[0].select();
    $('#inner-app-content').find('.lm_header')[0].click()
    myLayout.selectedItem.addChild(newItemConfig);

//    myLayout.init();

    $('<canvas>').attr({
        id:'plot'+id,
        class:'myPlot'
    }).appendTo('#'+id);

    create_plot(id);
};


create_plot = function(id){

    var obs_chart_data = [];
    var time = [];
    var data = [];

    for(line in obs_data){
        if (obs_data[line][0] === id){
            obs_chart_data.push({x:obs_data[line][1],y:Number(obs_data[line][2])});
//        time.push(line[1]);
//        data.push(line[2]);
        }
        else{}
    };
    obs_chart_data = [].concat(obs_chart_data);
    console.log(obs_chart_data);


    var ctx = document.getElementById('plot'+id).getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
//            labels: ["January", "February", "March", "April", "May", "June", "July"],
//            labels:time,
            datasets: [{
                label: "My First dataset",
//                backgroundColor: 'rgb(255, 99, 132)',
//                borderColor: 'rgb(255, 99, 132)',
//                data: [0, 10, 5, 2, 20, 30, 45],
//                data:obs_chart_data,
                data:[{x:obs_chart_data[0]['x'],y:obs_chart_data[0]['y']},
                {x:obs_chart_data[1]['x'],y:obs_chart_data[1]['y']},
                {x:obs_chart_data[2]['x'],y:obs_chart_data[2]['y']},
                {x:obs_chart_data[3]['x'],y:obs_chart_data[3]['y']},
                {x:obs_chart_data[4]['x'],y:obs_chart_data[4]['y']},
                {x:obs_chart_data[5]['x'],y:obs_chart_data[5]['y']}]
//                data:data,
                fill:false,
            }]
        },

        // Configuration options go here
        options: {}
    });

}


var app;
app={create_plot:create_plot}