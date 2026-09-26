const sharp = require('sharp');
const fs = require('fs');

async function processIcon() {
  const inputPath = 'public/logo1.png';
  const outputPath = 'src/app/icon.png';
  const faviconPath = 'src/app/favicon.ico';

  try {
    // Read the image metadata to get dimensions
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const size = Math.min(metadata.width, metadata.height);

    // Create an SVG circle to use as a mask
    const circleSvg = Buffer.from(
      `<svg width="${size}" height="${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" />
      </svg>`
    );

    // Crop the image to a circle
    await image
      .resize(size, size, { fit: 'cover' })
      .composite([{ input: circleSvg, blend: 'dest-in' }])
      .toFile(outputPath);

    console.log('Successfully created circular icon.png');

    // Remove the old Vercel favicon so Next.js uses the new icon.png
    if (fs.existsSync(faviconPath)) {
      fs.unlinkSync(faviconPath);
      console.log('Removed old favicon.ico');
    }
  } catch (error) {
    console.error('Error processing icon:', error);
  }
}

processIcon();
