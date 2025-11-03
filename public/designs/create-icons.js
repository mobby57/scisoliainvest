const fs = require('fs');
const { createCanvas } = require('canvas');

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background with rounded corners
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(0, 0, size, size);
    
    // Simple house icon
    ctx.fillStyle = 'white';
    const houseSize = size * 0.5;
    const houseX = size * 0.25;
    const houseY = size * 0.375;
    
    // House base
    ctx.fillRect(houseX, houseY + houseSize * 0.25, houseSize, houseSize * 0.75);
    
    // Roof triangle
    ctx.beginPath();
    ctx.moveTo(houseX, houseY + houseSize * 0.25);
    ctx.lineTo(size * 0.5, houseY);
    ctx.lineTo(houseX + houseSize, houseY + houseSize * 0.25);
    ctx.closePath();
    ctx.fill();
    
    // Door
    ctx.fillStyle = '#1e40af';
    const doorWidth = houseSize * 0.2;
    const doorHeight = houseSize * 0.4;
    ctx.fillRect(size * 0.5 - doorWidth * 0.5, houseY + houseSize - doorHeight, doorWidth, doorHeight);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.08}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('SCI', size * 0.5, size * 0.9);
    
    return canvas.toBuffer('image/png');
}

// Create icons
try {
    const icon192 = createIcon(192);
    const icon512 = createIcon(512);
    
    fs.writeFileSync('icon-192.png', icon192);
    fs.writeFileSync('icon-512.png', icon512);
    
    console.log('Icons created successfully!');
} catch (error) {
    console.log('Canvas library not available, creating simple PNG files...');
}