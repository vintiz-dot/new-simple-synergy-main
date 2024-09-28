// Price data for different courses
const prices = {
    ielts: { price: '80,000', currency: '₦' },
    sat: { price: '100,000', currency: '₦' },
    gre: { price: '100,000', currency: '₦' },
    gmat: { price: '120,000', currency: '₦' },
    toefl: { price: '90,000', currency: '₦' },
    pte: { price: '85,000', currency: '₦' },
};

// Function to dynamically update prices
function updatePrices() {
    // Get all elements with the class "price"
    const priceElements = document.getElementsByClassName('price');
    
    // Loop through all price elements
    Array.from(priceElements).forEach((element) => {
        const courseKey = element.getAttribute('data-price'); // Read the data-price attribute
        if (prices[courseKey]) {
            element.textContent = prices[courseKey].currency + prices[courseKey].price;
        }
    });
}

// Update prices after the DOM has loaded
document.addEventListener('DOMContentLoaded', updatePrices);
