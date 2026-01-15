// --- STATE MANAGEMENT ---
let currentPage = 'home';

// --- HARDCODED DATA FROM IMAGES ---
const systemData = {
    pico: {
        temp: "33.3 °C",
        cpu: 26, // Percentage
        ram: 50, // Percentage
        location: "Location name"
    },
    eggs: {
        total: "23,450",
        dailyTotal: "1,021",
        avgWeight: "1,021", // Based on image provided
        rejected: "6",
        grades: {
            A: 2500,
            B: 3000,
            C: 4500,
            D: 1000
        }
    },
    logs: {
        weights: [
            { weight: 68.5, grade: 'A' },
            { weight: 61.41, grade: 'B' },
            { weight: 54.33, grade: 'C' },
            { weight: 47.24, grade: 'D' }
        ],
        sensor: {
            weight: 61.45,
            grade: 'A'
        },
        errors: [
            "Egg jam - System stopped",
            "Servo not responding"
        ]
    }
};

// DOM elements references
const header = document.getElementById('main-header');
const pageTitle = document.getElementById('page-title');
const appContainer = document.getElementById('app-container');
const dateDisplay = document.getElementById('date-display');
const dayDisplay = document.getElementById('day-display');

// --- INITIALIZATION ---
function init() {
    updateDateTime();
    setInterval(updateDateTime, 1000); // Live Clock
    navigateTo('home'); // Start at menu
}

// --- NAVIGATION & RENDERING ---
function navigateTo(page) {
    currentPage = page;
    renderHeader();
    renderContent();
    if (page !== 'home') {
        populatePageData(page);
    }
}

function renderHeader() {
    header.className = ''; // Reset classes
    switch(currentPage) {
        case 'home':
            header.classList.add('header-home');
            pageTitle.textContent = 'AUTO EGG SORTER';
            break;
        case 'pico':
            header.classList.add('header-pico');
            pageTitle.textContent = 'PICO System Info Dashboard';
            break;
        case 'eggs':
            header.classList.add('header-eggs');
            pageTitle.textContent = 'EGGS Info Dashboard';
            break;
        case 'logs':
            header.classList.add('header-logs');
            pageTitle.textContent = 'System Log Dashboard';
            break;
    }
}

function renderContent() {
    const templateId = `${currentPage}-template`;
    const template = document.getElementById(templateId);
    appContainer.innerHTML = '';
    appContainer.appendChild(template.content.cloneNode(true));
}

// --- DATE & TIME (Malaysia UTC+8) ---
function updateDateTime() {
    const now = new Date();
    const optionsDate = { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: 'long', day: 'numeric' };
    const optionsDay = { timeZone: 'Asia/Kuala_Lumpur', weekday: 'long' };
    
    dateDisplay.textContent = now.toLocaleDateString('en-US', optionsDate);
    dayDisplay.textContent = now.toLocaleDateString('en-US', optionsDay);
}


// --- DATA POPULATION ---
function populatePageData(page) {
    if (page === 'pico') {
        const data = systemData.pico;
        
        // Text values
        document.getElementById('pico-temp-val').textContent = data.temp;
        document.getElementById('pico-cpu-val').textContent = data.cpu + ' %';
        document.getElementById('pico-ram-percent').textContent = data.ram + '%';
        document.getElementById('pico-location-val').textContent = data.location;

        // Visual updates
        // Gauge needle rotation (approximate mapping: 0% = -90deg, 50% = 0deg, 100% = 90deg)
        // Adjusting calculation to match the visual half-circle style in CSS
        const rotation = (data.cpu / 100 * 180) - 90; 
        document.getElementById('cpu-needle').style.transform = `rotate(${rotation}deg)`;

        // RAM Bar width
        document.getElementById('ram-fill-bar').style.width = data.ram + '%';

        // Live Clock for Pico page
        const now = new Date();
        // Custom font format looks like: 9H:55m:20s in the image. 
        // We will keep standard time format but use the font style.
        const timeString = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kuala_Lumpur', hour12: false });
        // Optional: formatting it to look like the weird format in the image "9H:99m:99s"
        // Let's stick to valid time like 09:30:45
        document.getElementById('pico-live-time').textContent = timeString;

    } else if (page === 'eggs') {
        const data = systemData.eggs;
        
        document.getElementById('egg-total-val').textContent = data.total;
        document.getElementById('egg-daily-val').textContent = data.dailyTotal;
        document.getElementById('egg-avg-val').textContent = data.avgWeight;
        document.getElementById('egg-rejected-val').textContent = data.rejected;

        document.getElementById('grade-a-count').textContent = data.grades.A;
        document.getElementById('grade-b-count').textContent = data.grades.B;
        document.getElementById('grade-c-count').textContent = data.grades.C;
        document.getElementById('grade-d-count').textContent = data.grades.D;

    } else if (page === 'logs') {
        const data = systemData.logs;
        
        // 1. Fill Table
        const tbody = document.getElementById('weight-log-body');
        tbody.innerHTML = '';
        data.weights.forEach(row => {
            const tr = document.createElement('tr');
            // Add background color class based on grade
            const colorClass = `row-grade-${row.grade}`; 
            tr.innerHTML = `<td class="${colorClass}">${row.weight}</td><td class="${colorClass}">${row.grade}</td>`;
            tbody.appendChild(tr);
        });

        // 2. Fill Sensor
        document.getElementById('sensor-weight').textContent = data.sensor.weight + ' g';
        document.getElementById('sensor-grade').textContent = data.sensor.grade;

        // 3. Fill Errors
        const errList = document.getElementById('error-log-list');
        errList.innerHTML = '';
        data.errors.forEach(err => {
            const li = document.createElement('li');
            li.textContent = err;
            errList.appendChild(li);
        });
    }
}

// Start app
document.addEventListener('DOMContentLoaded', init);