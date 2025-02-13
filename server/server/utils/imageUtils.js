const axios = require("axios");

async function fetchImageFromDB(inspectionId, imageName) {
  try {
    const response = await axios.get("http://localhost:8080/img/fetch", {
      params: { inspectionId, imageName },
    });
    if (response.data.images.length > 0) {
      return response.data.images[0].image; // Return signed URL
    }
    return null;
  } catch (error) {
    console.error("Error fetching image from DB:", error);
    return null;
  }
}

async function fetchImage(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return response.data;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

// Export the functions
module.exports = { fetchImageFromDB, fetchImage };

// const insertImage = async (baseImageName) => {
//   let index = 0;
//   while (true) {
//     const imageName = `${baseImageName}${index}`; // Construct dynamic image name
//     console.log(`Fetching image: ${imageName}`);

//     const imageUrl = await fetchImageFromDB(inspectionId, imageName);
//     if (!imageUrl) break; // Stop if no more images exist

//     console.log(`Image URL: ${imageUrl}`);

//     const imageBuffer = await fetchImage(imageUrl);
//     if (imageBuffer) {
//       const imageHeight = 300;
//       const padding = 10;

//       if (
//         doc.y + imageHeight + padding >
//         doc.page.height - doc.page.margins.bottom
//       ) {
//         doc.addPage();
//       }

//       doc.image(imageBuffer, { align: "center", width: 300 });
//       doc.y += imageHeight + padding;
//     }

//     index++; // Move to next indexed image
//   }
// };
