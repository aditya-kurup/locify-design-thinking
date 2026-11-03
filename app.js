const STORAGE_KEY = "locify-demo-v1";
const vendorInput = document.querySelector("#vendor-name");
const buyerView = document.querySelector("#buyer-view");
const vendorView = document.querySelector("#vendor-view");
const resultsList = document.querySelector("#results-list");
const vendorRequestList = document.querySelector("#vendor-request-list");
const offersDialog = document.querySelector("#offers-modal");
const toast = document.querySelector("#toast");
const toastMessage = document.querySelector("#toast-message");
let toastTimer;
let activeOfferRequestId = null;

const demoSeed = [
  {
    id: "seed-hub",
    item: "USB-C hub with HDMI",
    category: "Electronics",
    distance: "0.8 km away",
    urgent: true,
    status: "open",
    createdAt: Date.now() - 240000,
    offers: [
      { id: "seed-offer-hub", vendor: "Tech Loop", price: 1320, ready: "Ready in 20 min", fulfilment: "Pickup" }
    ]
  },
  {
    id: "seed-pen",
    item: "Fountain pen · fine nib",
    category: "Stationery",
    distance: "1.1 km away",
    urgent: false,
    status: "open",
    createdAt: Date.now() - 1080000,
    offers: [
      { id: "seed-offer-pen", vendor: "The Paper Room", price: 680, ready: "Ready for pickup", fulfilment: "Pickup" }
    ]
  },
  {
    id: "seed-pump",
    item: "Floor pump for bicycle",
    category: "Sports & outdoors",
    distance: "2.4 km away",
    urgent: true,
    status: "open",
    createdAt: Date.now() - 60000,
    offers: []
  }
];

function loadDemo() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.requests) && typeof saved.vendorName === "string") return saved;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { requests: demoSeed, vendorName: "Byte & Bolt", view: "buyer" };
}

let demo = loadDemo();

function saveDemo() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function currentVendor() {
  return vendorInput.value.trim() || "Local shop";
}

function offerSummary(request) {
  if (!request.offers.length) return "Waiting for the first shop reply";
  const best = [...request.offers].sort((a, b) => a.price - b.price)[0];
  return `${request.offers.length} ${request.offers.length === 1 ? "offer" : "offers"} · from ₹${best.price.toLocaleString("en-IN")}`;
}

function resultTemplate(request) {
  const reserved = request.status === "reserved";
  const complete = request.status === "complete";
  const status = complete ? "Collected" : reserved ? "Reserved" : offerSummary(request);
  const action = complete ? "View details" : reserved ? "Reservation" : "View replies";
  return `<article class="result-row ${reserved || complete ? "is-reserved" : ""}">
    <div class="result-main">
      <span class="result-icon ${request.category === "Stationery" ? "teal" : request.category === "Sports & outdoors" ? "blue" : "orange"}"><i data-lucide="${request.category === "Stationery" ? "pen-line" : request.category === "Sports & outdoors" ? "bike" : "package-search"}"></i></span>
      <div><strong>${escapeHtml(request.item)}</strong><small>${escapeHtml(request.category)} · ${escapeHtml(request.distance)}${request.urgent ? " · needed today" : ""}</small></div>
    </div>
    <div class="result-meta"><span>Request status</span><strong class="${reserved ? "orange" : ""}">${status}</strong></div>
    <div class="result-meta result-meta-shop"><span>${request.offers.length ? "Latest reply" : "Next step"}</span><strong>${request.offers.length ? escapeHtml(request.offers[request.offers.length - 1].vendor) : "Nearby shops can reply"}</strong></div>
    <div class="result-action"><button class="small-button" type="button" data-open-offers="${request.id}"><span>${action}</span><i data-lucide="arrow-up-right"></i></button></div>
  </article>`;
}

function renderBuyer() {
  resultsList.innerHTML = demo.requests.length
    ? [...demo.requests].sort((a, b) => b.createdAt - a.createdAt).map(resultTemplate).join("")
    : `<div class="empty-state"><strong>No requests yet</strong><span>Ask for an item to start the local conversation.</span></div>`;
  document.querySelector("#result-count").textContent = `${demo.requests.length} ${demo.requests.length === 1 ? "request" : "requests"}`;
  document.querySelector("#results-heading").textContent = `Requests near you`;
  renderIcons();
}

