var map;
var baseLayer,vector,point_layer;
var obs_data, sim_845_data, sim_nopp_data, sim_unc_data, sim_834_data;

$(document).ready(function(){
    var view = new ol.View({
        center: [-13312000, 5870000],
        projection: 'EPSG:3857',
        zoom: 12.5,
    });

    //Define the extent kml file style
    extentStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color:[0,0,0]
        })
    });

    //Define Basemap
    var baseLayer = new ol.layer.Tile({
        source: new ol.source.BingMaps({
            key: '5TC0yID7CYaqv3nVQLKe~xWVt4aXWMJq2Ed72cO4xsA~ApdeyQwHyH_btMjQS1NJ7OHKY8BK-W-EMQMrIavoQUMYXeZIQOUURnKGBOC7UCt4',
            imagerySet: 'AerialWithLabels' // Options 'Aerial', 'AerialWithLabels', 'Road'
            })
    });

    //Define Model Extents layer
    var vector = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
                url:'/static/cpm_viewer/images/Model_Extent.js',
            }),
        style: extentStyle
    });

    //Well Locations
    var wells = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
                url:'/static/cpm_viewer/images/Well_Features.js',
                projection:'EPSG:3857',
            }),
//        style: styleFunction,
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

    map.on('click',function(evt){
        var pixel = evt.pixel;
        displayFeatureInfo(pixel);
    });

    var displayFeatureInfo = function(pixel){
        var features = [];
        map.forEachFeatureAtPixel(pixel, function(feature,layer){
            if(layer !=baseLayer && layer !=vector){
            features.push(feature);
            }
        });
        if (features.length !== 0){
            var id = features[0].getProperties()['WELL_ID'];
            add_tab(id,myLayout);
        }
    };

    // This makes the tooltip part that displays the id of each wellpoint as user hovers over it
    // Credit goes to @Anton Anton stackoverflow.com
    var tooltip = document.getElementById('tooltip');
    var overlay = new ol.Overlay({
        element:tooltip,
        offset:[10,0],
        positioning:'bottom-left',
    });
    map.addOverlay(overlay);

    function displayTooltip(evt){
        var pixel = evt.pixel;
        var feature = map.forEachFeatureAtPixel(pixel,function(feature,layer){
            if(layer !=baseLayer && layer !=vector){
                return feature;
            }
        });
        tooltip.style.display = feature ? '':'none';
        if (feature){
            overlay.setPosition(evt.coordinate);
            tooltip.innerHTML = feature.get('WELL_ID');
        }
    };
    map.on('pointermove',displayTooltip);

    // Retrieve all well data in advance to reduce the time for buffering
    $.ajax({
            type: 'POST',
            url: '/apps/cpm-viewer/points/',
            dataType: 'json',
            data: {},
                success: function (data){
                    obs_data = data['OBS'];
                    sim_845_data = data['S845'];
                    sim_nopp_data = data['SNPP'];
                    sim_unc_data = data['SUNC'];
                    sim_834_data = data['S834'];
                }
    });

    // Coloring of wellpoints
//    var getStyleColor;
//    var i;
//
//    getStyleColor = function(val) {
//        var value = Number(val);
//        if (value < -2)
//            return [170,1,20, 1];		//	Red
//        else if (value >= -2 || value < -1)
//            return [196,100,0,1];		//	Orange
//        else if (value >= -1 || value < -0.5)
//            return [255,165,0,1];		//	Light Orange, Hex:ffa500
//        else if (value >= -0.5 || value < 0)
//            return [255,255,0,1];		//	Yellow, Hex:FFFF00
//        else if (value >= 0 || value < 0.5)
//            return [0,255,0,1];			//	Green
//        else if (value >= 0.5 || value < 1)
//            return [0,218,157,1];		//	Turqoise(ish), Hex:00DA9D
//        else if (value >= 1 || value < 2)
//            return [0,158,223,1];		//	Lighter Blue, Hex:009EDF
//        else if (value >= 2)
//            return [1,107,231,1];		//	Light Blue, Hex:016BE7
//		else
//			return [0,32,229,1];		//	Blue, Hex:0020E5
//    };
//
//	//	Default style
//	var defaultStyle = new ol.style.Circle({
//			fill: [0,0,0,1],
//			radius: 2
//	});
//
//    //This will be used to cache the style
//    var styleCacheHead = {};
//
//    function styleFunction(feature, resolution){
//        //get the element ID, label, end_element, end_state, and layer from the feature properties
//        var error = feature.get('ERROR');
//        //if there is no elevation value or it's one we don't recognize,
//        //return the default style
//        if(!error) {
//            return [defaultStyle];
//            }
//        //check the cache and create a new style for the elevation if it's not been created before.
//        if(!styleCacheHead[elem_layer]){
//            var style_color = getStyleColor(error);
//            styleCacheHead[error] = new ol.style.Circle({
//                fill: style_color,
//                radius: 2
//            });
//        }
//    //at this point, the style for the current level is in the cache so return it as an array
//        return [styleCacheHead[error]];
//    }

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