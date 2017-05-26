var map;
$(document).ready(function(){
    //Define the extent kml file style
    extentStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color:[0,0,0]
        })
    });

    //Here we are declaring the projection object for Web Mercator
    var projection = ol.proj.get('EPSG:3857');

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
            }),
        style: extentStyle
        });

    $.ajax({
        type: 'POST',
        url: '/apps/cpm-viewer/points/',
        dataType: 'json',
        data: {},
        success: function (data){
                console.log(data);
//                var point_layer = new ol.layer.Vector({
//                source: new ol.source.Vector({
//
//                }),
        },
    });

    var layers = [];
    layers.push(baseLayer,vector);

    var view = new ol.View({
            center: [-13310000, 5866000],
            projection: projection,
            zoom: 11,
    });

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