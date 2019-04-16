'use strict';

const https = require('https');
const AWS = require('aws-sdk')
var db = new AWS.DynamoDB();

module.exports.getResturantsIndices = function(sqsResponse) {
    const options = {
        hostname: 'search-restaurants-yegdabho2nnbw7j2k4hkugyo5m.us-east-1.es.amazonaws.com',
        path: '/_search?q=type:' + sqsResponse.categories,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {
        https.get(options, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                // console.log("printing chunks");
                data += chunk;
            });
            resp.on('end', () => {
                let ids = JSON.parse(data).hits.hits
                let response = ids.map(function (elem) {
                    return {
                        "id": {S:elem._id},
                    };
                });
                console.log("Received " + response.length + " ES indices");
                resolve(response);
            });

        }).on("error", (err) => {
            console.log("Error Getting Elastic Resturants");
            console.log("Error: " + err.message);
            reject(err.message);
        });
    });
}
