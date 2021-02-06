
		// Setting up the map (code that we're used to)
		var map = L.map('map').setView([37.8, -96], 4);
		L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
			maxZoom: 18,
			minZoom: 4,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' +'Population data &copy; <a href="http://census.gov/">US Census Bureau</a>'
		}).addTo(map);

		// // get color depending on population density value
		function getColor(d) {
			// // condition ? do-this-if-true : do-this-if-false
			return d > 50  ? '#020105' :
			       d > 40  ? '#171136' :
			       d > 30  ? '#231272' :
			       d > 20  ? '#361CB2' :
			       d > 10  ? '#7C5AD4' :
			       d > 0   ? '#7C83E6' :
			                 '#CBCAFF' ;
		}

		function style(feature) {
			return {
				weight: .9,
				opacity: .75,
				color: 'white',
				fillOpacity: .75,
				// // Below is where we call in the density numbers from the geojson
				fillColor: getColor(feature.properties.percentWomen)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;
			layer.setStyle({
				weight: 3,
				color: "#00133D",
				//dashArray: '3',
				fillOpacity: .95
			});
			// This is where data changes dependent on the state
			info.update(layer.feature.properties);
		}

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature, //on mouseover, call this function
				mouseout: resetHighlight, // on mouseout, call this function
			});
		}

		var geojson = L.geoJson(stateData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);

		var info = L.control();

		// add info
		info.onAdd = function (map) {
		    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		    this.update();
		    return this._div;
		};

		// method that we will use to update the control based on feature properties passed
		info.update = function (props) {
		    this._div.innerHTML = '<h4>% Women Legislators</h4>' +  (props ?
		        '<b>' + props.name + '</b>' + ':  ' + props.percentWomen + '%</sup>'
		        : 'Hover over a state');
		};

		info.addTo(map);

		// legend
		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'info legend'),
		        grades = [0, 10, 20, 30, 40, 50],
		        labels = [];

		    // loop through our density intervals and generate a label with a colored square for each interval
		    for (var i = 0; i < grades.length; i++) {
		        div.innerHTML +=
		            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
		            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		    }

		    return div;
		};

		legend.addTo(map);
