'use strict';

const https = require('https');
const AWS = require('aws-sdk')
var db = new AWS.DynamoDB();

module.exports.getResturantsDetails = async function(allIndex) {
    
    let params = {
        "RequestItems": {
            "yelp-restaurants": {
                "Keys": allIndex
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
                console.log("Received " + data['Responses']['yelp-restaurants'].length + " Resturants From DB");
                let restaurants = data['Responses']['yelp-restaurants'];
                resolve(restaurants);
            }
        });
    });
}

