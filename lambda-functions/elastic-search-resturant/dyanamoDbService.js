'use strict';

const https = require('https');
const AWS = require('aws-sdk')
const table_name = 'yelp-restaurants-maitrey-testing';
var db = new AWS.DynamoDB();

module.exports.getResturantsDetails = async function(allIndex) {
    
    let params = {
        "RequestItems": {
            [table_name] : {
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
                console.log("Received " + data['Responses'][table_name].length + " Resturants From DB");
                let restaurants = data['Responses'][table_name];
                resolve(restaurants);
            }
        });
    });
}

