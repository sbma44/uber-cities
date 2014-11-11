all:
	rm -rf cities & mkdir cities
	rm -rf geojson && mkdir geojson
	node index.js
	node extract-geojson.js
