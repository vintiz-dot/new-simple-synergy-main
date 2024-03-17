"use strict";
const privateClass = document.querySelector(".private-class");
const privateContainer = document.querySelector(".private-container");
const overlay = document.querySelector(".overlay");
const closeModal = document.querySelector(".close-modal");
const header = document.getElementById("header");
const footer = document.getElementById("footer");
const callbtn = document.getElementById("call-us");
const venue = document.getElementById("location");
const hourOfContacts = document.getElementById("hours");
const numberOfContacts = document.getElementById("contacts-week");
const privatePrice = document.getElementById("private-price");

privateClass.addEventListener("click", function () {
  toggleHidden();
  privateContainer.scrollIntoView({
    block: "center",
    behavior: "auto",
    inline: "start",
  });
});

closeModal.addEventListener("click", toggleHidden);

overlay.addEventListener("click", toggleHidden);

document.addEventListener("keydown", function (X) {
  if (X.key != "Escape") return;
  if (overlay.classList.contains("hidden")) return;
  toggleHidden();
});

venue.addEventListener("change", privateCost);
hourOfContacts.addEventListener("change", privateCost);
numberOfContacts.addEventListener("change", privateCost);

function toggleHidden() {
  overlay.classList.toggle("hidden");
  privateContainer.classList.toggle("hidden");
}

function privateCost() {
  privatePrice.innerHTML = "";
  let price =
    4 * +venue.value * +hourOfContacts.value * +numberOfContacts.value;
  const htmlPrice = ` <p style="margin: auto;
font-size: 36px;
color: #5fcf80;
font-weight: 600;
font-family: Poppins, sans-serif;
margin-bottom: 20px;"><sup>₦</sup>${price},000<span style="
color: #777777;
font-size: 16px;
font-weight: 300;">/Month</span>`;
  if (price != 0) {
    privatePrice.insertAdjacentHTML("beforeend", htmlPrice);
  }
}
