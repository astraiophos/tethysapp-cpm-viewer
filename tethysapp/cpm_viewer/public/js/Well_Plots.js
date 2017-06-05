var add_tab;
var newItemConfig;

add_tab = function(id,myLayout){
    newItemConfig = {
        title:id,
        type:'component',
        componentName:'Map',
        componentState:{
                        myId:id,
                       },
    };
    $('#inner-app-content').find('.lm_header')[0].click()
    myLayout.selectedItem.addChild(newItemConfig);

    // This section through to the 'create_plot()' function builds the plots from the available text data
    $('<canvas>').attr({
        id:'plot'+id,
        class:'myPlot',
        height:'100%',
        width:'auto',
    }).appendTo('#'+id);

    create_plot(id);

    // This section down to the end bracket adds the preprocessed plots for each well location
//    $('<img>').attr({
//        id:'hydro_'+id,
//        src:'/static/cpm_viewer/images/hydro/'+id+'.png',
//        height:'auto',
//        width:'49.75%',
//        position:'absolute',
//        align:'left',
//        class:'chart',
//    }).appendTo('#'+id);
//
//
//    $('<img>').attr({
//        id:'hydro_2011_'+id,
//        src:'/static/cpm_viewer/images/hydro_2011/'+id+'.png',
//        height:'auto',
//        width:'49.75%',
//        align:'right',
//        class:'chart',
//    }).appendTo('#'+id);
//
//    $(function(){
//        $('.chart').css({
//            'margin-top':$(this).height()/64+"px",
//        })
//    });
};


create_plot = function(id){

    var char_obs_data = [];
    var char_cal_data = [];
    var char_nopp_data = [];
    var char_unc_data = [];
    var char_834_data = [];

    for(line in obs_data){
        if (obs_data[line][0] === id){
        char_obs_data.push({x:moment(obs_data[line][1]).format(),y:Number(obs_data[line][2])});
        }
        else{}
    };

    for(line in sim_845_data){
        if (sim_845_data[line][0] === id){
        char_cal_data.push({x:moment(sim_845_data[line][1]).format(),y:Number(sim_845_data[line][2])});
        }
        else{}
    };

    for(line in sim_nopp_data){
        if (sim_nopp_data[line][0] === id){
        char_nopp_data.push({x:moment(sim_nopp_data[line][1]).format(),y:Number(sim_nopp_data[line][2])});
        }
        else{}
    };

    for(line in sim_unc_data){
        if (sim_unc_data[line][0] === id){
        char_unc_data.push({x:moment(sim_unc_data[line][1]).format(),y:Number(sim_unc_data[line][2])});
        }
        else{}
    };

    for(line in sim_834_data){
        if (sim_834_data[line][0] === id){
        char_834_data.push({x:moment(sim_834_data[line][1]).format(),y:Number(sim_834_data[line][2])});
        }
        else{}
    };

    var ctx = document.getElementById('plot'+id).getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'scatter',

        // The data for our dataset
        data: {
            datasets: [{
                label: "Observed",
                data:char_obs_data,
                fill:false,
                showLine:false,
                pointBackgroundColor:'rgba(255,0,0,0)',
                pointBorderColor:'rgba(255, 0, 0, 1)',      // Red
            },
            {
                label: "Calibrated",
                data:char_cal_data,
                fill:false,
                showLine:true,
                borderColor:'rgba(54, 162, 235, 1)',        // Blue
                pointRadius:0,
            },
            {
                label: "No Pilot Points",
                data:char_nopp_data,
                fill:false,
                showLine:true,
                borderColor:'rgba(0, 128, 0, 1)',        // Green
                borderDash: [10,5],
                pointRadius:0,
            },
            {
                label: "Uncalibrated",
                data:char_unc_data,
                fill:false,
                showLine:true,
                borderColor:'rgba(255, 255, 0, 1)',        // Yellow
                borderDash: [5,3],
                pointRadius:0,
            },
            {
                label: "V 8.3.4",
                data:char_834_data,
                fill:false,
                showLine:true,
                borderColor:'rgba(128, 128, 128, 1)',        // Yellow
                borderDash: [3,1.5],
                pointRadius:0,
            },
            ]
        },

        // Configuration options go here
        options: {
            responsive:true,
            legend:{
                usePointStyle:true,
                onHover:function(evt,chartInstance){
                    if(chartInstance.text === 'Observed' || chartInstance.text === 'Calibrated' ||
                        chartInstance.text === 'No Pilot Points' || chartInstance.text === 'Uncalibrated' ||
                        chartInstance.text === 'V 8.3.4'){
                        evt.target.style.cursor = 'pointer';
                    }
                    else{
                        evt.target.style.cursor = 'auto';
                    }
                },
            },
            // Thanks to @birrein on stackoverflow.com
            hover:{
                onHover:function(e){
                    $('#plot'+id).css("cursor",e[0] ? "default" : "default");
                }
            },
            scales:{
                xAxes:[{
                    type:'time',
                    time:{
                        displayFormats:{
                            quarter:'MMM YYYY'
                        }
                    }
                }]
            }
        }
    });

}


var app;
app={create_plot:create_plot}