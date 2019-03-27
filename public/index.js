function requestChatBot(info, loc) {
    const params = BotChat.queryParams(location.search);
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", initBotConversation);
    var path = "/chatBot";
    var userName = (info && info.userName) || params["userName"] || "You";
    path += "?userName=" + userName;
    var userId = (info && info.userId) || params["userId"];
    if (userId) {
        path += "&userId=" + userId;        
    }
    if (info && info.agent) {
        path += "&agent=true";
    }
    if (loc) {
        path += "&lat=" + loc.lat + "&long=" + loc.long;
    }
    oReq.open("GET", path);
    oReq.send();
}

function chatRequested(info) {
    const params = BotChat.queryParams(location.search);
    var shareLocation = params["shareLocation"];
    if (shareLocation) {
        getUserLocation(info, requestChatBot);
    }
    else {
        requestChatBot(info);
    }
}

function getUserLocation(info, callback) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            var latitude  = position.coords.latitude;
            var longitude = position.coords.longitude;
            var location = {
                lat: latitude,
                long: longitude
            }
            callback(info, location);
        },
        function(error) {
            // user declined to share location
            console.log("location error:" + error.message);
            callback(info);
        });
}

function sendUserLocation(botConnection, user) {
    getUserLocation(null, function (info, location) {
        botConnection.postActivity({type: "message", text: JSON.stringify(location), from: user}).subscribe(function (id) {console.log("success")});
    });
}

function initBotConversation() {
    if (this.status >= 400) {
        alert(this.statusText);
        return;
    }
    // extract the data from the JWT
    const jsonWebToken = this.response;
    const tokenPayload = JSON.parse(atob(jsonWebToken.split('.')[1]));
    const user = {
        id: tokenPayload.userId,
        name: tokenPayload.userName
    };
    let domain = undefined;
    if (tokenPayload.directLineURI) {
        domain =  "https://" +  tokenPayload.directLineURI + "/v3/directline";
    }
    const botConnection = new BotChat.DirectLine({
        token: tokenPayload.connectorToken,
        domain,
        webSocket: true
    });
    startChat(user, botConnection);
    botConnection.postActivity({type: "event", value: jsonWebToken, from: user, name: "InitAuthenticatedConversation"}).subscribe(function (id) {});
    botConnection.activity$
        .filter(function (activity) {return activity.type === "event" && activity.name === "shareLocation"})
        .subscribe(function (activity) {sendUserLocation(botConnection, user)});
}

function startChat(user, botConnection) {
    const botContainer = document.getElementById('botContainer');
    botContainer.classList.add("wc-display");

    BotChat.App({
        botConnection: botConnection,
        user: user,
        locale: 'en',
        resize: 'detect'
        // sendTyping: true,    // defaults to false. set to true to send 'typing' activities to bot (and other users) when user is typing
    }, botContainer);
}