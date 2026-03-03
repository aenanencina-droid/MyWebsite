const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const image = new Image();
image.crossOrigin = "Anonymous"; // This helps with security errors
image.src = 'Encina_Azhil_Leigh_2x2.jpeg'; 

let pixels = [];
const fontSize = 10;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

image.onload = function() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    // Fit image to screen
    const ratio = Math.min(canvas.width / image.width, canvas.height / image.height);
    const centerShiftX = (canvas.width - image.width * ratio) / 2;
    const centerShiftY = (canvas.height - image.height * ratio) / 2;
    
    tempCtx.drawImage(image, 0, 0, image.width, image.height, centerShiftX, centerShiftY, image.width * ratio, image.height * ratio);

    // Get the raw pixel data
    const imgData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    // Create a brightness map
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const avg = (imgData[index] + imgData[index + 1] + imgData[index + 2]) / 3;
            pixels.push(avg);
        }
    }
    
    requestAnimationFrame(draw);
};

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Slight trail
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Find the brightness of the pixel at this falling location
        const mapX = Math.floor(x);
        const mapY = Math.floor(y);
        const brightness = pixels[mapY * canvas.width + mapX] || 0;

        // The Magic: If brightness > 128 (bright part of photo), make it glow
        if (brightness > 100) {
            ctx.fillStyle = `rgb(0, ${brightness + 100}, 65)`; // Bright neon
        } else {
            ctx.fillStyle = 'rgba(0, 50, 0, 0.3)'; // Dim background rain
        }

        const text = Math.floor(Math.random() * 2); // Binary 0 or 1
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
    setTimeout(() => requestAnimationFrame(draw), 30);
}