function vendorRequestTemplate(request) {
  const ownOffer = request.offers.find((offer) => offer.vendor.toLowerCase() === currentVendor().toLowerCase());
  const isActive = request.status === "open";
  const reply = isActive
    ? ownOffer
      ? `<div class="vendor-own-offer"><i data-lucide="check"></i> Your offer: ₹${ownOffer.price.toLocaleString("en-IN")} · ${escapeHtml(ownOffer.ready)}</div>`
      : `<form class="offer-form" data-offer-form="${request.id}">
          <label>Price <span class="price-input"><span>₹</span><input name="price" type="number" min="1" max="1000000" step="1" placeholder="0" required /></span></label>
          <label>Ready <select name="ready"><option>Ready now</option><option>Ready in 15 min</option><option>Ready in 30 min</option><option>Ready in 1 hour</option><option>Tomorrow</option></select></label>
          <label>Fulfilment <select name="fulfilment"><option>Pickup</option><option>Local delivery</option></select></label>
          <button class="reply-submit" type="submit"><i data-lucide="send"></i> Send offer</button>
        </form>`
    : `<div class="vendor-own-offer reserved-note"><i data-lucide="lock-keyhole"></i> This request is ${request.status === "complete" ? "collected" : "reserved"}.</div>`;

  return `<article class="vendor-request-card">
    <div class="vendor-request-top"><div><span class="request-status ${request.offers.length ? "has-offers" : ""}">${request.status === "open" ? request.offers.length ? `${request.offers.length} REPL${request.offers.length === 1 ? "Y" : "IES"} · OPEN` : "NEW REQUEST" : request.status === "complete" ? "COLLECTED" : "RESERVED"}</span><h3>${escapeHtml(request.item)}</h3><p>${escapeHtml(request.category)} · ${escapeHtml(request.distance)}${request.urgent ? " · needed today" : ""}</p></div><span class="request-age">${timeAgo(request.createdAt)}</span></div>
    ${request.offers.length ? `<div class="existing-offers"><span>Current offers</span>${request.offers.map((offer) => `<span>${escapeHtml(offer.vendor)} · ₹${offer.price.toLocaleString("en-IN")} · ${escapeHtml(offer.ready)}</span>`).join("")}</div>` : ""}
    ${reply}
  </article>`;
}

function timeAgo(timestamp) {
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  return minutes < 60 ? `${minutes} min ago` : `${Math.floor(minutes / 60)} hr ago`;
}

function renderVendor() {
  const openCount = demo.requests.filter((request) => request.status === "open" && !request.offers.some((offer) => offer.vendor.toLowerCase() === currentVendor().toLowerCase())).length;
  document.querySelector("#vendor-request-count").textContent = `${openCount} open`;
  document.querySelector("#inbox-count").textContent = openCount;
  const available = demo.requests.filter((request) => request.status === "open");
  vendorRequestList.innerHTML = available.length
    ? [...available].sort((a, b) => b.createdAt - a.createdAt).map(vendorRequestTemplate).join("")
    : `<div class="empty-state"><strong>Inbox is clear</strong><span>New buyer requests will appear here.</span></div>`;
  renderIcons();
}

function setMode(mode) {
  const vendor = mode === "vendor";
  demo.view = vendor ? "vendor" : "buyer";
  buyerView.hidden = vendor;
  vendorView.hidden = !vendor;
  document.querySelectorAll(".mode-switch").forEach((button) => {
    button.dataset.mode = vendor ? "buyer" : "vendor";
    button.childNodes[0].textContent = vendor ? "Buyer view " : "Vendor inbox ";
  });
  renderBuyer();
  renderVendor();
  saveDemo();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showOffers(requestId) {
  const request = demo.requests.find((item) => item.id === requestId);
  if (!request) return;
  activeOfferRequestId = requestId;
  document.querySelector("#offers-title").textContent = request.item;
  document.querySelector("#offers-subtitle").textContent = `${request.category} · ${request.distance}${request.urgent ? " · needed today" : ""}`;
  const offers = [...request.offers].sort((a, b) => a.price - b.price);
  const isReserved = request.status === "reserved" || request.status === "complete";
  document.querySelector("#offers-list").innerHTML = offers.length
    ? offers.map((offer) => `<article class="offer-card"><div class="offer-shop-icon"><i data-lucide="store"></i></div><div class="offer-detail"><strong>${escapeHtml(offer.vendor)}</strong><span>${escapeHtml(offer.ready)} · ${escapeHtml(offer.fulfilment)}</span></div><div class="offer-price">₹${offer.price.toLocaleString("en-IN")}</div>${request.status === "open" ? `<button class="accept-offer" data-accept-offer="${offer.id}" type="button">Choose shop</button>` : `<span class="offer-state">${request.status === "complete" ? "Collected" : "Reserved"}</span>`}</article>`).join("")
    : `<div class="empty-state"><strong>No replies just yet</strong><span>Nearby shops can see your request in the vendor inbox. Check back in a moment.</span></div>`;
  if (isReserved) {
    document.querySelector("#offers-list").insertAdjacentHTML("beforeend", request.status === "complete"
      ? `<div class="reservation-confirmation"><i data-lucide="circle-check"></i><div><strong>Item collected</strong><span>Your request is complete.</span></div></div>`
      : `<div class="reservation-confirmation"><i data-lucide="badge-check"></i><div><strong>Shop reserved</strong><span>Show this confirmation when you contact the shop.</span></div><button class="complete-order" data-complete-request="${request.id}" type="button">Mark as collected</button></div>`);
  }
  if (!offersDialog.open) offersDialog.showModal();
  renderIcons();
}

document.querySelector("#request-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const item = String(values.get("item")).trim();
  if (!item) return;
  demo.requests.unshift({
    id: `request-${crypto.randomUUID()}`,
    item,
    category: String(values.get("category")),
    distance: `Within ${values.get("radius")} km`,
    urgent: document.querySelector("#urgent-input").checked,
    status: "open",
    createdAt: Date.now(),
    offers: []
  });
  saveDemo();
  renderBuyer();
  renderVendor();
  document.querySelector("#matches").scrollIntoView({ behavior: "smooth", block: "start" });
  showToast(`“${item}” posted. Switch to Vendor inbox to reply.`);
  event.currentTarget.reset();
  document.querySelector("#urgent-input").checked = true;
});

