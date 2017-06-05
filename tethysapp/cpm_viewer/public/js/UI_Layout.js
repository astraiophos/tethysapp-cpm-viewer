/*****************************************************************************
 * FILE:    golden_layout.js
 * DATE:    12/16/2016
 * AUTHOR:  Jacob Fullerton
 * COPYRIGHT: (c) 2016 Brigham Young University
 * LICENSE: BSD 2-Clause
 * CONTRIBUTIONS:   http://golden-layout.com/
 * NOTES:   Adapted for isolated project to display model results
 *
 *****************************************************************************/

/*****************************************************************************
 *                              Functions
 *****************************************************************************/



/*****************************************************************************
 *                             Variables
 *****************************************************************************/

var config;
var myLayout
var $innerApp;
var window_height;
var $mapLayoutDiv;

/*****************************************************************************
 *                            Main Script
 *****************************************************************************/

$(document).ready(function(){
    $('#app-content').css({'padding-bottom':'0px','width':'100%'});
    $innerApp = $('#inner-app-content');
    $map = $('#map');

    config = {
        settings:{hasHeaders:true,
                  selectionEnabled:true,
                  isClosable:false,
                  showCloseIcon:false,
                  showMaximiseIcon:false,
                  showPopoutIcon:false,},
        content: [{
            type: 'column',
            content:[{
                type: 'component',
                componentName: 'Map',
                componentState: { myId: 'map_view_layout' },
            }]
        }]
    };

    //  To resize the layout to fit
    window_height = $(window).height();
    $innerApp.height(window_height-140);

    myLayout = new GoldenLayout( config,$innerApp );
    myLayout.registerComponent( 'Map', function( container, componentState ){
        container.getElement().addClass('id');
        container.getElement().attr('id',componentState.myId);
    });
    myLayout.init();

    $mapLayoutDiv = $('#map_view_layout');

    $map.appendTo($mapLayoutDiv);
    //  Resize map div to be 100% so that map always fills the space inside layout container
    $map.height('100%');

})
