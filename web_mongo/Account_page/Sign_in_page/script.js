document.getElementById('sign-in-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('account-name').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => { throw new Error(data.message) });
        }
        return response.json();
    })
    .then(data => {
        window.location.href = data.redirectUrl;
    })
    .catch(error => {
        alert(error.message);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("account-name");
    const passwordInput = document.getElementById("password");

    // Custom validation messages
    nameInput.oninvalid = function () {
        this.setCustomValidity("Vui lòng điền tên tài khoản");
    };
    nameInput.oninput = function () {
        this.setCustomValidity("");
    };

    passwordInput.oninvalid = function () {
        this.setCustomValidity("Vui lòng nhập mật khẩu");
    };
    passwordInput.oninput = function () {
        this.setCustomValidity("");
    };
});
