"use strict";

// Element selectors
const privateClass = document.querySelector(".private-class");
const privateContainer = document.querySelector(".private-container");
const overlay = document.querySelector(".overlay");
const closeModal = document.querySelector(".close-modal");
const venue = document.getElementById("location");
const hourOfContacts = document.getElementById("hours");
const numberOfContacts = document.getElementById("contacts-week");
const privatePrice = document.getElementById("private-price");

// Static pricing
const coursePrices = {
  gmat: 130000,
  ielts: 80000,
  gre: 100000,
  sat: 100000,
};

// Set static course prices dynamically
Object.keys(coursePrices).forEach(course => {
  document.getElementById(`${course}-price`).textContent = coursePrices[course].toLocaleString();
});

// Hourly rates
const hourlyRates = {
  office: 8000,
  client: 10000,
};

// Function to calculate price based on user selections
function calculatePrice(hourlyRate, contacts, hours) {
  return hourlyRate * contacts * hours * 4; // Monthly price calculation
}

// Function to update personal class prices
function updatePersonalClassPrices() {
  const twoContactsPerWeek = 2;
  const threeContactsPerWeek = 3;
  const twoHoursPerClass = 2;

  // Dynamically calculate personal class prices
  document.getElementById("personal-class-2-price").textContent = calculatePrice(hourlyRates.office, twoContactsPerWeek, twoHoursPerClass).toLocaleString();
  document.getElementById("personal-class-3-price").textContent = calculatePrice(hourlyRates.client, twoContactsPerWeek, twoHoursPerClass).toLocaleString();
  document.getElementById("personal-class-4-price").textContent = calculatePrice(hourlyRates.office, threeContactsPerWeek, twoHoursPerClass).toLocaleString();
  document.getElementById("personal-class-5-price").textContent = calculatePrice(hourlyRates.client, threeContactsPerWeek, twoHoursPerClass).toLocaleString();
}

// Function to dynamically update pricing based on form selection
function updateDynamicPricing() {
  const locationValue = parseInt(venue.value);
  const contactsPerWeek = parseInt(numberOfContacts.value);
  const hoursPerClass = parseInt(hourOfContacts.value);

  if (locationValue && contactsPerWeek && hoursPerClass) {
    const pricePerHour = locationValue === 8 ? hourlyRates.office : hourlyRates.client;
    const totalPrice = calculatePrice(pricePerHour, contactsPerWeek, hoursPerClass);
    const formattedPrice = `<p style="margin: auto; font-size: 36px; color: #5fcf80; font-weight: 600; font-family: Poppins, sans-serif; margin-bottom: 20px;"><sup>₦</sup>${totalPrice.toLocaleString()}<span style="color: #777777; font-size: 16px; font-weight: 300;">/Month</span></p>`;
    
    privatePrice.innerHTML = formattedPrice;
  }
}

// Event listeners for modal and pricing update
document.addEventListener("DOMContentLoaded", () => {
  updatePersonalClassPrices(); // Initial pricing update

  venue.addEventListener("change", updateDynamicPricing);
  numberOfContacts.addEventListener("change", updateDynamicPricing);
  hourOfContacts.addEventListener("change", updateDynamicPricing);
});

privateClass.addEventListener("click", () => {
  toggleHidden();
  privateContainer.scrollIntoView({ block: "center", behavior: "auto", inline: "start" });
});

closeModal.addEventListener("click", toggleHidden);
overlay.addEventListener("click", toggleHidden);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
    toggleHidden();
  }
});

// Helper function to toggle modal visibility
function toggleHidden() {
  overlay.classList.toggle("hidden");
  privateContainer.classList.toggle("hidden");
}
