"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // --- Dynamic Group Class Pricing ---

  // Check that the dynamic pricing module is available.
  if (window.pricesModule && window.pricesModule.classFees && window.pricesModule.classFees.groupClass) {
    const groupClassFees = window.pricesModule.classFees.groupClass;

    // Update the group class prices dynamically.
    const updateGroupPrice = (elementId, feeKey) => {
      const elem = document.getElementById(elementId);
      if (elem && groupClassFees[feeKey] !== undefined) {
        elem.textContent = groupClassFees[feeKey].toLocaleString();
      }
    };

    // Assuming your HTML elements have the following IDs:
    updateGroupPrice("gmat-price", "GMAT");
    updateGroupPrice("ielts-price", "IELTS");
    updateGroupPrice("gre-price", "GRE");
    updateGroupPrice("sat-price", "SAT");
    // If you have TOEFL and PTE group classes, add:
    // updateGroupPrice("toefl-price", "TOEFL");
    // updateGroupPrice("pte-price", "PTE");
  } else {
    console.error("Dynamic pricing data is not available.");
  }

  // --- Private Class Pricing & Modal Functionality ---

  // Element selectors for private class pricing and modal
  const privateClass = document.querySelector(".private-class");
  const privateContainer = document.querySelector(".private-container");
  const overlay = document.querySelector(".overlay");
  const closeModal = document.querySelector(".close-modal");
  const venue = document.getElementById("location");
  const hourOfContacts = document.getElementById("hours");
  const numberOfContacts = document.getElementById("contacts-week");
  const privatePrice = document.getElementById("private-price");

  // Hourly rates (these remain static)
  const hourlyRates = {
    office: 8000,
    client: 10000,
  };

  // Function to calculate price based on user selections
  function calculatePrice(hourlyRate, contacts, hours) {
    return hourlyRate * contacts * hours * 4; // Monthly price calculation
  }

  // Function to update default personal class prices
  function updatePersonalClassPrices() {
    const twoContactsPerWeek = 2;
    const threeContactsPerWeek = 3;
    const twoHoursPerClass = 2;

    const pc2 = document.getElementById("personal-class-2-price");
    if (pc2) {
      pc2.textContent = calculatePrice(hourlyRates.office, twoContactsPerWeek, twoHoursPerClass).toLocaleString();
    }
    const pc3 = document.getElementById("personal-class-3-price");
    if (pc3) {
      pc3.textContent = calculatePrice(hourlyRates.client, twoContactsPerWeek, twoHoursPerClass).toLocaleString();
    }
    const pc4 = document.getElementById("personal-class-4-price");
    if (pc4) {
      pc4.textContent = calculatePrice(hourlyRates.office, threeContactsPerWeek, twoHoursPerClass).toLocaleString();
    }
    const pc5 = document.getElementById("personal-class-5-price");
    if (pc5) {
      pc5.textContent = calculatePrice(hourlyRates.client, threeContactsPerWeek, twoHoursPerClass).toLocaleString();
    }
  }

  // Function to update pricing based on private class form selections
  function updateDynamicPricing() {
    const locationValue = parseInt(venue.value);
    const contactsPerWeek = parseInt(numberOfContacts.value);
    const hoursPerClass = parseInt(hourOfContacts.value);

    if (locationValue && contactsPerWeek && hoursPerClass && privatePrice) {
      const pricePerHour = locationValue === 8 ? hourlyRates.office : hourlyRates.client;
      const totalPrice = calculatePrice(pricePerHour, contactsPerWeek, hoursPerClass);
      const formattedPrice = `
        <p style="margin: auto; font-size: 36px; color: #5fcf80; font-weight: 600; font-family: Poppins, sans-serif; margin-bottom: 20px;">
          <sup>₦</sup>${totalPrice.toLocaleString()}<span style="color: #777777; font-size: 16px; font-weight: 300;">/Month</span>
        </p>`;
      privatePrice.innerHTML = formattedPrice;
    }
  }

  // Update default personal class pricing
  updatePersonalClassPrices();

  // Add event listeners for the private class form if the elements exist
  if (venue) {
    venue.addEventListener("change", updateDynamicPricing);
  }
  if (numberOfContacts) {
    numberOfContacts.addEventListener("change", updateDynamicPricing);
  }
  if (hourOfContacts) {
    hourOfContacts.addEventListener("change", updateDynamicPricing);
  }

  // Modal functionality for private classes
  if (privateClass) {
    privateClass.addEventListener("click", () => {
      toggleHidden();
      if (privateContainer) {
        privateContainer.scrollIntoView({
          block: "center",
          behavior: "auto",
          inline: "start",
        });
      }
    });
  }
  if (closeModal) {
    closeModal.addEventListener("click", toggleHidden);
  }
  if (overlay) {
    overlay.addEventListener("click", toggleHidden);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && !overlay.classList.contains("hidden")) {
      toggleHidden();
    }
  });

  // Helper function to toggle modal visibility
  function toggleHidden() {
    if (overlay) overlay.classList.toggle("hidden");
    if (privateContainer) privateContainer.classList.toggle("hidden");
  }
});
