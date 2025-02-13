const PDFDocument = require("pdfkit");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const ImageModel = require("../models/image-upload/image.model");
const router = express.Router();
const sharp = require("sharp");
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const upload = require("../multer/image.multer");
const s3Client = require("../aws/s3bucket");
const randomImageName = require("../crypto/uniqueimage.crypto");

router.get("/fetch", async (req, res) => {
  try {
    const { inspectionId, imageName } = req.query;

    const filter = {};
    if (inspectionId) {
      filter.inspectionId = inspectionId;
    }
    if (imageName) {
      filter.imageName = imageName;
    }

    const fetchImages = await ImageModel.find(filter);

    for (const image of fetchImages) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: image.image,
      };
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      image.image = url;
    }

    res.status(200).send({ message: 200, images: fetchImages });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get("/:inspectionId", async (req, res) => {
  try {
    const { inspectionId } = req.params;

    // Find all images with the given inspectionId
    const images = await ImageModel.find({ inspectionId });

    // If no images are found, return a 404 response
    if (images.length === 0) {
      return res
        .status(404)
        .send({ message: "No images found for this inspection ID" });
    }

    // Respond with the image details including the constant part of the URL (image field)
    res.status(200).send({ message: 200, images });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { imageName, inspectionId } = req.body;

    const imageBuffer = await sharp(req.file.buffer)
      .resize({ width: 300, height: 300 })
      .jpeg({ quality: 30 })
      .toBuffer();

    const imageKey = randomImageName();
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: imageKey,
      Body: imageBuffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const createImage = new ImageModel({
      image: imageKey,
      imageName: imageName,
      inspectionId: inspectionId,
    });

    await createImage.save();
    res.status(200).send({ message: 200, data: createImage });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const imageRecord = await ImageModel.findById(req.params.id);
    if (!imageRecord) {
      return res.status(404).send({ message: "Image not found" });
    }

    await ImageModel.findByIdAndDelete(req.params.id);

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: imageRecord.image,
    });
    await s3Client.send(command);

    res.status(200).send({ message: 200, data: imageRecord });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.post("/create-pdf", async (req, res) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument();

    // Define the path where the PDF will be saved
    const pdfPath = path.join(__dirname, "output.pdf");

    // Pipe the PDF into a writable stream
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Fetch the image from the URL
    const imageUrl =
      "https://homeinspection1.s3.ap-southeast-1.amazonaws.com/9255c16564d6696066ed91197b2440869b868e98713f353135bed984705cc472";
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // Add the image to the PDF
    doc.image(response.data, {
      fit: [500, 400], // Adjust the size as needed
      align: "center",
      valign: "center",
    });

    // Finalize the PDF and end the stream
    doc.end();

    // Wait for the stream to finish
    writeStream.on("finish", () => {
      res.status(200).sendFile(pdfPath, (err) => {
        if (err) {
          console.error("Error sending the file:", err);
          res.status(500).send({ message: "Error sending the file" });
        } else {
          console.log("PDF created and sent successfully.");
        }
      });
    });
  } catch (err) {
    console.error("Error creating PDF:", err);
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
