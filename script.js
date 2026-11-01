document.addEventListener("DOMContentLoaded", function () {
// Update the copyright year.
document.querySelectorAll(".current-year").forEach(function (element) {
element.textContent = new Date().getFullYear();
});

// Open and close the information accordions.
document.querySelectorAll(".accordion-button").forEach(function (button) {
button.addEventListener("click", function () {
const content = button.parentElement.nextElementSibling;
const isExpanded = button.getAttribute("aria-expanded") === "true";

button.setAttribute("aria-expanded", String(!isExpanded));
content.hidden = isExpanded;
});
});

// Open a gallery image in the lightbox.
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");

document.querySelectorAll("[data-lightbox]").forEach(function (button) {
button.addEventListener("click", function () {
if (!lightbox || !lightboxImage) {
return;
}

const imagePath = button.getAttribute("data-lightbox");
const thumbnail = button.querySelector("img");

lightboxImage.src = imagePath;
lightboxImage.alt = thumbnail ? thumbnail.alt : "Enlarged gallery image";
lightbox.classList.add("open");
lightbox.setAttribute("aria-hidden", "false");

if (lightboxClose) {
lightboxClose.focus();
}
});
});

function closeLightbox() {
if (!lightbox || !lightboxImage) {
return;
}

lightbox.classList.remove("open");
lightbox.setAttribute("aria-hidden", "true");
lightboxImage.src = "";
lightboxImage.alt = "";
}

if (lightboxClose) {
lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
lightbox.addEventListener("click", function (event) {
if (event.target === lightbox) {
closeLightbox();
}
});
}

document.addEventListener("keydown", function (event) {
if (event.key === "Escape") {
closeLightbox();
}
});

// Search the services and information cards.
const serviceSearch = document.getElementById("service-search");
const serviceCards = document.querySelectorAll(".searchable-card");
const serviceEmpty = document.getElementById("service-empty");

if (serviceSearch) {
serviceSearch.addEventListener("input", function () {
const searchTerm = serviceSearch.value.toLowerCase().trim();
let visibleCount = 0;

serviceCards.forEach(function (card) {
const searchableText =
(card.textContent + " " + (card.dataset.search || "")).toLowerCase();
const matches = searchableText.includes(searchTerm);

card.hidden = !matches;

if (matches) {
visibleCount++;
}
});

if (serviceEmpty) {
serviceEmpty.hidden = visibleCount !== 0;
}
});
}

// Search, filter and sort the demonstration news articles.
const newsSearch = document.getElementById("news-search");
const newsCategory = document.getElementById("news-category");
const newsSort = document.getElementById("news-sort");
const newsList = document.getElementById("news-list");
const newsEmpty = document.getElementById("news-empty");

if (newsList && newsSearch && newsCategory && newsSort) {
const newsCards = Array.from(
newsList.querySelectorAll(".news-card")
);

function updateNews() {
const searchTerm = newsSearch.value.toLowerCase().trim();
const category = newsCategory.value;
let visibleCount = 0;

newsCards.forEach(function (card) {
const searchableText =
(card.textContent + " " + (card.dataset.search || "")).toLowerCase();

const matchesText = searchableText.includes(searchTerm);
const matchesCategory =
category === "all" || card.dataset.category === category;

card.hidden = !(matchesText && matchesCategory);

if (!card.hidden) {
visibleCount++;
}
});

const sortedCards = newsCards.slice();

if (newsSort.value === "newest") {
sortedCards.sort(function (a, b) {
return b.dataset.date.localeCompare(a.dataset.date);
});
} else if (newsSort.value === "oldest") {
sortedCards.sort(function (a, b) {
return a.dataset.date.localeCompare(b.dataset.date);
});
} else {
sortedCards.sort(function (a, b) {
const titleA = a.querySelector("h2").textContent.toLowerCase();
const titleB = b.querySelector("h2").textContent.toLowerCase();

return titleA.localeCompare(titleB);
});
}

sortedCards.forEach(function (card) {
newsList.appendChild(card);
});

if (newsEmpty) {
newsEmpty.hidden = visibleCount !== 0;
}
}

newsSearch.addEventListener("input", updateNews);
newsCategory.addEventListener("change", updateNews);
newsSort.addEventListener("change", updateNews);

updateNews();
}

// Provide a relevant on-page response for an enquiry.
const enquiryForm = document.getElementById("enquiry-form");
const enquiryResponse = document.getElementById("enquiry-response");

if (enquiryForm && enquiryResponse) {
enquiryForm.addEventListener("submit", function (event) {
event.preventDefault();

if (!enquiryForm.checkValidity()) {
enquiryForm.reportValidity();
return;
}

const name = document.getElementById("enquiry-name").value.trim();
const type = document.getElementById("enquiry-type").value;
const message = document.getElementById("enquiry-message").value.trim();

const responses = {
services:
"You selected animal welfare information. Review the Services page for general information. Official service availability must be confirmed through official channels.",
volunteering:
"You selected volunteering. Review the Volunteer page and confirm current opportunities and requirements through official channels.",
sponsorship:
"You selected sponsorship or donations. Check official donation details before sending money or personal information.",
other:
"Thank you for your enquiry. Review your information and use the Contact page if you want to prepare an email."
};

const responseText =
responses[type] || "Thank you for your enquiry.";

enquiryResponse.replaceChildren();

const heading = document.createElement("h2");
heading.textContent = "Enquiry reviewed";

const greeting = document.createElement("p");
greeting.textContent = "Thank you, " + name + ".";

const response = document.createElement("p");
response.textContent = responseText;

const summary = document.createElement("p");
summary.textContent =
"Your message contains " + message.length + " characters. " +
"This demonstration does not send or store your details.";

enquiryResponse.append(heading, greeting, response, summary);
enquiryResponse.hidden = false;
});
}

// Validate the contact form and prepare an email in the user's email app.
const contactForm = document.getElementById("contact-form");
const contactResponse = document.getElementById("contact-response");

if (contactForm && contactResponse) {
contactForm.addEventListener("submit", function (event) {
event.preventDefault();

if (!contactForm.checkValidity()) {
contactForm.reportValidity();
return;
}

const name = document.getElementById("contact-name").value.trim();
const email = document.getElementById("contact-email").value.trim();
const type = document.getElementById("contact-type").value;
const message = document.getElementById("contact-message").value.trim();

// Replace this with the verified recipient email address.
const recipient = "info@nspca.co.za";
const subject = "Website message: " + type;

const body =
"Name: " + name + "\n" +
"Email: " + email + "\n" +
"Message type: " + type + "\n\n" +
"Message:\n" + message;

const mailtoLink =
"mailto:" + recipient +
"?subject=" + encodeURIComponent(subject) +
"&body=" + encodeURIComponent(body);

contactResponse.replaceChildren();

const paragraph = document.createElement("p");
paragraph.textContent =
"Your message has been validated. Select the link below to " +
"open your email application. The message has not been sent yet.";

const emailLink = document.createElement("a");
emailLink.href = mailtoLink;
emailLink.textContent = "Open email application";
emailLink.className = "button";

contactResponse.append(paragraph, emailLink);
contactResponse.hidden = false;
});
}

// Initialise the Leaflet map when the library and map element are available.
const mapElement = document.getElementById("contact-map");

if (mapElement && window.L) {
const map = L.map("contact-map").setView([-26.2041, 28.0473], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
attribution: "&copy; OpenStreetMap contributors",
maxZoom: 19
}).addTo(map);

L.marker([-26.2041, 28.0473])
.addTo(map)
.bindPopup("General Johannesburg map reference point");
} else if (mapElement) {
mapElement.textContent =
"The map could not load. Check your internet connection and try again.";
}
});

