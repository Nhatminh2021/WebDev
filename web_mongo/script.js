// Utility functions module
const utils = {
    // Function to get query parameter value by name
    getQueryParam: function(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
};

// DOM manipulation functions module
const domManipulation = {
    // Function to scroll to the top of the document
    scrollToTop: function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    },
    // Function to toggle the display style of an element
    toggleElementDisplay: function(element, displayStyle) {
        element.style.display = displayStyle;
    },
    // Function to add a class to an element
    addClass: function(element, className) {
        element.classList.add(className);
    },
    // Function to remove a class from an element
    removeClass: function(element, className) {
        element.classList.remove(className);
    },
    // Function to toggle the visibility of an element
    toggleVisibility: function(element) {
        if (element.style.display === 'none' || element.style.display === '') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }
};

// Event handling functions module
const eventHandlers = {
    // Function to add a click event listener to an element
    addClickListener: function(element, callback) {
        element.addEventListener('click', callback);
    },
    // Function to add a scroll event listener to the window
    addScrollListener: function(callback) {
        window.addEventListener('scroll', callback);
    },
    // Function to add a DOMContentLoaded event listener to the document
    addDOMContentLoadedListener: function(callback) {
        document.addEventListener('DOMContentLoaded', callback);
    },
    // Function to add a submit event listener to a form element
    addFormSubmitListener: function(formElement, callback) {
        formElement.addEventListener('submit', callback);
    }
};

// Slideshow functionality module
const slideshow = {
    // Function to initialize the slideshow
    initialize: function() {
        const productContainers = [...document.querySelectorAll('.product-container')];
        const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
        const preBtn = [...document.querySelectorAll('.pre-btn')];

        productContainers.forEach((item, i) => {
            let containerDimensions = item.getBoundingClientRect();
            let containerWidth = containerDimensions.width;

            nxtBtn[i].addEventListener('click', () => {
                item.scrollLeft += containerWidth;
            });

            preBtn[i].addEventListener('click', () => {
                item.scrollLeft -= containerWidth;
            });
        });
    }
};

// Shopping cart functionality module
const cart = {
    cartItems: [],
    // Function to add an item to the cart
    addToCart: function(item) {
        const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.totalPrice = existingItem.quantity * existingItem.price;
        } else {
            this.cartItems.push({ ...item, quantity: 1, totalPrice: item.price });
        }
        this.updateCart();
    },
    // Function to update the cart display
    updateCart: function() {
        const cartContainer = document.querySelector('.cart-content');
        cartContainer.innerHTML = '';

        this.cartItems.forEach(item => {
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

        document.querySelectorAll('.quantity-decrease').forEach(button => {
            button.addEventListener('click', this.handleQuantityDecrease.bind(this));
        });
        document.querySelectorAll('.quantity-increase').forEach(button => {
            button.addEventListener('click', this.handleQuantityIncrease.bind(this));
        });
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', this.handleQuantityChange.bind(this));
        });

        const cartTotal = this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
        document.querySelector('.total-till-now-right p').textContent = `${cartTotal.toLocaleString()} đ`;
    },
    // Function to handle quantity decrease button click
    handleQuantityDecrease: function(event) {
        const itemId = event.target.getAttribute('data-id');
        const item = this.cartItems.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity = Math.max(0, item.quantity - 1);
            item.totalPrice = item.quantity * item.price;
            this.updateCart();
        }
    },
    // Function to handle quantity increase button click
    handleQuantityIncrease: function(event) {
        const itemId = event.target.getAttribute('data-id');
        const item = this.cartItems.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity += 1;
            item.totalPrice = item.quantity * item.price;
            this.updateCart();
        }
    },
    // Function to handle quantity input change
    handleQuantityChange: function(event) {
        const itemId = event.target.getAttribute('data-id');
        const item = this.cartItems.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity = Math.max(0, parseInt(event.target.value, 10) || 0);
            item.totalPrice = item.quantity * item.price;
            this.updateCart();
        }
    }
};


