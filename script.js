function showSection(sectionId) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(s => s.style.display = 'none');
  const active = document.getElementById(sectionId);
  if (active) active.style.display = 'block';
}

// Economy Clicker Logic
let world_GDP = 0;
let increase_per_click = 1;
let passive_income = 0;
let infrastructureCost = 50;
let infrastructureCount = 0;
let tradeBotCost = 100;
let tradeBotCount = 0;

function increase_GDP() { world_GDP += increase_per_click; updateDisplay(); }
function openShop() { document.getElementById('shop-overlay').style.display = 'flex'; }
function closeShop() { document.getElementById('shop-overlay').style.display = 'none'; }

function buyInfrastructure() {
  if (world_GDP >= infrastructureCost) {
    world_GDP -= infrastructureCost;
    infrastructureCount++;
    increase_per_click += 2;
    infrastructureCost = Math.round(infrastructureCost * 1.25);
    updateDisplay();
  } else { alert("Not enough GDP!"); }
}

function buyTradeBots() {
  if (world_GDP >= tradeBotCost) {
    world_GDP -= tradeBotCost;
    tradeBotCount++;
    passive_income += 5;
    tradeBotCost = Math.round(tradeBotCost * 1.25);
    updateDisplay();
  } else { alert("Not enough GDP!"); }
}

function updateDisplay() {
  const gdpEl = document.getElementById('Current_GDP');
  const infraBtn = document.getElementById('upgrade-click-btn');
  const botBtn = document.getElementById('upgrade-passive-btn');
  const infraCountEl = document.getElementById('infrastructure-count');
  const botCountEl = document.getElementById('tradebot-count');

  if (gdpEl) gdpEl.innerText = "$" + world_GDP.toLocaleString();
  if (infraBtn) infraBtn.innerText = "Cost: $" + infrastructureCost.toLocaleString();
  if (botBtn) botBtn.innerText = "Cost: $" + tradeBotCost.toLocaleString();
  if (infraCountEl) infraCountEl.innerText = infrastructureCount;
  if (botCountEl) botCountEl.innerText = tradeBotCount;
}
setInterval(() => { lost_from_inflation = world_GDP * 0.01; updateDisplay(); }, 1000);
setInterval(() => { world_GDP += passive_income; updateDisplay(); }, 1000);
setInterval(() => { world_GDP -= lost_from_inflation; updateDisplay(); }, 1000);

let events = [
  { name: "Trade Boom", mult: 2 }, 
  { name: "Recession", mult: 0.5 }
];

function checkEvent() {

  let roll = Math.random()
  if (roll > 0.7) {
    let eventIndex = Math.floor(Math.random() * events.length);
    let currentEvent = events[eventIndex];

    passive_income = passive_income * currentEvent.mult

    alert("MAJOR EVENT!!!! " + currentEvent.name + "/n" + currentEvent.message);

    set Timeout(() => {
      passive_income = passive_income / currentEvent.mult;
      alert("The " + currentEvent.name + " has ended.");
      updateDisplay();
    }, 10000);

  
    updateDisplay()

  }
}

setInterval(checkEvent, 30000);

// History Logic
const historyDatabase = [
  { month: 0, day: 1, year: 1995, event: "WTO established." },
  { month: 1, day: 7, year: 1992, event: "Maastricht Treaty signed." },
  { month: 2, day: 1, year: 1947, event: "IMF began operations." },
  { month: 3, day: 4, year: 1949, event: "NATO formed." },
  { month: 4, day: 1, year: 2004, event: "EU expansion." },
  { month: 5, day: 28, year: 1919, event: "Treaty of Versailles." },
  { month: 6, day: 1, year: 1997, event: "Hong Kong transfer." },
  { month: 7, day: 15, year: 1971, event: "Nixon Shock." },
  { month: 8, day: 26, year: 1999, event: "G20 established." },
  { month: 9, day: 24, year: 1945, event: "UN established." },
  { month: 10, day: 9, year: 1989, event: "Berlin Wall fell." },
  { month: 11, day: 25, year: 1991, event: "USSR dissolved." }
];

window.onload = () => {
  const currentMonth = new Date().getMonth();
  const box = document.getElementById("daily-history-box");
  if (box) {
    const h = historyDatabase[currentMonth];
    box.innerHTML = `On this month (${h.month + 1}), in ${h.year}: ${h.event}`;
  }
  updateDisplay();
};

let affvotes = 0;
let negvotes = 0;
let hasvoted = false;

function voteResolution(side) { // Changed to match your HTML onclick="voteResolution"
  if (hasvoted) {
    alert("You have already voted!");
    return;
  }

  if (side === 'Aff') { // Match the capital 'A' from your HTML
    affvotes++;
  } else if (side === 'Neg') { // Match the capital 'N'
    negvotes++;
  }

  hasvoted = true;

  // THIS IS THE NEW PART: Update the HTML text
  document.getElementById('aff-count').innerText = affvotes;
  document.getElementById('neg-count').innerText = negvotes;
  
  alert("Thank you for voting " + side + "!");
}



// Function to fetch real news headlines
async function fetchNews() {
  const ticker = document.getElementById('news-ticker');
  const rssUrl = 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml'; // Using NYT World News
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl )}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.status === 'ok') {
      // Clear the "Loading" message
      ticker.innerHTML = '';
      
      // Loop through the news items and add them to the ticker
      data.items.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'ticker__item';
        // Clean up the title and add a separator
        newsItem.innerText = `• ${item.title.toUpperCase()} `;
        ticker.appendChild(newsItem);
      });
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    ticker.innerHTML = '<div class="ticker__item">Unable to load live news at this time.</div>';
  }
}

// Update your window.onload to include fetchNews()
window.onload = () => {
  fetchNews(); // <--- Add this line
  
  // ... keep your existing onload code (History logic, etc.)
  const currentMonth = new Date().getMonth();
  const box = document.getElementById("daily-history-box");
  if (box) {
    const h = historyDatabase[currentMonth];
    box.innerHTML = `On this month (${h.month + 1}), in ${h.year}: ${h.event}`;
  }
  updateDisplay();
};
\

