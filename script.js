const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let columns;
let rainDrops = [];
const fontSize = 18;
const alphabet = "01";

// Mouse repel effect
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
const repelRadius = 100; // pixels
const repelStrength = 2; // how hard to push

function setupCanvas() {
    // Set canvas to the actual size of the window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Recalculate how many columns fit on the new width
    columns = Math.floor(canvas.width / fontSize);
    
    // Reset raindrops array for the new width
    rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.random() * -100; 
    }
}

// Run setup on load
setupCanvas();

// IMPORTANT: Re-run setup whenever the window is resized
window.addEventListener('resize', setupCanvas);

const draw = () => {
    // slight fade to leave longer green trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        
        // Calculate position for this column
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;
        
        // Mouse repel effect
        const dx = x - mouseX;
        const dy = y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < repelRadius) {
            // Push the drop away from mouse
            const angle = Math.atan2(dy, dx);
            const force = (repelRadius - distance) / repelRadius * repelStrength;
            rainDrops[i] -= Math.sin(angle) * force;
        }
        
        // Wrap around if pushed too far up
        if (rainDrops[i] < -1) {
            rainDrops[i] = canvas.height / fontSize;
        }
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00FF41";

        if (Math.random() > 0.9) {
            ctx.fillStyle = '#FFF';
        } else {
            ctx.fillStyle = '#00FF41';
        }

        ctx.fillText(text, x, y);

        // If the drop hits the bottom of the current canvas height
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        
        rainDrops[i]++;
    }
};

setInterval(draw, 35);

// Setup and scroll handlers
const mainCard = document.getElementById('main-card');
let decryptTriggered = false; // Flag to prevent multiple decrypt calls

window.addEventListener('scroll', () => {
    const mainCard = document.getElementById('main-card');
    const skillsCard = document.getElementById('skills-card');
    const scrollY = window.scrollY;
    
    // Trigger expansion after 50px of scrolling for main card
    if (scrollY > 50) {
        mainCard.classList.add('expanded');
        // Trigger decrypt effect only once, with proper delay
        if (!decryptTriggered) {
            decryptTriggered = true;
            setTimeout(() => decryptTimeline(), 300); // Wait for CSS animation to complete
        }
    } else {
        mainCard.classList.remove('expanded');
        decryptTriggered = false; // Reset when scrolling back up
    }
    
    // expand skills section once the user scrolls past the main-card area
    const triggerPoint = 300; // adjust as needed
    if (scrollY > triggerPoint) {
        skillsCard.classList.add('expanded-second');
        mainCard.classList.add('hidden');
    } else {
        skillsCard.classList.remove('expanded-second');
        mainCard.classList.remove('hidden');
    }
});

// System Decrypt Effect
function decryptTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const symbols = '@#$%&*!?~^|<>';
    
    timelineItems.forEach((item, index) => {
        const yearEl = item.querySelector('.year');
        const eventEl = item.querySelector('.event');
        
        // Only run decrypt if we haven't already
        if (item.dataset.decrypted === 'true') {
            return; // Already decrypted, skip
        }
        
        // Store original text BEFORE modifying anything
        const originalYear = yearEl.textContent.trim();
        const originalEvent = eventEl.textContent.trim();
        
        // Generate random symbols matching the exact length
        const randomYear = Array.from(originalYear)
            .map(() => symbols[Math.floor(Math.random() * symbols.length)])
            .join('');
        const randomEvent = Array.from(originalEvent)
            .map(() => symbols[Math.floor(Math.random() * symbols.length)])
            .join('');
        
        // Set to random encrypted state
        yearEl.textContent = randomYear;
        eventEl.textContent = randomEvent;
        
        // Trigger animation class
        item.classList.add('decrypting');
        
        // Decrypt character by character
        const decryptDuration = 40; // ms per character
        let currentIndex = 0;
        const maxLength = Math.max(originalYear.length, originalEvent.length);
        
        const decryptInterval = setInterval(() => {
            // Build decrypted year
            let decryptedYear = '';
            for (let i = 0; i < originalYear.length; i++) {
                if (i < currentIndex) {
                    decryptedYear += originalYear[i];
                } else {
                    decryptedYear += symbols[Math.floor(Math.random() * symbols.length)];
                }
            }
            yearEl.textContent = decryptedYear;
            
            // Build decrypted event
            let decryptedEvent = '';
            for (let i = 0; i < originalEvent.length; i++) {
                if (i < currentIndex) {
                    decryptedEvent += originalEvent[i];
                } else {
                    decryptedEvent += symbols[Math.floor(Math.random() * symbols.length)];
                }
            }
            eventEl.textContent = decryptedEvent;
            
            currentIndex++;
            
            // Stop when we've decrypted all characters
            if (currentIndex > maxLength) {
                // Ensure final text is perfect
                yearEl.textContent = originalYear;
                eventEl.textContent = originalEvent;
                item.classList.remove('decrypting');
                item.dataset.decrypted = 'true'; // Mark as decrypted
                clearInterval(decryptInterval);
            }
        }, decryptDuration);
    });
}

// CURSOR LIGHTNING EFFECT + MOUSE TRACKING
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    // Create lightning spark effect randomly
    if (Math.random() > 0.7) {
        createLightningSpark(e.clientX, e.clientY);
    }
});

function createLightningSpark(x, y) {
    // create multiple smaller bolts for intensity
    const boltCount = Math.floor(Math.random() * 2) + 1;
    for (let b = 0; b < boltCount; b++) {
        spawnBolt(x, y);
    }
    // also create a few electron particles around cursor
    for (let p = 0; p < 3; p++) {
        createElectron(x, y);
    }
}

function spawnBolt(x, y) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '120');
    svg.setAttribute('height', '120');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.classList.add('lightning-svg');
    svg.style.position = 'fixed';
    svg.style.left = (x - 60) + 'px';
    svg.style.top = (y - 60) + 'px';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '999';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let pathData = 'M 60 60';
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 60 + 30;
    const segments = 6;
    const endX = 60 + Math.cos(angle) * distance;
    const endY = 60 + Math.sin(angle) * distance;

    for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const baseX = 60 + Math.cos(angle) * distance * t;
        const baseY = 60 + Math.sin(angle) * distance * t;
        const jitter = 12;
        const jitterX = (Math.random() - 0.5) * jitter;
        const jitterY = (Math.random() - 0.5) * jitter;
        pathData += ` L ${baseX + jitterX} ${baseY + jitterY}`;
    }
    pathData += ` L ${endX} ${endY}`;

    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#00FF41');
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('filter', 'url(#glow)');
    path.classList.add('lightning-bolt');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '3');
    feGaussianBlur.setAttribute('result', 'coloredBlur');
    filter.appendChild(feGaussianBlur);
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    svg.appendChild(defs);
    svg.appendChild(path);

    document.body.appendChild(svg);
    setTimeout(() => { svg.remove(); }, 400);
}

function createElectron(x, y) {
    const dot = document.createElement('div');
    dot.className = 'electron';
    const offset = 10 + Math.random() * 20;
    const angle = Math.random() * Math.PI * 2;
    dot.style.left = x + Math.cos(angle) * offset + 'px';
    dot.style.top = y + Math.sin(angle) * offset + 'px';
    document.body.appendChild(dot);
    setTimeout(() => { dot.remove(); }, 600);
}
