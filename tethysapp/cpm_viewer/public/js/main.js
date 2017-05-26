var map;
var baseLayer,vector,point_layer;

$(document).ready(function(){
    //Here we are declaring the projection object for OpenLayers
    var projection = 'ESRI:102749';
    proj4.defs(projection,"+proj=lcc +lat_1=45.83333333333334 +lat_2=47.33333333333334 "+
        "+lat_0=45.33333333333334 +lon_0=-120.5 +x_0=500000.0000000002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs");
    var myProjection = ol.proj.get(projection);

    ol.proj.addProjection(myProjection);

    var view = new ol.View({
        center: [-13310000, 5866000],
        projection: 'EPSG:3857',
//        projection:myProjection,
        zoom: 11,
    });

    //Define the extent kml file style
    extentStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color:[0,0,0]
        })
    });

    $.ajax({
        type: 'POST',
        url: '/apps/cpm-viewer/points/',
        dataType: 'json',
        data: {},
        success: function (data){
//                 console.log(data);
                 point_list = data['session'];
                 point_features = [];

                 //Create a feature collection from the points
//                 for (point in point_list){
//                    if(point === "0"){
//                        var props = point_list[point];
//                        //Thanks to @Bergi on Stackoverflow.com
//                        props.map(Function.prototype.call,String.prototype.trim);
//                    }
//                    else{
//                        point_features.push({
//                            'type':'Feature',
//                            'geometry':{
//                                'type':'Point',
//                                'coordinates':[Number(point_list[point][1]),Number(point_list[point][2])],
//                            },
//                            'properties':{
//                                'Well_ID':point_list[point][0],
//                                'Error':Number(point_list[point][3]),
//                                'Abs_Error':Number(point_list[point][4]),
//                                'RMS':Number(point_list[point][5]),
//                                'Count':Number(point_list[point][6].substring(0, point_list[point][6].length - 2)),
//                            },
//                        });
//                    }
//                 };
//                 var myFeatures = {
//                    'type': 'FeatureCollection',
//                    'crs': {
//                        'type': 'name',
//                        'properties': {
//                            'name':'ESRI:102749'
//                        }
//                    },
//                    'features': point_features
//                 };
//
//                 //  Establish the format as GeoJSON
//                 var format = new ol.format.GeoJSON();
//
//                 //  Create new layer source for the layer receiving the features
//                 var point_source = new ol.source.Vector({
//                     features: format.readFeatures(myFeatures,{
//                         dataProjection:myProjection,
////                         featureProjection:"EPSG:3857"
//                     })
//                 });
//
//                point_layer = new ol.layer.Vector({
//                    source: point_source,
//                });
                //Define Basemap
                //Here we are declaring the raster layer as a separate object to put in the map later
                var baseLayer = new ol.layer.Tile({
                    source: new ol.source.BingMaps({
                        key: '5TC0yID7CYaqv3nVQLKe~xWVt4aXWMJq2Ed72cO4xsA~ApdeyQwHyH_btMjQS1NJ7OHKY8BK-W-EMQMrIavoQUMYXeZIQOUURnKGBOC7UCt4',
                        imagerySet: 'AerialWithLabels' // Options 'Aerial', 'AerialWithLabels', 'Road'
                        })
                });

                var vector = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                            url:'/static/cpm_viewer/images/Model_Extent.js',
//                            projection:'EPSG:3857',
//                            projection:myProjection,
                        }),
                    style: extentStyle
                });

                var wells = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                            url:'/static/cpm_viewer/images/Well_Features.js',
                            projection:'EPSG:3857',
//                            projection:myProjection,
                        }),
//                    style: extentStyle
                });

                var layers = [];
                layers.push(baseLayer,vector,wells);

                //Declare the map object itself.
                map = new ol.Map({
                    target: document.getElementById("map"),
                    layers: layers,
                    view: view,
                });

                map.on('pointermove', function(evt) {
                    if (evt.dragging) {
                        return;
                    }
                    var pixel = map.getEventPixel(evt.originalEvent);
                    var hit = map.forEachLayerAtPixel(pixel, function(layer) {
                    if (layer != baseLayer && layer != vector){
                        return true;}
                    });
                    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
                });

        },
    });

//    (function () {
//        var target, observer, config;
//        // select the target node
//        target = $('#app-content-wrapper')[0];
//
//        observer = new MutationObserver(function () {
//            window.setTimeout(function () {
//                map.updateSize();
//            }, 350);
//        });
//
//        config = {attributes: true};
//
//        observer.observe(target, config);
//    }());

});

/*****************************************************************************
 *                       Ajax Utility Functions
 *****************************************************************************/

//  Thanks to @shawncrawley for this code which I copied from his hydroshare_gis app
//  <https://github.com/hydroshare/tethysapp-hydroshare_gis>

// Find if method is CSRF safe
checkCsrfSafe = function (method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
};

getCookie = function (name) {
    var cookie;
    var cookies;
    var cookieValue = null;
    var i;

    if (document.cookie && document.cookie !== '') {
        cookies = document.cookie.split(';');
        for (i = 0; i < cookies.length; i += 1) {
            cookie = $.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

// Add CSRF token to appropriate ajax requests
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!checkCsrfSafe(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
        }
    }
});

//Create public functions to be called in the controller
var app = {map: map}