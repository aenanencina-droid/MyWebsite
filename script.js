/**
 * SYSTEM BOOT & LOADER CONTROL
 */
window.addEventListener('load', () => {
    const progressBar = document.getElementById('progress-bar');
    const percentText = document.getElementById('percent');
    const loaderWrapper = document.getElementById('loader-wrapper');
    const loaderText = document.getElementById('loader-text');
    
    let width = 0;
    const messages = ["CONNECTING...", "LOADING_ASSETS...", "BYPASSING_FIREWALL...", "AUTHENTICATING..."];

    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loaderWrapper.classList.add('loader-hidden');
            }, 500);
        } else {
            // Simulated progress speed
            width += Math.floor(Math.random() * 8) + 1;
            if (width > 100) width = 100;
            
            if(progressBar) progressBar.style.width = width + '%';
            if(percentText) percentText.innerText = width + '%';
            
            // Update terminal text based on progress
            if (loaderText) {
                const messageIndex = Math.floor((width / 100) * messages.length);
                loaderText.innerText = messages[Math.min(messageIndex, messages.length - 1)];
            }
        }
    }, 30);
});

/**
 * MATRIX BACKGROUND EFFECT
 */
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let columns;
let rainDrops = [];
const fontSize = 18;
const alphabet = "01";

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
const repelRadius = 100;
const repelStrength = 2;

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.random() * -100; 
    }
}

setupCanvas();
window.addEventListener('resize', setupCanvas);

const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;
        
        const dx = x - mouseX;
        const dy = y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < repelRadius) {
            const angle = Math.atan2(dy, dx);
            const force = (repelRadius - distance) / repelRadius * repelStrength;
            rainDrops[i] -= Math.sin(angle) * force;
        }
        
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

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
};

setInterval(draw, 35);

/**
 * SCROLL & INTERACTION HANDLERS
 */
let decryptTriggered = false;

window.addEventListener('scroll', () => {
    const mainCard = document.getElementById('main-card');
    const skillsCard = document.getElementById('skills-card');
    const scrollY = window.scrollY;
    
    // Trigger expansion after 50px of scrolling for main card
    if (scrollY > 50) {
        if (mainCard) mainCard.classList.add('expanded');
        if (!decryptTriggered) {
            decryptTriggered = true;
            setTimeout(() => decryptTimeline(), 300);
        }
    } else {
        if (mainCard) mainCard.classList.remove('expanded');
        decryptTriggered = false;
    }
    
    // Show skills section after scrolling past the scroll-spacer (150vh)
    // Form 2 appears naturally below form 1, no more fading/overlapping
    const triggerPoint = window.innerHeight * 1.5;
    if (scrollY > triggerPoint) {
        if (skillsCard) skillsCard.classList.add('expanded-second');
        if (mainCard) mainCard.classList.add('hidden');
        animateSkillBars();
    } else {
        if (skillsCard) skillsCard.classList.remove('expanded-second');
        if (mainCard) mainCard.classList.remove('hidden');
        resetSkillBars();
    }
});

function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    bars.forEach(bar => {
        if (bar.dataset.animated === 'true') return;
        const percent = parseInt(bar.getAttribute('data-percent') || '0', 10);
        const fill = bar.querySelector('.skill-fill');
        if (fill) {
            setTimeout(() => { fill.style.width = percent + '%'; }, Math.random() * 300);
            bar.dataset.animated = 'true';
        }
    });
}

function resetSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    bars.forEach(bar => {
        const fill = bar.querySelector('.skill-fill');
        if (fill) {
            fill.style.width = '0%';
            delete bar.dataset.animated;
        }
    });
}

/**
 * DECRYPT EFFECT
 */
function decryptTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const symbols = '@#$%&*!?~^|<>';
    
    timelineItems.forEach((item) => {
        const yearEl = item.querySelector('.year');
        const eventEl = item.querySelector('.event');
        
        if (item.dataset.decrypted === 'true') return;
        
        const originalYear = yearEl.textContent.trim();
        const originalEvent = eventEl.textContent.trim();
        
        item.classList.add('decrypting');
        
        const decryptDuration = 40;
        let currentIndex = 0;
        const maxLength = Math.max(originalYear.length, originalEvent.length);
        
        const decryptInterval = setInterval(() => {
            let decryptedYear = '';
            for (let i = 0; i < originalYear.length; i++) {
                decryptedYear += (i < currentIndex) ? originalYear[i] : symbols[Math.floor(Math.random() * symbols.length)];
            }
            yearEl.textContent = decryptedYear;
            
            let decryptedEvent = '';
            for (let i = 0; i < originalEvent.length; i++) {
                decryptedEvent += (i < currentIndex) ? originalEvent[i] : symbols[Math.floor(Math.random() * symbols.length)];
            }
            eventEl.textContent = decryptedEvent;
            
            currentIndex++;
            
            if (currentIndex > maxLength) {
                yearEl.textContent = originalYear;
                eventEl.textContent = originalEvent;
                item.classList.remove('decrypting');
                item.dataset.decrypted = 'true';
                clearInterval(decryptInterval);
            }
        }, decryptDuration);
    });
}

/**
 * LIGHTNING & MOUSE EFFECTS
 */
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (Math.random() > 0.7) {
        createLightningSpark(e.clientX, e.clientY);
    }
});

function createLightningSpark(x, y) {
    const boltCount = Math.floor(Math.random() * 2) + 1;
    for (let b = 0; b < boltCount; b++) { spawnBolt(x, y); }
    for (let p = 0; p < 3; p++) { createElectron(x, y); }
}

function spawnBolt(x, y) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '120'); svg.setAttribute('height', '120');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.classList.add('lightning-svg');
    svg.style.position = 'fixed';
    svg.style.left = (x - 60) + 'px'; svg.style.top = (y - 60) + 'px';
    svg.style.pointerEvents = 'none'; svg.style.zIndex = '99999';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let pathData = 'M 60 60';
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 60 + 30;
    const segments = 6;

    for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const baseX = 60 + Math.cos(angle) * distance * t;
        const baseY = 60 + Math.sin(angle) * distance * t;
        pathData += ` L ${baseX + (Math.random()-0.5)*12} ${baseY + (Math.random()-0.5)*12}`;
    }

    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#00FF41');
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('fill', 'none');
    path.classList.add('lightning-bolt');

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

/**
 * LANGUAGE CARD POPUP MODAL
 */
const popup = document.getElementById('projects-popup');
const popupLangName = document.getElementById('popup-lang-name');
const popupProjectsList = document.getElementById('popup-projects-list');
let popupHideTimeout;

document.querySelectorAll('.lang-card').forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        clearTimeout(popupHideTimeout);
        
        const langName = card.getAttribute('data-lang');
        const projectsString = card.getAttribute('data-projects');
        const projects = projectsString ? projectsString.split('|') : [];
        
        // Update popup content
        popupLangName.textContent = langName;
        popupProjectsList.innerHTML = projects.map(p => `<p>${p.trim()}</p>`).join('');
        
        // Popup is centered via CSS, no need for dynamic positioning
        popup.classList.add('show');
    });
});

popup.addEventListener('mouseenter', () => {
    clearTimeout(popupHideTimeout);
});

popup.addEventListener('mouseleave', () => {
    popupHideTimeout = setTimeout(() => {
        popup.classList.remove('show');
    }, 100);
});

document.querySelectorAll('.lang-card').forEach(card => {
    card.addEventListener('mouseleave', () => {
        popupHideTimeout = setTimeout(() => {
            popup.classList.remove('show');
        }, 100);
    });
});

