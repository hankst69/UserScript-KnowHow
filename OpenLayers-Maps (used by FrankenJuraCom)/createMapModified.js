
  		var map; 
  		var markerLayer; 
  		var polygonLayer; 
  		var mapHover; 
  		var iconNumber = 1; 
  		var numberedIcons = true; 
  	  
  		OpenLayers.ImgPath = '/images/openLayers/'; 
  	  
  		function createPolygon(points, id, name, type) { 
  			var site_points = new Array(); 
  			for(var i = 0; i < points.length; i++) { 
  				site_points.push(new OpenLayers.Geometry.Point(points[i][0], points[i][1])); 
  			} 
  			var linear_ring = new OpenLayers.Geometry.LinearRing(site_points); 
  			var centroid = linear_ring.getCentroid(); 
  			createMarker(centroid.x,centroid.y,'/klettern/region/'+id,name,'region/region_'+type); 
  			linear_ring.transform(new OpenLayers.Projection('EPSG:4326'), map.getProjectionObject()); 
  			var polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linear_ring]), null); 
  			polygonLayer.addFeatures([polygonFeature]); 
  		} 
      
  		function createMarker(lon,lat,href,name,type) { 
  	    var markerPoint = new OpenLayers.Geometry.Point(lon,lat).transform( 
  				new OpenLayers.Projection('EPSG:4326'),  
  				map.getProjectionObject() 
  			); 
  			
  			var width = 21; 
  			var height = 26; 
  			var xOffset = -width/2; 
  			var yOffset = -height/2; 
  			
  			var numberIcon; 
  			if(numberedIcons) { 
  				numberIcon = '/images/number/'+iconNumber+'.png'; 
  			} else { 
  				numberIcon = '/images/number/blank.png'; 
  			} 
  			iconNumber = iconNumber + 1; 
        
  			var markerAttributes = {title: name, href: href}; 
  			var markerImage = {externalGraphic: numberIcon, graphicWidth: width, graphicHeight: height, graphicXOffset: xOffset, graphicYOffset: yOffset, backgroundGraphic: '/images/poi/poi_'+type+'.png', backgroundWidth: width, backgroundHeight: height, backgroundXOffset: xOffset, backgroundYOffset: yOffset}; 
  			var markerFeature = new OpenLayers.Feature.Vector(markerPoint, markerAttributes, markerImage); 
  			
  			markerLayer.addFeatures(markerFeature); 
  		} 
  		
  		function onFeatureSelect(evt) { 
  			var feature = evt.feature; 
  			alert(feature.attributes.href); 
  		} 
  		
  		function drawMap() { 
  		  var mapControls = [  
  		    	new OpenLayers.Control.Navigation({ 
  					'zoomWheelEnabled': false, 
  				}), 
  				new OpenLayers.Control.Zoom() 
  			]; 
  		  
  			map = new OpenLayers.Map('map-64', { controls: mapControls, theme: null }); 
  			var mapnik = new OpenLayers.Layer.OSM('Mapnik','/osm/tileproxy.php?layer=OSM_MAPNIK&path=${z}/${x}/${y}.png'); 
  			map.addLayer(mapnik); 
  			
  			polygonLayer = new OpenLayers.Layer.Vector('Vector Layer'); 
  			var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']); 
  			style.fillColor = '#ee9900'; 
  			style.fillOpacity = 0.5; 
  			style.strokeWidth = 2;    			style.strokeColor = '#f5b300'; 
  			style.strokeOpacity = 0.9; 
  			polygonLayer.style = style; 
  	 		
  	 		map.addLayer(polygonLayer); 
  			
  			markerLayer = new OpenLayers.Layer.Vector('Markers'); 
  			map.addLayer(markerLayer); 
  			
  			var hoverControl = new OpenLayers.Control.SelectFeature(markerLayer, { 
  				hover: true, 
  				highlightOnly: true 
  			}); 
  			hoverControl.events.on({ 
  				'featurehighlighted':function(evt){ 
  					var feature = evt.feature; 
  					var popup = new OpenLayers.Popup('popup', 
  							OpenLayers.LonLat.fromString(feature.geometry.toShortString()), 
  							null, 
  							"<div style='white-space: nowrap'>" + feature.attributes.title + '</div>',   							null, 
  							true 
  					); 
  					popup.autoSize = true; 
  					feature.popup = popup; 
  					map.addPopup(popup); 
  				}, 
  				'featureunhighlighted':function(evt){ 
  					var feature = evt.feature; 
  					if (feature.popup) { 
  						map.removePopup(feature.popup); 
  						feature.popup.destroy(); 
  						feature.popup = null; 
  					} 
  				} 
  			}); 
  			map.addControl(hoverControl); 
  			hoverControl.activate(); 
        
  			var selectControl = new OpenLayers.Control.SelectFeature(markerLayer); 
  			map.addControl(selectControl); 
  			selectControl.activate(); 
  			
  			markerLayer.events.on({ 
  				'featureselected':function(evt){ 
  					window.location.href = evt.feature.attributes.href; 
  				} 
  			}); 
  			
  			var points; 
  			
  			iconNumber = 1; 
  			
createMarker(11.58677,49.49047,'/klettern/poi/1019','Alter Fritz 01 - Bergseite','crag')
createMarker(11.58677,49.49047,'/klettern/poi/1022','Alter Fritz 02 - Talseite','crag')
createMarker(11.60304,49.47056,'/klettern/poi/1033','Ammerrieder Fels','crag')
createMarker(11.60231,49.47128,'/klettern/poi/1027','Birkenfels','crag')
createMarker(11.58799,49.48904,'/klettern/poi/1030','Haunritzer Wand 01','crag')
createMarker(11.58799,49.48904,'/klettern/poi/1021','Haunritzer Wand 02','crag')
createMarker(11.58469,49.48768,'/klettern/poi/1029','Haunritzer Wirtsfelsen','crag')
createMarker(11.59701,49.47421,'/klettern/poi/1035','Hoher Fels','crag')
createMarker(11.586806,49.490698,'/klettern/poi/15789','Junger Fritz','crag')
createMarker(11.654046,49.480254,'/klettern/poi/15043','Kalbsfels','crag')
createMarker(11.65137,49.4828,'/klettern/poi/1040','Kuhfels','crag')
createMarker(11.5976,49.4766,'/klettern/poi/1037','Lichtenegger Wand','crag')
createMarker(11.58883,49.4892,'/klettern/poi/1039','Märchenland','crag')
createMarker(11.618291,49.48571,'/klettern/poi/15660','Naturfreundefels','crag')
createMarker(11.63297,49.46448,'/klettern/poi/1032','Nonnhofer Hochfels 01 - Höhlenwand','crag')
createMarker(11.63285,49.46421,'/klettern/poi/1031','Nonnhofer Hochfels 02 - Starlight','crag')
createMarker(11.59697,49.47417,'/klettern/poi/1038','Steinerne Krone','crag')
createMarker(11.59669,49.47125,'/klettern/poi/1023','Türkenfelsen 01 - Lichtblick','crag')
createMarker(11.59669,49.47125,'/klettern/poi/1024','Türkenfelsen 02 - Herbstzeitlose','crag')
createMarker(11.59669,49.47125,'/klettern/poi/1025','Türkenfelsen 03 - Tagtraum','crag')
createMarker(11.59669,49.47125,'/klettern/poi/1028','Türkenfelsen 04 - Miss Globoli','crag')
createMarker(11.59669,49.47125,'/klettern/poi/1026','Türkenfelsen 05 - Feierabend','crag')
  			map.zoomToExtent(markerLayer.getDataExtent()); 
  		} 
      
  		function initialize() { 
  	    drawMap(); 
  		} 
      
  		$(document).ready(function() { 
  			initialize(); 
  		}); 
      
      window.map = map; 
      setTimeout(function(){ map.updateSize(); }, 250); 
      