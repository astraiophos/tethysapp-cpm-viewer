var add_tab;
var newItemConfig;

add_tab = function(id,myLayout){
    newItemConfig = {
        title:id,
        type:'component',
        componentName:'Map',
        componentState:{text:'You did it! Well ID is: ' + id},
    };
    myLayout.root.contentItems[0].select();
    myLayout.selectedItem.addChild(newItemConfig);
};

var app;

app = {add_tab:add_tab};