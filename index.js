var fs = require('fs');
var cheerio = require('cheerio');
var limit = require('simple-rate-limiter');
var request = limit(require('request')).to(5).per(1000);

request('https://www.uber.com/en-US/cities', function (err, resp, html) {
    var $ = cheerio.load(html);
    $('a').filter(function (i, elem) {
        return elem.attribs.href.match(/\/cities\//);
    }).each(function (i, elem) {
        
        var cityName = elem.attribs.href.replace(/\/cities\//, '').replace(/\/$/, '');
        request('https://www.uber.com' + elem.attribs.href, function (err, resp, html) {
            var $$ = cheerio.load(html);
            $$('script').filter(function (i, elem) {
                return elem.children && elem.children[0] && elem.children[0].data && elem.children[0].data.match(/cityJSON/);
            }).each(function (i, elem) {
                eval(elem.children[0].data);
                fs.writeFile('cities/' + cityName + '.json', JSON.stringify(cityJSON), function (err) {
                    if (err)
                        console.log('ERROR: ' + err);
                    console.log(' - ' + cityName);
                });
            });
        });
        
    });
});