// Function to get query parameter value by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Check if login was successful
function checkLoginSuccess() {
    if (getQueryParam('login') === 'success') {
        const msgDiv = document.getElementById('confirmation-msg');
        msgDiv.style.display = 'block'; // Show the confirmation message

        // Hide the confirmation message after 2 seconds
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 2000);
    }
}

// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    checkLoginSuccess();

    // this is when scroll down 50px, the event will activate, adding "small"
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        const storeRepresentation = document.querySelector('.store-representation');
        const navRightHeaders = document.querySelectorAll('.nav-right-header');
        const radioInputs = document.querySelector('.radio-inputs');
        const searchBtn = document.querySelector('#search-btn');
        const searchInput = document.querySelector('#searchInput');
        const icons = document.querySelectorAll('.icon');
        const radioNames = document.querySelectorAll('.radio .name');

        if (window.scrollY > 50) {
            header.classList.add('shrink');
            header.classList.add('small');
            storeRepresentation.classList.add('shrink');
            navRightHeaders.forEach(el => el.classList.add('shrink'));
            radioInputs.classList.add('shrink');
            searchBtn.classList.add('shrink');
            searchInput.classList.add('shrink');
            icons.forEach(icon => icon.classList.add('shrink'));
            radioNames.forEach(name => name.classList.add('shrink'));
        } else {
            header.classList.remove('shrink');
            header.classList.remove('small');
            storeRepresentation.classList.remove('shrink');
            navRightHeaders.forEach(el => el.classList.remove('shrink'));
            radioInputs.classList.remove('shrink');
            searchBtn.classList.remove('shrink');
            searchInput.classList.remove('shrink');
            icons.forEach(icon => icon.classList.remove('shrink'));
            radioNames.forEach(name => name.classList.remove('shrink'));
        }
    });

    // this part is for the chat btn
    function openForm() {
        document.getElementById("myForm").style.display = "block";
    }

    function closeForm() {
        document.getElementById("myForm").style.display = "none";
    }

    // this part is for the btn that appears when we scroll down to go back to the top
    let mybutton = document.getElementById("go-top-btn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    // about the slide show of the product
    const productContainers = [...document.querySelectorAll('.product-container')];
    const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
    const preBtn = [...document.querySelectorAll('.pre-btn')];

    productContainers.forEach((item, i) => {
        let containerDimensions = item.getBoundingClientRect();
        let containerWidth = containerDimensions.width;

        nxtBtn[i].addEventListener('click', () => {
            item.scrollLeft += containerWidth;
        })

        preBtn[i].addEventListener('click', () => {
            item.scrollLeft -= containerWidth;
        })
    })

    // for the cart
    document.querySelector('.side-panel-toggle').addEventListener('click', function() {
        document.querySelector('.side-panel').classList.toggle('open');
    });

    document.querySelector('.side-panel-close').addEventListener('click', function() {
        document.querySelector('.side-panel').classList.remove('open');
    });

    // check if the value that subscribe is an email or not
    document.getElementById('emailForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('Email').value;
        const emailPattern = /^[a-zA-Z0-9]+@gmail\.com$/;

        if (emailPattern.test(email)) {
            alert('Cảm ơn đã theo dõi chúng tôi');
        } else {
            alert('Không phải email');
        }
    });

    // send successful msg when send to an agent successfully
    const button = document.querySelector('.btn');
    button.addEventListener('click', () => {
        const message = document.getElementById('send-agent-msg').value.trim();
        if (message) {
            alert('Gửi thành công');
        } else {
            alert('Hãy nhập tin nhắn muốn gửi');
        }
    });

    // to search for items
    document.getElementById('searchForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        const query = document.getElementById('searchInput').value.toLowerCase();
        const items = document.querySelectorAll('.content .food');

        let found = false;
        items.forEach(function (item) {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                found = true;
                item.scrollIntoView({ behavior: 'smooth', block: 'start' });
                item.style.backgroundColor = '#ffff99'; // Highlight the item
                setTimeout(() => {
                    item.style.backgroundColor = ''; // Remove the highlight after a while
                }, 2000);
            }
        });

        if (!found) {
            alert('Không có sản phẩm này');
        }
    });

    document.addEventListener('scroll', function() {
        const targetDivs = document.querySelectorAll('.sub-content');

        targetDivs.forEach(targetDiv => {
            const scrollPosition = window.scrollY;
            const targetHeight = targetDiv.offsetHeight;
            const halfwayPoint = targetDiv.offsetTop + (targetHeight / 2);
            if (scrollPosition > halfwayPoint) {
                targetDiv.style.opacity = '0.5'; // Change background opacity
            } else {
                targetDiv.style.opacity = '1'; // Restore original background opacity
            }
        });
    });
});







////////////////////////// code for add items to cart
let cartItems = [];

document.addEventListener('DOMContentLoaded', function () {
    // Add to Cart button click event listener
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function (event) {
            const itemElement = event.target.closest('.food');
            const item = {
                id: itemElement.getAttribute('data-id'),
                img: itemElement.querySelector('img').src,
                title: itemElement.querySelector('.food-info:first-child').textContent.trim(),
                price: parseFloat(itemElement.querySelector('.food-info:nth-child(2)').textContent.replace(' đ', '').replace('.', ''))
            };
            addToCart(item);
        });
    });

    function addToCart(item) {
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.totalPrice = existingItem.quantity * existingItem.price;
        } else {
            cartItems.push({ ...item, quantity: 1, totalPrice: item.price });
        }
        updateCart();
    }

    function updateCart() {
        const cartContainer = document.querySelector('.cart-content');
        cartContainer.innerHTML = '';

        cartItems.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-decrease" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" class="quantity-input" data-id="${item.id}">
                        <button class="quantity-increase" data-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-price">${item.totalPrice.toLocaleString()} đ</div>
                </div>
            `;
            cartContainer.appendChild(cartItemElement);
        });

        // Add event listeners for quantity buttons and input changes
        document.querySelectorAll('.quantity-decrease').forEach(button => {
            button.addEventListener('click', handleQuantityDecrease);
        });
        document.querySelectorAll('.quantity-increase').forEach(button => {
            button.addEventListener('click', handleQuantityIncrease);
        });
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', handleQuantityChange);
        });

        const cartTotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
        document.querySelector('.total-till-now-right p').textContent = `${cartTotal.toLocaleString()} đ`;
    }

    function handleQuantityDecrease(event) {
        const itemId = event.target.getAttribute('data-id');
        const item = cartItems.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity = Math.max(0, item.quantity - 1); // Ensure quantity does not go below 0
            item.totalPrice = item.quantity * item.price;
            updateCart();
        }
    }

    function handleQuantityIncrease(event) {
        const itemId = event.target.getAttribute('data-id');
        const item = cartItems.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity += 1;
            item.totalPrice = item.quantity * item.price;
            updateCart();
        }
    }

    function handleQuantityChange(event) {
        const itemId = event.target.getAttribute('data-id');
        const item = cartItems.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity = Math.max(0, parseInt(event.target.value, 10) || 0); // Ensure quantity does not go below 0
            item.totalPrice = item.quantity * item.price;
            updateCart();
        }
    }
});
