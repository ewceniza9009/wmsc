// Script to convert SVG to transparent PNG
const fs = require('fs');
const path = require('path');
const { createCanvas, Image } = require('canvas');

// Configuration
const inputFile = path.join(__dirname, '../images/coldstorage-updated.svg');
const outputFile = path.join(__dirname, '../images/coldstorage-updated.png');
const width = 500;
const height = 400;

// Create canvas with transparency support
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Load the SVG
const img = new Image();
img.onload = () => {
  // Draw the image on the canvas
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  
  // Convert to PNG and save
  const pngBuffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputFile, pngBuffer);
  
  console.log(`SVG converted to PNG with transparency: ${outputFile}`);
};

// Handle errors
img.onerror = (err) => {
  console.error('Error loading SVG:', err);
};

// Load SVG file
fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error('Error reading SVG file:', err);
    return;
  }
  
  const svgContent = data.toString('utf-8');
  img.src = svgContent;
});

// Alternate method (if "canvas" package is not available):
// This also works but requires installing additional dependencies
/*
const sharp = require('sharp');

sharp(inputFile)
  .resize({ width, height, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile(outputFile)
  .then(() => {
    console.log(`SVG converted to transparent PNG: ${outputFile}`);
  })
  .catch(err => {
    console.error('Error converting SVG to PNG:', err);
  });
*/

