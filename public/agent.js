var logon_form = document.getElementById('logon-form');
var user_id = document.getElementById('user-id');
var user_name = document.getElementById('user-name');

logon_form.onsubmit = e => {
    e.preventDefault();
    logon_form.style.display = 'none';

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

