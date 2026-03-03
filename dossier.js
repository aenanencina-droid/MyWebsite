const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const image = new Image();
image.crossOrigin = "Anonymous"; 
image.src = 'Encina_Azhil_Leigh_2x2.jpeg'; 

let pixels = [];
const fontSize = 8; // Smaller font makes the face more detailed
let isLoaded = false;

image.onload = function() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    const ratio = Math.min(canvas.width / image.width, canvas.height / image.height);
    const centerShiftX = (canvas.width - image.width * ratio) / 2;
    const centerShiftY = (canvas.height - image.height * ratio) / 2;
    
    tempCtx.drawImage(image, 0, 0, image.width, image.height, centerShiftX, centerShiftY, image.width * ratio, image.height * ratio);

    const imgData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    for (let y = 0; y < canvas.height; y += fontSize) {
        for (let x = 0; x < canvas.width; x += fontSize) {
            const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
            const avg = (imgData[index] + imgData[index + 1] + imgData[index + 2]) / 3;
            pixels.push({ x, y, brightness: avg });
        }
    }
    isLoaded = true;
    render();
};

function render() {
    // Clear screen with a dark green tint for that monitor glow
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    pixels.forEach(p => {
        // Only draw if there is some brightness (ignores pure black background)
        if (p.brightness > 30) {
            // Variation: makes the "0" and "1" flicker slightly
            const char = Math.random() > 0.5 ? "1" : "0";
            
            // Color based on brightness: highlights are bright green, shadows are dark green
            const g = Math.min(255, p.brightness + 50);
            ctx.fillStyle = `rgb(0, ${g}, 40)`;
            
            ctx.fillText(char, p.x, p.y);
        }
    });

    // Instead of falling, we just "flicker" the pixels every 100ms
    setTimeout(() => requestAnimationFrame(render), 100);
}
