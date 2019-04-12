'use strict';

const querystring = require('querystring');
const https = require('https');

function getResturants(params) {
    console.log("Inside get Resturants");
    const token = "YftPEyyLHK1F-Vrrc-p5xbSIHzqDN8o6UVD9QkNaL7yi6F60i3_uuK00KCcKBNjX19b1KmiLygLiiLobZPG-x3lekJb3drzwnkuri65Y-gxUj2tYa-A-lZDRoVGIW3Yx";
    const options = {
        hostname: 'api.yelp.com',
        path: '/v3/businesses/search?' + querystring.stringify(params),
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    return new Promise((resolve, reject) => {

        https.get(options, (resp) => {
            console.log("Executing Promise")
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
            reject(err.message);
        });
    })
}

module.exports = function (SQSResponse, event) {
    console.log("Inside getElasticQueryResponse")
    console.log(SQSResponse);
    let queueURL = "https://search-restaurants-yegdabho2nnbw7j2k4hkugyo5m.us-east-1.es.amazonaws.com/_search?q=type:American"
    
    console.log(queueURL);

}
