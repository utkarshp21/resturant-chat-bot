
const AWS = require('aws-sdk')
const region = 'us-east-1'
const sqs = new AWS.SQS({ region: region });
const queueURL = "https://sqs.us-east-1.amazonaws.com/245491298808/resturantQueue"

module.exports.pollMessage = function () {
    let params = {
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: queueURL,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 0
    };

    return new Promise((resolve, reject) => {

        sqs.receiveMessage(params, function (err, data) {

            if (err) {
                reject("SQS Recieve Error - " + err.message);

            } else if (data.Messages) {
                console.log("Received " + data.Messages.length + " Messages from SQS");
                let sqsMessage = data.Messages[0]; 
                let messageId = sqsMessage.MessageId;
                console.log("Received Message[" + messageId + "]");
                let sqsMessageBody = JSON.parse(sqsMessage.Body);  
                let deleteParams = {
                    QueueUrl: queueURL,
                    ReceiptHandle: sqsMessage.ReceiptHandle
                };
                sqs.deleteMessage(deleteParams, function (err, data) {
                    if (err) {
                        reject("Delete Fail [" + messageId + "] " + err.message);
                    } else {                        
                        // Create promise and SNS service object
                        console.log("Deleted Message[" + messageId + "]")
                        resolve(sqsMessageBody);
                    }
                });
            } else {
                reject("Queue Empty");
            }
        });

    })

}