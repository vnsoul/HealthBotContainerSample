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
        input = document.querySelector('.wc-shellinput');
        input.value = message;
        event = new Event('change', { bubbles: true });
        event.simulated = true;
        input.dispatchEvent(event);
        document.querySelector(".wc-send").click();
    }