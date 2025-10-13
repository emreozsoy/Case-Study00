const productsWrapper = document.getElementById('products-wrapper');
const loadingMessage = document.getElementById('loading-message');
const API_URL = 'http://localhost:5000/api/products'; 

/**
 * Converts popularity score into star icons and a text label.
 * @param {number} score - Popularity score out of 5 (e.g., 4.5)
 * @returns {string} HTML with stars and score text
 */
function renderPopularity(score) {
    const fullStars = Math.floor(score);
    const halfStar = score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHtml = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '★';
    }
    // Half star
    if (halfStar) {
        starsHtml += '⯪';
    }
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '☆';
    }

    return `
        <div class="popularity-score">
            ${starsHtml}
            <span class="score-text">${score}/5</span>
        </div>
    `;
}

/**
 * Generates a single product card’s HTML based on product data.
 * @param {object} product - Processed product data from backend
 * @param {number} index - Product index in list
 * @returns {string} HTML for the product card
 */
function createProductCard(product, index) {
    const colorOrder = ['yellow', 'white', 'rose']; 
    const defaultImage = product.images[colorOrder[0]]; 

    const colorOptionsHtml = colorOrder.map(color => {
        if (product.images[color]) {
            const colorClass = `${color}-gold`;
            const isActive = color === colorOrder[0] ? 'active' : '';

            return `
                <div 
                    class="color-option ${colorClass} ${isActive}" 
                    data-color="${color}" 
                    data-product-index="${index}">
                </div>
            `;
        }
        return '';
    }).join('');

    const popularityHtml = renderPopularity(product.popularityScoreOutOf5);

    return `
        <div class="product-card" data-product-index="${index}">
            <img class="product-image" id="image-${index}" src="${defaultImage}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)} USD</p>
                
                <div class="color-picker" id="picker-${index}">
                    ${colorOptionsHtml}
                </div>
                
                <p class="color-name">Yellow Gold</p>
                ${popularityHtml}
            </div>
        </div>
    `;
}

/**
 * Fetches product data from the API and renders cards to the page.
 */
async function fetchAndRenderProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const products = await response.json();

        loadingMessage.style.display = 'none';
        productsWrapper.innerHTML = '';

        products.forEach((product, index) => {
            const cardHtml = createProductCard(product, index);
            productsWrapper.innerHTML += cardHtml;
        });

        setupColorPickerListeners(products);

    } catch (error) {
        console.error('Error while fetching products:', error);
        loadingMessage.textContent = 'Failed to load products. Make sure the backend server is running.';
        loadingMessage.style.display = 'block';
    }
}

/**
 * Sets up color picker functionality for product cards.
 * @param {array} productsData - Original product data
 */
function setupColorPickerListeners(productsData) {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            const color = event.target.dataset.color;
            const index = event.target.dataset.productIndex;
            const product = productsData[index];

            const imageElement = document.getElementById(`image-${index}`);
            if (imageElement && product.images[color]) {
                imageElement.src = product.images[color];
            }

            const pickerContainer = event.target.closest('.color-picker');
            pickerContainer.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
            });

            event.target.classList.add('active');

            const colorNameElement = event.target.closest('.product-card').querySelector('.color-name');
            if (colorNameElement) {
                const name = color.charAt(0).toUpperCase() + color.slice(1);
                colorNameElement.textContent = name + ' Gold';
            }
        });
    });
}

/**
 * Enables carousel scrolling (for arrow buttons).
 */
function setupCarouselListeners() {
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const scrollAmount = 310;

    leftArrow.addEventListener('click', () => {
        productsWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    rightArrow.addEventListener('click', () => {
        productsWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderProducts();
    setupCarouselListeners();
});
