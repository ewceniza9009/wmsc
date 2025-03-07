# SVG to PNG Converter

This script converts the improved Cold Storage SVG to a transparent PNG image.

## Requirements

Node.js and the Canvas library are required to run this script.

## Installation

Install the dependencies:

```bash
npm install
```

## Usage

Run the conversion script:

```bash
npm run convert
```

This will convert the SVG file at `../images/coldstorage-updated.svg` to a PNG file at `../images/coldstorage-updated.png`, preserving transparency.

## Alternative Methods

The script includes an alternate method using the Sharp library (commented out). If you prefer using Sharp instead of Canvas:

1. Install Sharp: `npm install sharp`
2. Uncomment the Sharp code block in the script
3. Comment out the Canvas code block

