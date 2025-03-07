const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const inputSvgPath = path.join(__dirname, '../images/coldstorage-updated.svg');
const outputPngPath = path.join(__dirname, '../images/coldstorage-updated.png');
const width = 500;
const height = 400;

// Function to convert SVG to PNG with transparency
async function convertSvgToPng() {
  try {
    console.log(`Reading SVG file from: ${inputSvgPath}`);
    
    // Check if the input file exists
    if (!fs.existsSync(inputSvgPath)) {
      console.error(`Error: Input SVG file not found at ${inputSvgPath}`);
      process.exit(1);
    }
    
    // Read the SVG file
    const svgBuffer = fs.readFileSync(inputSvgPath);
    
    // Convert SVG to PNG using Sharp
    await sharp(svgBuffer)
      .resize({
        width: width,
        height: height,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .png()
      .toFile(outputPngPath);
    
    console.log(`✓ Successfully converted SVG to PNG with transparency!`);
    console.log(`✓ PNG file saved to: ${outputPngPath}`);
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    process.exit(1);
  }
}

// Execute the conversion
convertSvgToPng();

/* 
USAGE:
1. Make sure Sharp is installed:
   npm install sharp

2. Run this script:
   node svg-to-png-simple.js
*/

// svg-to-png-simple.js
// A simple script to convert SVG to PNG with transparency using Sharp

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Paths configuration
const SVG_PATH = path.join(__dirname, '..', 'images', 'coldstorage-updated.svg');
const PNG_OUTPUT = path.join(__dirname, '..', 'images', 'coldstorage-updated.png');

// Read the SVG file
const svgBuffer = fs.readFileSync(SVG_PATH);

// Convert SVG to PNG with transparency
sharp(svgBuffer)
  .resize(500, 400) // Match the SVG dimensions
  .png({ quality: 100 })
  .toFile(PNG_OUTPUT)
  .then(() => {
    console.log(`✅ Successfully converted SVG to PNG: ${PNG_OUTPUT}`);
  })
  .catch(err => {
    console.error('❌ Error converting SVG to PNG:', err);
  });

/*
USAGE:
1. Install dependencies: npm install sharp
2. Run script: node svg-to-png-simple.js
*/

