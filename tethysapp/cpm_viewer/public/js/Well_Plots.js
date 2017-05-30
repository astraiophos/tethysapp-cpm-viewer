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
        id:'plot'+id
    }).appendTo('#'+id);

    create_plot(id);
};


create_plot = function(id){

    var ctx = document.getElementById('plot'+id).getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "My First dataset",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45],
            }]
        },

        // Configuration options go here
        options: {}
    });

}


var app;
app={create_plot:create_plot}