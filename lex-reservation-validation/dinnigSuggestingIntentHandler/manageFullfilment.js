 'use strict';

const lexResponses = require('../lexResponses');
const querystring = require('querystring');
var https = require('https');

function getResturants(params){
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

function formFullfilmentMsg(resturants){
    
    let fullFilmentMsg = "Here are few suggestions. ";

    resturants.forEach(function (item, index) {
        let ResturantAddress = `${item.location.display_address[0], item.location.display_address[1]}`

        fullFilmentMsg += `${index + 1}) ${item.name}, located at ${ResturantAddress} `;

    });


    fullFilmentMsg += ". Enjoy your meal!"

    return fullFilmentMsg
}

module.exports = async function (intentRequest) {
    
    let time = intentRequest.currentIntent.slots.time;
    let date = intentRequest.currentIntent.slots.date;
    let peopleCount = intentRequest.currentIntent.slots.peopleCount;
    let unixDate = new Date(date + ' ' + time).getTime() / 1000
    
    console.log(date,time);
    console.log("unixDate", unixDate);
    
    let params = {
        term:'restaurants',
        location:intentRequest.currentIntent.slots.location,
        categories: intentRequest.currentIntent.slots.cuisine,
        limit:5,
        open_at: unixDate,
        sort_by: 'distance',
    }
    
    let res = await getResturants(params);
    

    let fullFilmentMsg = formFullfilmentMsg(res["businesses"]);

    return lexResponses.close(intentRequest.sessionAttributes, 'Fulfilled', { contentType: 'PlainText', content: fullFilmentMsg });
};