document.querySelectorAll(".segment-button").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".segment-button").forEach((item) => item.classList.toggle("active", item === button));
  const showList = button.dataset.view === "list";
  resultsList.hidden = !showList;
  document.querySelector("#map-view").hidden = showList;
}));

document.addEventListener("click", (event) => {
  const modeButton = event.target.closest("[data-mode]");
  if (modeButton) setMode(modeButton.dataset.mode);
  const offersButton = event.target.closest("[data-open-offers]");
  if (offersButton) showOffers(offersButton.dataset.openOffers);
  const acceptButton = event.target.closest("[data-accept-offer]");
  if (acceptButton) {
    const request = demo.requests.find((item) => item.id === activeOfferRequestId);
    if (request) {
      request.status = "reserved";
      request.acceptedOfferId = acceptButton.dataset.acceptOffer;
      saveDemo();
      renderBuyer();
      renderVendor();
      showOffers(request.id);
      showToast("Shop reserved. Your request is confirmed.");
    }
  }
  const completeButton = event.target.closest("[data-complete-request]");
  if (completeButton) {
    const request = demo.requests.find((item) => item.id === completeButton.dataset.completeRequest);
    if (request) {
      request.status = "complete";
      saveDemo();
      renderBuyer();
      renderVendor();
      showOffers(request.id);
      showToast("Request marked as collected.");
    }
  }
  const mapRequest = event.target.closest("[data-map-request]");
  if (mapRequest) showOffers(mapRequest.dataset.mapRequest);
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-offer-form]");
  if (!form) return;
  event.preventDefault();
  const request = demo.requests.find((item) => item.id === form.dataset.offerForm);
  const values = new FormData(form);
  if (!request || !form.reportValidity()) return;
  const price = Number(values.get("price"));
  if (!Number.isFinite(price) || price <= 0) return;
  request.offers.push({
    id: `offer-${crypto.randomUUID()}`,
    vendor: currentVendor(),
    price,
    ready: String(values.get("ready")),
    fulfilment: String(values.get("fulfilment"))
  });
  saveDemo();
  renderBuyer();
  renderVendor();
  showToast(`Offer sent for ${request.item}.`);
});

document.querySelectorAll("[data-scroll-to]").forEach((button) => button.addEventListener("click", () => {
  if (demo.view === "vendor") setMode("buyer");
  document.getElementById(button.dataset.scrollTo).scrollIntoView({ behavior: "smooth" });
}));
document.querySelectorAll("[data-open-modal]").forEach((button) => button.addEventListener("click", () => document.getElementById(`${button.dataset.openModal}-modal`).showModal()));
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (!(rect.top <= event.clientY && event.clientY <= rect.bottom && rect.left <= event.clientX && event.clientX <= rect.right)) dialog.close();
}));
document.querySelector(".map-locate").addEventListener("click", () => showToast("Map centred on Indiranagar."));
document.querySelector("#photo-input").addEventListener("change", (event) => {
  const label = event.target.closest(".photo-upload").querySelector("span");
  if (event.target.files[0]) label.textContent = event.target.files[0].name;
});
vendorInput.value = demo.vendorName;
vendorInput.addEventListener("input", () => {
  demo.vendorName = vendorInput.value;
  saveDemo();
  renderVendor();
});
document.querySelector("#reset-demo").addEventListener("click", () => {
  demo = { requests: structuredClone(demoSeed), vendorName: "Byte & Bolt", view: "buyer" };
  vendorInput.value = demo.vendorName;
  saveDemo();
  renderBuyer();
  renderVendor();
  showToast("Demo data reset.");
});

renderBuyer();
renderVendor();
setMode(demo.view || "buyer");
