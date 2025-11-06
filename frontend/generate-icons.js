const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');
const svgPath = path.join(iconsDir, 'icon.svg');

// Read SVG file
const svgBuffer = fs.readFileSync(svgPath);

// Generate PNG icons for each size
async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`Generated ${size}x${size} icon`);
  }
  
  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
