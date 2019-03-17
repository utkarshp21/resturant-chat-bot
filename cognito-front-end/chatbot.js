
var container = document.getElementById("msgs_div");


function getUrlParameter() {
    var vars = {};
    
    window.location.href.replace(/[?#&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    
    return vars;
};

var id_token = getUrlParameter()["id_token"];

AWS.config.region = 'us-east-1';


AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:6b9ace6d-64d2-47de-9203-a12256de7ded',
    Logins: { // optional tokens, used for authenticated login
        'cognito-idp.us-east-1.amazonaws.com/us-east-1_M2CrGZrVx': id_token
    }
});



AWS.config.credentials.get(function () {
   
    AWS.config.region = 'us-east-1';
    apigClient = apigClientFactory.newClient({
        accessKey: AWS.config.credentials.accessKeyId,
        secretKey: AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken, 
        region: 'us-east-1'
    });

});


var messages = []

render();


function callChatApi(query) {
    apigClient.v1ChatbotPost({}, query, {})
        .then(function (result) {
            let msg = { query: query.userQuery, response: result.data["message"] }
            messages.push(msg)
            render();
        }).catch(function (result) {
            console.log(result);
    });
}

function render(){
    container.innerHTML = "";
    for (var i = 0; i < messages.length; i++) {
        let message = messages[i];
        container.innerHTML += `
        <div>
            <div class="outgoing_msg">
                <div class="sent_msg">
                <p>` + message.query + `</p>
                </div>
            </div>
            <div class="incoming_msg">
                <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
                </div>
                <div class="received_msg">
                <div class="received_withd_msg">
                    <p> ` + message.response + `</p>                   
                </div>
                </div>
            </div>
        </div>`;
    }
}
$("#msg_send_btn").click(function(){
    sendChatInputToApi();
});

$("#chatInput").keypress(function(event) {
    if (event.which == 13) {
        sendChatInputToApi();
     }
});

function sendChatInputToApi(){
    let chatInputBox = document.getElementById("chatInput")
    let query = chatInputBox.value;
    chatInputBox.value = "";
    callChatApi({ "userQuery": query });
}
