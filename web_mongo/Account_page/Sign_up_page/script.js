document.getElementById('sign-up-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const fullName = document.getElementById('full-name').value;
    const emailOrPhone = document.getElementById('email-num-input').value;
    const username = document.getElementById('account-name').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const birthday = document.getElementById('birthday').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;

    // Just to check if empty then throw notification
    checkEmpty();

    // Check to see if the email-num-input is valid or not
    if (!checkEmai_NumValidity()) {
        return; // End the function to not run the below code
    }

    if (password !== confirmPassword) {
        showNotification();
        document.getElementById('confirm-password').value = ''; // Reset the section
    } else {
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                fullName, 
                emailOrPhone, 
                username, 
                password, 
                birthday: new Date(birthday).toISOString(), 
                gender 
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.text();
        })
        .then(message => {
            alert(message);
        })
        .catch(error => {
            alert(error.message);
        });
    }
});

function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 2000); // Hide the notification after 2 seconds
}

function checkEmpty() {
    const emailInput = document.getElementById("email-num-input");
    const nameInput = document.getElementById("account-name");
    const passwordInput = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");

    // Custom validation messages
    emailInput.oninvalid = function () {
        this.setCustomValidity("Vui lòng điền email hoặc số điện thoại");
    };
    emailInput.oninput = function () {
        this.setCustomValidity("");
    };

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

    confirmPassword.oninvalid = function () {
        this.setCustomValidity("Vui lòng nhập lại mật khẩu");
    };
    confirmPassword.oninput = function () {
        this.setCustomValidity("");
    };
}

document.addEventListener("DOMContentLoaded", function () {
    checkEmpty();
});

function checkEmai_NumValidity() {     
    const email_num_input = document.getElementById('email-num-input').value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ;
    const numberPattern = /^\d{10}$/;

    if (emailPattern.test(email_num_input) || numberPattern.test(email_num_input)) {
        return true;
    } else {
        alert('Không phải email hay số điện thoại');
        return false;
    }
}





document.addEventListener('DOMContentLoaded', function () {
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const allOption = document.getElementById('all');
    const allLabel = document.querySelector('label[for="all"]');

    genderRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.checked && this.id !== 'all') {
                allOption.checked = false;
                allOption.style.display = 'none';
                allLabel.style.display = 'none';
            }
        });
    });

    if (!allOption.checked) {
        allOption.style.display = 'none';
        allLabel.style.display = 'none';
    }
});