exports.handler = async (event) => {
    

    var aws = require('aws-sdk');
    
    
    var lexruntime = new aws.LexRuntime();
    
    var params = {
        botAlias: '$LATEST', /* required */
        botName: 'ResturantService', /* required */
        inputText: event.userQuery,
        userId: 'Text', /* required */
    };
    
    function wait(){
        
        return new Promise((resolve, reject) => {
            lexruntime.postText(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else resolve(data);           // successful response
            });
        });
        
    }
    
    var result = await wait();
   
    return result;
    
};
