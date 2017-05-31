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
    $('#inner-app-content').find('.lm_header')[0].click()
    myLayout.selectedItem.addChild(newItemConfig);

//    $('<canvas>').attr({
//        id:'plot'+id,
//        class:'myPlot'
//    }).appendTo('#'+id);

//    $('<div>').attr({id:'div_'+id,height:$('#'+id).height(),'vertical-align':'middle'}).appendTo('#'+id);

    $('<img>').attr({
        id:'hydro_'+id,
        src:'/static/cpm_viewer/images/hydro/'+id+'.png',
        height:'auto',
        width:'49.75%',
        position:'absolute',
//        top:'50%',
        align:'left',
        class:'chart',
//    }).appendTo('#'+id).find('#div_'+id);
    }).appendTo('#'+id);

//    $('<div>').attr({float:'center'}).appendTo('#'+id);

    $('<img>').attr({
        id:'hydro_2011_'+id,
        src:'/static/cpm_viewer/images/hydro_2011/'+id+'.png',
        height:'auto',
        width:'49.75%',
        align:'right',
        class:'chart',
//    }).appendTo('#'+id).find('#div_'+id)
    }).appendTo('#'+id);

//    $('.chart').each(function(){
//        $(this).position({
//            my:"left bottom",
//            at:"left bottom",
//            of:"#"+id,
//        });
//    });

    $(function(){
        $('.chart').css({
//            'top':'50%',
//        'margin-top':function(){return -$(this).height()/32},
//            'vertical-align':'middle',
            'margin-top':$(this).height()/64+"px",
        })
    });

//    create_plot(id);
};


create_plot = function(id){

    var char_obs_data = [];
    var char_cal_data = [];
    var char_nopp_data = [];
    var sim_unc_data = [];
    var sim_834_data = [];

    for(line in obs_data){
        if (obs_data[line][0] === id){
        char_obs_data.push({x:moment(obs_data[line][1]).format(),y:Number(obs_data[line][2])});
        }
        else{}
    };

    var cal_time = [];
    var cal_vals = [];

    for(line in sim_845_data){
        if (sim_845_data[line][0] === id){
        char_cal_data.push({x:moment(sim_845_data[line][1]).format(),y:Number(sim_845_data[line][2])});
        }
        else{}
    };


    var ctx = document.getElementById('plot'+id).getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'scatter',

        // The data for our dataset
        data: {
//            labels:obs_time,
            datasets: [{
//            labels:obs_time,
                label: "Observed",
                data:char_obs_data,
                fill:false,
                showLine:false,
                pointBackgroundColor:'rgba(255,0,0,0)',
                pointBorderColor:'rgba(255, 0, 0, 1)',
            },
            {
                label: "Calibrated",
//                data:cal_vals,
                data:char_cal_data,
                fill:false,
                showLine:true,
                borderColor:'rgba(54, 162, 235, 1)',
                pointRadius:0,
            },
            ]
        },

        // Configuration options go here
        options: {
            responsive:true,
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