/*****************************************************************************
 * FILE:    golden_layout.js
 * DATE:    12/16/2016
 * AUTHOR:  Jacob Fullerton
 * COPYRIGHT: (c) 2016 Brigham Young University
 * LICENSE: BSD 2-Clause
 * CONTRIBUTIONS:   http://golden-layout.com/
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
var $mapContainer;
var $tableContainer;
var $mapWrapper;
var window_height;
var $mapLayoutDiv;
var $tableLayoutDiv;

/*****************************************************************************
 *                            Main Script
 *****************************************************************************/

$(document).ready(function(){
    //    initializeJqueryVars;
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
