var logon_form = document.getElementById('logon-form');
var logon_title = document.getElementById('logon-title');

var user_id = document.getElementById('user-id');
var user_name = document.getElementById('user-name');

logon_form.onsubmit = e => {
    e.preventDefault();
    logon_form.style.display = 'none';
    logon_title.style.display = 'none';

    document.querySelector(".agent-buttons").classList.toggle("hidden")
    document.querySelector(".invisible").classList.toggle("invisible")

    var user = {
        id: user_id.value,
        name: user_name.value
    }

    chatRequested({
        userId: user_id.value,
        userName: user_name.value,
        agent: true
    });
}

function talk(message) {
    var input = document.getElementsByClassName("wc-shellinput")[0];
    var lastValue = input.value;
    input.value = message;
    var event = new CustomEvent('input', { bubbles: true });
    event.simulated = true;
    var tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
    document.querySelector(".wc-send").click();
}
