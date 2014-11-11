var fs = require('fs');

fs.readdir('./cities', function(err, files) {
    files.forEach(function(filename, i) {
        fs.readFile('./cities/' + filename, function(err, data){
            var basename = filename.replace(/\.json/, '');
            var data = JSON.parse(data);
            if (data.geojson !== null) {
                fs.writeFile('geojson/' + basename + '.geojson', JSON.stringify(data.geojson));
            }
            else {
                console.log('- bad geojson for ' + filename + ', creating from bounding box instead');
                var x1 = data.gbounds.northeast.lng,
                    y1 = data.gbounds.northeast.lat,
                    x2 = data.gbounds.southwest.lng,
                    y2 = data.gbounds.southwest.lat;

                var geojson = {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "Polygon",
                                coordinates:[[
                                    [x1, y1],
                                    [x1, y2],
                                    [x2, y2],
                                    [x2, y1],
                                    [x1, y1]
                                ]]
                            }
                        }
                    ]
                };
                fs.writeFile('geojson/' + basename + '.geojson', JSON.stringify(geojson));

            }
        });
    });
});