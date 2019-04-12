'use strict';

const https = require('https');

function getResturants(params) {
    // let queueURL = "https://search-restaurants-yegdabho2nnbw7j2k4hkugyo5m.us-east-1.es.amazonaws.com/_search?q=type:" + SQSResponse.categories;
    const options = {
        hostname: 'search-restaurants-yegdabho2nnbw7j2k4hkugyo5m.us-east-1.es.amazonaws.com/',
        path: '_search?q=type:' + params.categories,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {

        https.get(options, (resp) => {
            

            let data = '';
            
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                console.log(data);
                resolve(JSON.parse(data));
            });

        }).on("error", (err) => {
            console.log("Error Getting Elastic Resturants");

            console.log("Error: " + err.message);
            reject(err.message);
        });
    })
}

module.exports = async function (SQSResponse, event) {
    console.log("Inside getElasticQueryResponse")
    
    let res = await getResturants(SQSResponse);

    console.log(res, "Response from elastic")

}
