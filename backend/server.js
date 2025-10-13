
// Required Modules
const express = require('express');
const axios = require('axios'); 
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

const GOLDAPI_KEY = process.env.GOLDAPI_KEY || 'goldapi-3szmoxgsmgnsjy3b-io'; 
const PRODUCTS_FILE = 'products.json';
const BACKUP_PRICE = 65.0; // Backup price (USD/Gram)
const CACHE_TTL_MINUTES = 15; // CACHE DURATION: Update price every 15 minutes

// Cache variables to store the latest gold price for 15 minutes
let cachedGoldPrice = null;
let lastFetchTime = 0;

app.use(cors());
app.use(express.json());

/**
 * Fetches the latest gold gram price from GoldAPI.io or returns the cached one.
 * Maintains price stability by reusing the same value for 15 minutes.
 */
async function getGoldPrice() {
    const now = Date.now();
    const CACHE_TTL_MS = CACHE_TTL_MINUTES * 60 * 1000;

    // Use cached gold price if still valid
    if (cachedGoldPrice !== null && (now - lastFetchTime) < CACHE_TTL_MS) {
        console.log(`[CACHE HIT] ${Math.ceil((CACHE_TTL_MS - (now - lastFetchTime)) / 60000)} min left.`);
        return cachedGoldPrice;
    }

    // Cache expired, fetch a new gold price
    console.log(`[LIVE FETCH] Fetching live gold price...`);
    const GOLDAPI_URL = 'https://www.goldapi.io/api/XAU/USD'; 
    const headers = { 'x-access-token': GOLDAPI_KEY };
    
    try {
        const response = await axios.get(GOLDAPI_URL, { headers });
        const data = response.data;
        
        // Get the price per gram (prefer 24K if available)
        const pricePerGram = data.price_gram_24k || data.price_gram_22K; 
        
        if (pricePerGram) {
            // Store in cache and update timestamp
            cachedGoldPrice = parseFloat(pricePerGram);
            lastFetchTime = now;
            console.log(`Live GoldAPI price cached: $${cachedGoldPrice} per gram`);
            return cachedGoldPrice;
        }

    } catch (error) {
        console.error(`GoldAPI Fetch Error: ${error.message}. Status Code: ${error.response?.status}`);
    }

    // Fallback 1: Use last cached value if API failed
    if (cachedGoldPrice !== null) {
        console.warn(`Live fetch failed. Using last cached price ($${cachedGoldPrice}).`);
        return cachedGoldPrice;
    }

    // Fallback 2: Use fixed backup price if cache is empty
    console.warn(`API connection failed. Using backup price ($${BACKUP_PRICE} USD/Gram).`);
    return BACKUP_PRICE;
}

// ---------------------------------------------
// PRICE AND POPULARITY CALCULATION FUNCTIONS
// ---------------------------------------------

/**
 * Price = (popularityScore + 1) * weight * goldPrice
 */
function calculatePrice(popularityScore, weight, goldPrice) {
    const price = (popularityScore + 1) * weight * goldPrice; 
    return parseFloat(price.toFixed(2));
}

/**
 * Converts popularity score from 0–1 scale to 0–5 scale (1 decimal place).
 */
function convertPopularityScore(score) {
    return parseFloat((score * 5).toFixed(1));
}

// ---------------------------------------------
// RESTful API ROUTE: /api/products
// ---------------------------------------------

app.get('/api/products', async (req, res) => {
    try {
        // 1. Fetch stable gold price (from cache or live)
        const goldPrice = await getGoldPrice(); 
        
        // 2. Load product data from file
        const rawData = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
        const rawProducts = JSON.parse(rawData);

        // 3. Process data and calculate prices
        const processedProducts = rawProducts.map(product => {
            
            // Dynamic price calculation
            const price = calculatePrice(product.popularityScore, product.weight, goldPrice);
            
            // Convert popularity score
            const scoreOutOfFive = convertPopularityScore(product.popularityScore);

            return {
                ...product,
                price: price, 
                popularityScoreOutOf5: scoreOutOfFive
            };
        });

        // 4. Send processed data as JSON
        res.json(processedProducts);
    } catch (error) {
        console.error("API Processing Error:", error);
        res.status(500).json({ error: "Server error, failed to load products." });
    }
});

// ---------------------------------------------
// START SERVER
// ---------------------------------------------

app.listen(PORT, () => {
    console.log(`✅ Backend Server Running!`);
    console.log(`Listening on: http://localhost:${PORT}`);
    console.log(`API Endpoint: http://localhost:${PORT}/api/products`);
});