// Main application logic
eventHandlers.addDOMContentLoadedListener(function() {
    // Check login success
    if (utils.getQueryParam('login') === 'success') {
        const msgDiv = document.getElementById('confirmation-msg');
        domManipulation.toggleElementDisplay(msgDiv, 'block');
        setTimeout(() => {
            domManipulation.toggleElementDisplay(msgDiv, 'none');
        }, 2000);
    }

    // Initialize slideshow
    slideshow.initialize();

    // Cart functionality
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        eventHandlers.addClickListener(button, function(event) {
            const itemElement = event.target.closest('.food');
            const item = {
                id: itemElement.getAttribute('data-id'),
                img: itemElement.querySelector('img').src,
                title: itemElement.querySelector('.food-info:first-child').textContent.trim(),
                price: parseFloat(itemElement.querySelector('.food-info:nth-child(2)').textContent.replace(' đ', '').replace('.', ''))
            };
            cart.addToCart(item);
        });
    });

    // Add event listeners for scroll and other events
    eventHandlers.addScrollListener(function() {
        let mybutton = document.getElementById("go-top-btn");
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            domManipulation.toggleElementDisplay(mybutton, "block");
        } else {
            domManipulation.toggleElementDisplay(mybutton, "none");
        }
    });

    // make sure the go-to-top Btn works properly
    const goTopBtn = document.getElementById('go-top-btn');
    eventHandlers.addClickListener(goTopBtn, domManipulation.scrollToTop);

    // Shrink header on scroll
    eventHandlers.addScrollListener(function() {
        const header = document.querySelector('.header');
        const storeRepresentation = document.querySelector('.store-representation');
        const navRightHeaders = document.querySelectorAll('.nav-right-header');
        const radioInputs = document.querySelector('.radio-inputs');
        const searchBtn = document.querySelector('#search-btn');
        const searchInput = document.querySelector('#searchInput');
        const icons = document.querySelectorAll('.icon');
        const radioNames = document.querySelectorAll('.radio .name');

        if (window.scrollY > 50) {
            domManipulation.addClass(header, 'shrink');
            domManipulation.addClass(header, 'small');
            domManipulation.addClass(storeRepresentation, 'shrink');
            navRightHeaders.forEach(el => domManipulation.addClass(el, 'shrink'));
            domManipulation.addClass(radioInputs, 'shrink');
            domManipulation.addClass(searchBtn, 'shrink');
            domManipulation.addClass(searchInput, 'shrink');
            icons.forEach(icon => domManipulation.addClass(icon, 'shrink'));
            radioNames.forEach(name => domManipulation.addClass(name, 'shrink'));
        } else {
            domManipulation.removeClass(header, 'shrink');
            domManipulation.removeClass(header, 'small');
            domManipulation.removeClass(storeRepresentation, 'shrink');
            navRightHeaders.forEach(el => domManipulation.removeClass(el, 'shrink'));
            domManipulation.removeClass(radioInputs, 'shrink');
            domManipulation.removeClass(searchBtn, 'shrink');
            domManipulation.removeClass(searchInput, 'shrink');
            icons.forEach(icon => domManipulation.removeClass(icon, 'shrink'));
            radioNames.forEach(name => domManipulation.removeClass(name, 'shrink'));
        }
    });

    // Email subscription validation
    eventHandlers.addFormSubmitListener(document.getElementById('emailForm'), function(event) {
        event.preventDefault();
        const email = document.getElementById('Email').value;
        const emailPattern = /^[a-zA-Z0-9]+@gmail\.com$/;

        if (emailPattern.test(email)) {
            alert('Cảm ơn đã theo dõi chúng tôi');
        } else {
            alert('Không phải email');
        }
    });

    // Send message to agent
    const button = document.querySelector('.btn');
    eventHandlers.addClickListener(button, function() {
        const message = document.getElementById('send-agent-msg').value.trim();
        if (message) {
            alert('Gửi thành công');
        } else {
            alert('Hãy nhập tin nhắn muốn gửi');
        }
    });

    // Search for items
    eventHandlers.addFormSubmitListener(document.getElementById('searchForm'), function(event) {
        event.preventDefault();
        const query = document.getElementById('searchInput').value.toLowerCase();
        const items = document.querySelectorAll('.content .food');
        let found = false;

        items.forEach(function(item) {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                found = true;
                item.scrollIntoView({ behavior: 'smooth', block: 'start' });
                item.style.backgroundColor = '#ffff99';
                setTimeout(() => {
                    item.style.backgroundColor = '';
                }, 2000);
            }
        });

        if (!found) {
            alert('Không có sản phẩm này');
        }
    });

    // Scroll effect on sub-content
    eventHandlers.addScrollListener(function() {
        const targetDivs = document.querySelectorAll('.sub-content');
        targetDivs.forEach(targetDiv => {
            const scrollPosition = window.scrollY;
            const targetHeight = targetDiv.offsetHeight;
            const halfwayPoint = targetDiv.offsetTop + (targetHeight / 2);
            if (scrollPosition > halfwayPoint) {
                targetDiv.style.opacity = '0.5';
            } else {
                targetDiv.style.opacity = '1';
            }
        });
    });

    // For the cart toggle
    eventHandlers.addClickListener(document.querySelector('.side-panel-toggle'), function() {
        document.querySelector('.side-panel').classList.toggle('open');
    });

    eventHandlers.addClickListener(document.querySelector('.side-panel-close'), function() {
        document.querySelector('.side-panel').classList.remove('open');
    });

    // Chat functionality
    const openChatBtn = document.getElementById('chat-btn');
    const chatPopup = document.getElementById('myForm');
    const hideChat = document.querySelector('.cancel');

    eventHandlers.addClickListener(openChatBtn, function() {
        domManipulation.toggleVisibility(chatPopup);
    });

    eventHandlers.addClickListener(hideChat, function() {
        domManipulation.toggleVisibility(chatPopup);
    });


    const cartPanelBtn = document.querySelector('.side-panel-toggle');
    const cartPanel = document.querySelector('.hidden-cart-panel');
    const closeCartBtn = document.querySelector('.side-panel-close');
    eventHandlers.addClickListener(cartPanelBtn, function() {
        domManipulation.addClass(cartPanel, 'open');
    });
    eventHandlers.addClickListener(closeCartBtn, function() {
        domManipulation.removeClass(cartPanel, 'open');
    })
});