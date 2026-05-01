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
let lost_from_inflation = 0; // Fixed: Define this at the top

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

  if (gdpEl) gdpEl.innerText = "$" + Math.floor(world_GDP).toLocaleString();
  if (infraBtn) infraBtn.innerText = "Cost: $" + infrastructureCost.toLocaleString();
  if (botBtn) botBtn.innerText = "Cost: $" + tradeBotCost.toLocaleString();
  if (infraCountEl) infraCountEl.innerText = infrastructureCount;
  if (botCountEl) botCountEl.innerText = tradeBotCount;
}

// Fixed: Combined the intervals to keep it clean
setInterval(() => { 
  lost_from_inflation = world_GDP * 0.01; 
  world_GDP += passive_income; 
  world_GDP -= lost_from_inflation; 
  updateDisplay(); 
}, 1000);

let events = [
  { name: "Trade Boom", mult: 2, msg: "Global demand is up!" }, 
  { name: "Recession", mult: 0.5, msg: "Economic downturn!" }
];

function checkEvent() {
  let roll = Math.random();
  if (roll > 0.7) {
    let eventIndex = Math.floor(Math.random() * events.length);
    let currentEvent = events[eventIndex];

    passive_income = passive_income * currentEvent.mult;

    alert("MAJOR EVENT!!!! " + currentEvent.name + "\n" + currentEvent.msg);

    setTimeout(() => { // Fixed: Removed the space
      passive_income = passive_income / currentEvent.mult;
      alert("The " + currentEvent.name + " has ended.");
      updateDisplay();
    }, 10000);

    updateDisplay();
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

let affvotes = 0;
let negvotes = 0;
let hasvoted = false;

function voteResolution(side) {
  if (hasvoted) {
    alert("You have already voted!");
    return;
  }
  if (side === 'Aff') { affvotes++; } 
  else if (side === 'Neg') { negvotes++; }
  hasvoted = true;
  document.getElementById('aff-count').innerText = affvotes;
  document.getElementById('neg-count').innerText = negvotes;
  alert("Thank you for voting " + side + "!");
}

async function fetchNews() {
  const ticker = document.getElementById('news-ticker');
  const rssUrl = 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml';
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl )}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.status === 'ok') {
      ticker.innerHTML = '';
      data.items.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'ticker__item';
        newsItem.innerText = `• ${item.title.toUpperCase()} `;
        ticker.appendChild(newsItem);
      });
    }
  } catch (error) {
    ticker.innerHTML = '<div class="ticker__item">Unable to load live news.</div>';
  }
}

window.onload = () => {
  fetchNews(); // This starts the news ticker
  const currentMonth = new Date().getMonth();
  const box = document.getElementById("daily-history-box");
  if (box) {
    const h = historyDatabase[currentMonth];
    box.innerHTML = `On this month (${h.month + 1}), in ${h.year}: ${h.event}`;
  }
  updateDisplay(); // This starts the GDP numbers
};
