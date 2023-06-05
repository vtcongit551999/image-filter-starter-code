const axios = require('axios');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string) {
  try {
    // Download the image
    const response = await axios.get(inputURL, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    // Apply the filter
    const image = await Jimp.read(buffer);
    image
      .greyscale() // Apply a grayscale filter (modify this as needed)
      .brightness(0.2) // Apply additional filters or modifications if desired
      .contrast(0.5);

    // Save the filtered image
    const outputPath = path.join(__dirname, 'tmp/filtered_image.jpg'); // Change the output file name if desired
    await image.writeAsync(outputPath);

    console.log('Filtered image saved:', outputPath);
    return outputPath;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}