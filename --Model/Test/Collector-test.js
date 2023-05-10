// Collector Vehicle-- Step 2 Form

const appendTo = document.querySelector(".quote_request__summary");
const cloneFrom = document.querySelector(".quote_request__summary_item");

const clone = cloneFrom?.cloneNode(true);
clone.querySelector(".quote_request__summary_item_info").innerText = "123";
appendTo.appendChild(clone);
