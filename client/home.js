const token = JSON.parse(localStorage.getItem("token"));

if (!token && !token?.access_token) {
    window.location.href = 'index.html';
}

let nextButton = document.getElementById('next');
let prevButton = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let listHTML = document.querySelector('.carousel .list');
let backButton = document.getElementById('back');

nextButton.onclick = function () {
    showSlider('next');
}
prevButton.onclick = function () {
    showSlider('prev');
}
let unAcceppClick;
const showSlider = (type) => {
    nextButton.style.pointerEvents = 'none';
    prevButton.style.pointerEvents = 'none';

    carousel.classList.remove('next', 'prev');
    let items = document.querySelectorAll('.carousel .list .item');
    if (type === 'next') {
        listHTML.appendChild(items[0]);
        carousel.classList.add('next');
    } else {
        listHTML.prepend(items[items.length - 1]);
        carousel.classList.add('prev');
    }
    clearTimeout(unAcceppClick);
    unAcceppClick = setTimeout(() => {
        nextButton.style.pointerEvents = 'auto';
        prevButton.style.pointerEvents = 'auto';
    }, 2000)
}
backButton.onclick = function () {
    carousel.classList.remove('showDetail');
}

document.querySelector('.logo').addEventListener('click', () => {
    window.location.href = 'home.html';
});

document.getElementById('logoutLink').addEventListener('click', function (event) {
    event.preventDefault();
    localStorage.setItem("token", JSON.stringify({}));
    window.location.href = 'index.html';
});

const orderNow = async (event, _id, name, price, image) => {
    event.preventDefault();

    const orderData = {
        _id,
        name,
        price,
        image
    }

    try {
        const response = await fetch("https://galaxystore.onrender.com/api/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.access_token}`,
            },
            body: JSON.stringify(orderData),
        });

        if (response.ok) {
            window.alert("Order Successful! Thank you for your purchase.");
        } else {
            window.alert("Order Failed! There was an issue with your purchase.");
        }
    } catch (error) {
        console.error("Error sending order:", error);
    }
}

const showProductContainer = (products) => {
    const productContainer = document.querySelector("#productContainer");

    if (!products || !productContainer) {
        return false;
    }

    products.forEach((product) => {
        const { _id, name, price, description, processor, memory, camera, display, storage, image } = product;

        const brand = name.split(" ").slice(0, 1).join(" ");
        const productTemplate = document.querySelector("#productTemplate");
        const productClone = document.importNode(productTemplate.content, true);
        productClone.querySelector("#cardValue").setAttribute("id", `card${_id}`);
        productClone.querySelector(".productImage").src = image;
        productClone.querySelector(".productImage").alt = name;
        productClone.querySelector(".title").textContent = name;
        productClone.querySelector(".topic").textContent = brand;
        productClone.querySelector(".des").textContent = description;
        productClone.querySelector(".detail-title").textContent = name;
        productClone.querySelector(".detail-desc").textContent = description;
        productClone.querySelector(".processor").textContent = processor;
        productClone.querySelector(".memory").textContent = memory;
        productClone.querySelector(".camera").textContent = camera;
        productClone.querySelector(".display").textContent = display;
        productClone.querySelector(".storage").textContent = storage;
        productClone.querySelector(".price").textContent = `₹${price}`;
        productClone.querySelector(".seeMore").addEventListener("click", () => {
            carousel.classList.remove('next', 'prev');
            carousel.classList.add('showDetail');
        });
        productClone.querySelector(".productImage").addEventListener("click", () => {
            carousel.classList.remove('next', 'prev');
            carousel.classList.add('showDetail');
        });
        productClone.querySelector(".order").addEventListener("click", (event) => {
            orderNow(event, _id, name, price, image);
        });

        productContainer.appendChild(productClone);
    });
};

async function fetchProducts() {
    try {
        const response = await fetch('https://galaxystore.onrender.com/api/products');
        const products = await response.json();
        showProductContainer(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});