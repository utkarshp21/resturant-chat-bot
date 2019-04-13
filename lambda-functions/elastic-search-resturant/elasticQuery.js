'use strict';

const https = require('https');
const AWS = require('aws-sdk')
var db = new AWS.DynamoDB();

function getResturantsId(params) {
    const options = {
        hostname: 'search-restaurants-yegdabho2nnbw7j2k4hkugyo5m.us-east-1.es.amazonaws.com',
        path: '/_search?q=type:' + params.categories,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {

        https.get(options, (resp) => {
            

            let data = '';
            
            resp.on('data', (chunk) => {
                console.log("printing chunks");
                data += chunk;
            });
            resp.on('end', () => {
                let ids = JSON.parse(data).hits.hits
                
                let response = ids.map(function (elem) {
                    return {
                        "id": {S:elem._id},
                    };
                });

                resolve(response);
            });

        }).on("error", (err) => {
            console.log("Error Getting Elastic Resturants");
            console.log("Error: " + err.message);
            reject(err.message);
        });
    })
}

function getResturantsDynomo(all_index) {
    
    let params = {
        "RequestItems": {
            "yelp-restaurants": {
                "Keys": all_index
            }
        }
    }

    console.log(params);
    
    console.log("inside get resturatnsasd");

    db.batchGetItem(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
  
}
module.exports = async function (SQSResponse, event) {
    console.log("Inside getElasticQueryResponse")
    
    let all_index = await getResturantsId(SQSResponse);

    let restaurants = await getResturantsDynomo(all_index);

    console.log(restaurants);
    console.log("Response from elastic")

}
