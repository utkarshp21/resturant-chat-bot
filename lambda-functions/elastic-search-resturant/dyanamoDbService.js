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
    let restaurants = [];
    return new Promise((resolve, reject) => {
        db.batchGetItem(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); 
                reject(err);
            }
            else {
                if (data && data['Responses'] && data['Responses'][table_name]){
                    restaurants = data['Responses'][table_name];
                }
                console.log("Received " + restaurants.length + " Resturants From DB");
                resolve(restaurants);
            }
        });
    });
};

