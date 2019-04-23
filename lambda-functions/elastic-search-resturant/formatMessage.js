module.exports.format = function(restaurants, sqsResponse) {

    let cuisine = sqsResponse.categories;
    let date = sqsResponse.date;
    let time = sqsResponse.time;
    cuisine = cuisine.charAt(0).toUpperCase() + cuisine.slice(1);

    let peopleCount = sqsResponse.limit;
    let fullFilmentMsg = `Hello! Here are my ${cuisine} restaurant suggestions for ${peopleCount} people,`;
    fullFilmentMsg += `for ${date} at ${time} : `;

    restaurants.forEach(function (item, index) {
        let ResturantAddress = `${item.location.M.display_address.L[0].S}`;
        fullFilmentMsg += `${index + 1}) ${item.name.S} located at ${ResturantAddress} `;
    });

    fullFilmentMsg += ". Enjoy your meal!";
    console.log("FullFilmentMsg - " + fullFilmentMsg);
    return fullFilmentMsg;
}
