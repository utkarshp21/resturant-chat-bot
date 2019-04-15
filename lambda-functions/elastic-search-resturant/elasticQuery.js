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
                resolve(response);
            });

        }).on("error", (err) => {
            console.log("Error Getting Elastic Resturants");
            console.log("Error: " + err.message);
            reject(err.message);
        });
    });
}

function getResturantsDynamo(all_index) {
    
    console.log("inside getResturantsDynamo");
    let params = {
        "RequestItems": {
            "yelp-restaurants": {
                "Keys": all_index
            }
        }
    };
    return new Promise((resolve, reject) => {
        db.batchGetItem(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); 
                reject(err);
            }
            else {
                console.log("Number of Resturants retrieved- " + data['Responses']['yelp-restaurants'].length);
                resolve(data['Responses']['yelp-restaurants']);
            }
        });
    });
  
}
function formatResponse(restaurants){
    let fullFilmentMsg = "Here are few suggestions - <br>";
    restaurants.forEach(function (item, index) {
        let ResturantAddress = `${item.location.display_address[0]}, ${item.location.display_address[1]}`;
        fullFilmentMsg += `${index + 1}) <b>${item.name}</b> located at ${ResturantAddress} <br>`;
    });
    fullFilmentMsg += "Enjoy your meal!";
    return fullFilmentMsg;
}

module.exports = async function (SQSResponse, event) {
    let all_index = await getResturantsId(SQSResponse);
    let restaurants = await getResturantsDynamo(all_index);
    let formattedResponse = "email content";//formatResponse(restaurants);
    return formattedResponse;
};
