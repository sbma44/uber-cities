rm -rf geojson
mkdir geojson
for a in $(find cities -type f)
do
    node -e "var fs = require('fs'); console.log(JSON.parse(fs.readFileSync('$a')).geojson);" > geojson/`basename $a .json`.geojson
done