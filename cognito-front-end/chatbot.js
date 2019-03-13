


var container = document.getElementById("msgs_div");


var apigClient = apigClientFactory.newClient({
    accessKey: '',
    secretKey: '',
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
                <span class="time_date"> 11:01 AM | June 9</span>
                </div>
            </div>
            <div class="incoming_msg">
                <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
                </div>
                <div class="received_msg">
                <div class="received_withd_msg">
                    <p> ` + message.response + `</p>
                    <span class="time_date"> 11:01 AM | June 9</span>
                </div>
                </div>
            </div>
        </div>`;
    }
}
$("#msg_send_btn").click(function(){
    let query = document.getElementById("chatInput").value;
    callChatApi({ "userQuery": query });
});