// Donation amount selection
const donationCards = document.querySelectorAll(".donation-card");
const customAmount = document.querySelector("#custom-amount");
const selectedAmount = document.querySelector("#selected-amount");
const donationForm = document.querySelector("#donation-form");
const donationMessage = document.querySelector("#donation-message");

let currentAmount = 0;

function updateDonationAmount(amount) {
currentAmount = amount;
selectedAmount.textContent =
"R" + amount.toLocaleString("en-ZA");

donationCards.forEach(function (card) {
const isSelected = Number(card.dataset.amount) === amount;

card.classList.toggle("selected", isSelected);
card.setAttribute("aria-pressed", String(isSelected));
});

if (customAmount.value !== String(amount)) {
customAmount.value = amount > 0 ? amount : "";
}

donationMessage.textContent = amount > 0
? "Your selected amount is R" + amount.toLocaleString("en-ZA") + "."
: "Choose an amount to get started.";
}

donationCards.forEach(function (card) {
card.setAttribute("aria-pressed", "false");

card.addEventListener("click", function () {
updateDonationAmount(Number(card.dataset.amount));
});
});

customAmount.addEventListener("input", function () {
const amount = Number(customAmount.value);

currentAmount = Number.isFinite(amount) && amount > 0
? amount
: 0;

selectedAmount.textContent =
"R" + currentAmount.toLocaleString("en-ZA");

donationCards.forEach(function (card) {
const isSelected =
Number(card.dataset.amount) === currentAmount;

card.classList.toggle("selected", isSelected);
card.setAttribute("aria-pressed", String(isSelected));
});

donationMessage.textContent = currentAmount > 0
? "Your selected amount is R" + currentAmount.toLocaleString("en-ZA") + "."
: "Enter an amount greater than zero.";
});

donationForm.addEventListener("submit", function (event) {
event.preventDefault();

if (!Number.isFinite(currentAmount) || currentAmount <= 0) {
donationMessage.textContent =
"Please select or enter a valid donation amount.";
return;
}

donationMessage.textContent =
"Your chosen contribution is R" +
currentAmount.toLocaleString("en-ZA") +
". Online payment is not connected yet. Please use the official NSPCA website to find verified donation methods.";
});