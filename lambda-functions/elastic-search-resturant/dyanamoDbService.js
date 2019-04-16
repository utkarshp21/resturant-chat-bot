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
                let formattedResponse = "message content";//formatResponse(restaurants);
                resolve(formattedResponse);
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
