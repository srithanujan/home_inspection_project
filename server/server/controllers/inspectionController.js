const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Inspection = require("../models/InspectionModel");
const axios = require("axios");
const moment = require("moment");
const AWS = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const {
  uploadFile,
  deleteFile,
  getObjectSignedUrl,
  listAllFiles,
  deleteFiles,
} = require("../s3");
const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const dirPath = path.resolve(__dirname, "../public/Images/upload_images");
const prisma = new PrismaClient();
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

fs.access(dirPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error("Directory does not exist:", err.message);
  } else {
    fs.chmod(dirPath, 0o755, (err) => {
      if (err) {
        console.error("Error changing permissions:", err.message);
      } else {
        console.log("Permissions changed successfully");
      }
    });
  }
});

function removeSpaces(value) {
  return value.replace(/\s+/g, "");
}

function getValueByKey(dictionary, key) {
  if (dictionary.hasOwnProperty(key)) {
    return dictionary[key];
  } else {
    return [];
  }
}

function convertArrayToObject(arr) {
  const result = {};

  arr.forEach((item) => {
    const [key, value] = item.split("_");
    const valueWithExtension = value + ".png";
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(valueWithExtension);
  });

  return result;
}

async function downloadAllFilesFromBucket(bucketName) {
  try {
    const listParams = {
      Bucket: bucketName,
    };
    const listCommand = new ListObjectsV2Command(listParams);
    const listedObjects = await s3Client.send(listCommand);

    if (!listedObjects.Contents || !listedObjects.Contents.length) {
      console.log("No files found in the specified bucket.");
      return;
    }

    for (const object of listedObjects.Contents) {
      const fileKey = object.Key;
      const fileName = path.basename(fileKey, path.extname(fileKey)) + ".png";
      const downloadPath = path.join(
        process.cwd(),
        "public",
        "Images",
        "upload_images"
      );

      if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true });
      }

      const filePath = path.join(downloadPath, fileName);
      const fileParams = {
        Bucket: bucketName,
        Key: fileKey,
      };
      const getObjectCommand = new GetObjectCommand(fileParams);
      const { Body } = await s3Client.send(getObjectCommand);

      await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        Body.pipe(fileStream)
          .on("error", (err) => {
            console.error(`Error downloading file ${fileName}:`, err);
            reject(err);
          })
          .on("close", () => {
            console.log(`Successfully downloaded ${fileName} to ${filePath}`);
            resolve();
          });
      });
    }
  } catch (error) {
    console.error("Error downloading files:", error);
  }
}

/**
 * Deletes all files in a specified directory.
 *
 * @param {string} dirPath - The path to the directory.
 */
function deleteFilesInDirectory(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        if (stats.isFile()) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
              return;
            }
            console.log(`Deleted file: ${filePath}`);
          });
        } else {
          console.log(`Skipping non-file: ${filePath}`);
        }
      });
    });
  });
}

exports.testAPI = (req, res) => {
  res.status(200).send({ message: "Server is working!" });
};

exports.createPost = async (req, res) => {
  try {
    const file = req.file;
    const { fieldName } = req.body;
    const imageName = generateFileName();

    // Directly use the file buffer without resizing
    const fileBuffer = file.buffer;

    await uploadFile(fileBuffer, imageName, file.mimetype);

    const post = await prisma.posts.create({
      data: {
        imageName,
        fieldName,
      },
    });

    res.status(201).json({ post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAllFiles = async (req, res) => {
  try {
    const files = await listAllFiles();

    if (files.length === 0) {
      return res.status(404).json({ message: "No files found in the bucket" });
    }

    const fileKeys = files.map((file) => file.Key);
    await deleteFiles(fileKeys);
    await prisma.posts.deleteMany({});
    res.status(200).json({ message: "SUCCESS" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await prisma.posts.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await deleteFile(post.imageName);

    await prisma.posts.delete({ where: { id: post.id } });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { fieldName } = req.query;

    const posts = await prisma.posts.findMany({
      where: fieldName ? { fieldName } : {},
      orderBy: { created: "desc" },
    });

    for (let post of posts) {
      post.imageUrl = await getObjectSignedUrl(post.imageName);
    }
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// homeProfilePicture

exports.addInspection = async (req, res) => {
  try {
    const inspection = new Inspection({
      clientInformation: {
        contactName: req.body.clientInformation.contactName,
        clientAddress: req.body.clientInformation.clientAddress,
        phoneNumber: req.body.clientInformation.phoneNumber,
        email: req.body.clientInformation.email,
      },
      inspectionCompany: {
        inspectorName: req.body.inspectionCompany.inspectorName,
        inspectionAddress: req.body.inspectionCompany.inspectionAddress,
        phoneNumber: req.body.inspectionCompany.phoneNumber,
        email: req.body.inspectionCompany.email,
      },
      buildingForm: {
        estimatedAge: req.body.buildingForm.estimatedAge,
        buildingType: req.body.buildingForm.buildingType,
        occupancyState: req.body.buildingForm.occupancyState,
        garage: req.body.buildingForm.garage,
        exterior: req.body.buildingForm.exterior,
        OtherExterior: req.body.buildingForm.OtherExterior,
        weatherCondition: req.body.buildingForm.weatherCondition,
        OtherWeatherCondition: req.body.buildingForm.OtherWeatherCondition,
        soilCondition: req.body.buildingForm.soilCondition,
        OtherSoilCondition: req.body.buildingForm.OtherSoilCondition,
        outdoorTemperature: req.body.buildingForm.outdoorTemperature,
        inspectionDate: req.body.buildingForm.inspectionDate,
        startTime: req.body.buildingForm.startTime,
        endTime: req.body.buildingForm.endTime,
        recentRain: req.body.buildingForm.recentRain,
        electricityOn: req.body.buildingForm.electricityOn,
        OtherElectricityOn: req.body.buildingForm.OtherElectricityOn,
        gasOilOn: req.body.buildingForm.gasOilOn,
        OtherGasOilOn: req.body.buildingForm.OtherGasOilOn,
        waterOn: req.body.buildingForm.waterOn,
        OtherWaterOn: req.body.buildingForm.OtherWaterOn,
      },
      lotsGroundsDetails: {
        driveway: {
          material: req.body.lotsGroundsDetails.driveway.material,
          otherMaterial: req.body.lotsGroundsDetails.driveway.otherMaterial,
          condition: req.body.lotsGroundsDetails.driveway.condition,
          otherCondition: req.body.lotsGroundsDetails.driveway.otherCondition,
          comments: req.body.lotsGroundsDetails.driveway.comments,
          otherComments: req.body.lotsGroundsDetails.driveway.otherComments,
        },
        porch: {
          material: req.body.lotsGroundsDetails.porch.material,
          otherMaterial: req.body.lotsGroundsDetails.porch.otherMaterial,
          condition: req.body.lotsGroundsDetails.porch.condition,
          otherCondition: req.body.lotsGroundsDetails.porch.otherCondition,
          comments: req.body.lotsGroundsDetails.porch.comments,
        },
        stepsHandrails: {
          material: req.body.lotsGroundsDetails.stepsHandrails.material,
          otherMaterial:
            req.body.lotsGroundsDetails.stepsHandrails.otherMaterial,
          condition: req.body.lotsGroundsDetails.stepsHandrails.condition,
          otherCondition:
            req.body.lotsGroundsDetails.stepsHandrails.otherCondition,
          comments: req.body.lotsGroundsDetails.stepsHandrails.comments,
          otherComments:
            req.body.lotsGroundsDetails.stepsHandrails.otherComments,
        },
        deckPatio: {
          material: req.body.lotsGroundsDetails.deckPatio.material,
          otherMaterial: req.body.lotsGroundsDetails.deckPatio.otherMaterial,
          condition: req.body.lotsGroundsDetails.deckPatio.condition,
          otherCondition: req.body.lotsGroundsDetails.deckPatio.otherCondition,
          comments: req.body.lotsGroundsDetails.deckPatio.comments,
        },
        fence: {
          material: req.body.lotsGroundsDetails.fence.material,
          otherMaterial: req.body.lotsGroundsDetails.fence.otherMaterial,
          condition: req.body.lotsGroundsDetails.fence.condition,
          otherCondition: req.body.lotsGroundsDetails.fence.otherCondition,
          comments: req.body.lotsGroundsDetails.fence.comments,
          otherComments: req.body.lotsGroundsDetails.fence.otherComments,
        },
        landscaping: {
          recommendations:
            req.body.lotsGroundsDetails.landscaping.recommendations,
          otherRecommendations:
            req.body.lotsGroundsDetails.landscaping.otherRecommendations,
        },
      },
      roofDetails: {
        roofDescription: {
          style: req.body.roofDetails.roofDescription.style,
          pitch: req.body.roofDetails.roofDescription.pitch,
          visibility: req.body.roofDetails.roofDescription.visibility,
          methodOfInspection:
            req.body.roofDetails.roofDescription.methodOfInspection,
          otherMethodOfInspection:
            req.body.roofDetails.roofDescription.otherMethodOfInspection,
          ventilationPresent:
            req.body.roofDetails.roofDescription.ventilationPresent,
          ventilationType: req.body.roofDetails.roofDescription.ventilationType,
          otherVentilationType:
            req.body.roofDetails.roofDescription.otherVentilationType,
        },
        conditionOfCoverings: {
          material: req.body.roofDetails.conditionOfCoverings.material,
          otherMaterial:
            req.body.roofDetails.conditionOfCoverings.otherMaterial,
          condition: req.body.roofDetails.conditionOfCoverings.condition,
          otherCondition:
            req.body.roofDetails.conditionOfCoverings.otherCondition,
        },
        plumbingVents: {
          material: req.body.roofDetails.plumbingVents.material,
          otherMaterial: req.body.roofDetails.plumbingVents.otherMaterial,
          condition: req.body.roofDetails.plumbingVents.condition,
          otherCondition: req.body.roofDetails.plumbingVents.otherCondition,
        },
      },
      exteriorDetails: {
        exterior: req.body.exteriorDetails.exterior.map((exterior) => ({
          name: exterior.name,
          exteriorWallType: exterior.exteriorWallType,
          otherExteriorWallType: exterior.otherExteriorWallType,
          exteriorWallCondition: exterior.exteriorWallCondition,
          otherExteriorWallCondition: exterior.otherExteriorWallCondition,
          foundationType: exterior.foundationType,
          otherFoundationType: exterior.otherFoundationType,
          foundationCondition: exterior.foundationCondition,
          otherFoundationCondition: exterior.otherFoundationCondition,
          foundationComments: exterior.foundationComments,
          otherFoundationComments: exterior.otherFoundationComments,
          mainEntryDoor: exterior.mainEntryDoor,
          otherMainEntryDoor: exterior.otherMainEntryDoor,
          mainEntryDoorCondition: exterior.mainEntryDoorCondition,
          otherMainEntryDoorCondition: exterior.otherMainEntryDoorCondition,
          weatherStripping: exterior.weatherStripping,
          otherWeatherStripping: exterior.otherWeatherStripping,
          stormDoor: exterior.stormDoor,
          otherStormDoor: exterior.otherStormDoor,
          stormDoorCondition: exterior.stormDoorCondition,
          otherStormDoorCondition: exterior.otherStormDoorCondition,
          doorbell: exterior.doorbell,
          otherDoorbell: exterior.otherDoorbell,
          doorbellType: exterior.doorbellType,
          otherDoorbellType: exterior.otherDoorbellType,
          sideDoor: exterior.sideDoor,
          otherSideDoor: exterior.otherSideDoor,
          sideDoorCondition: exterior.sideDoorCondition,
          otherSideDoorCondition: exterior.otherSideDoorCondition,
          sideDoorWeatherStripping: exterior.sideDoorWeatherStripping,
          otherSideDoorWeatherStripping: exterior.otherSideDoorWeatherStripping,
          patioDoor: exterior.patioDoor,
          otherPatioDoor: exterior.otherPatioDoor,
          patioDoorCondition: exterior.patioDoorCondition,
          otherPatioDoorCondition: exterior.otherPatioDoorCondition,
          patioDoorComments: exterior.patioDoorComments,
          patioScreenDoor: exterior.patioScreenDoor,
          otherPatioScreenDoor: exterior.otherPatioScreenDoor,
          patioScreenDoorCondition: exterior.patioScreenDoorCondition,
          otherPatioScreenDoorCondition: exterior.otherPatioScreenDoorCondition,
          patioScreenDoorComments: exterior.patioScreenDoorComments,
          exteriorDoorsComments: exterior.exteriorDoorsComments,
          guttersDownspoutsRoofDrainageMaterial:
            exterior.guttersDownspoutsRoofDrainageMaterial,
          otherGuttersDownspoutsRoofDrainageMaterial:
            exterior.otherGuttersDownspoutsRoofDrainageMaterial,
          guttersDownspoutsRoofDrainageCondition:
            exterior.guttersDownspoutsRoofDrainageCondition,
          otherGuttersDownspoutsRoofDrainageCondition:
            exterior.otherGuttersDownspoutsRoofDrainageCondition,
          guttersDownspoutsRoofDrainageLeaking:
            exterior.guttersDownspoutsRoofDrainageLeaking,
          otherGuttersDownspoutsRoofDrainageLeaking:
            exterior.otherGuttersDownspoutsRoofDrainageLeaking,
          guttersDownspoutsRoofDrainageAttachment:
            exterior.guttersDownspoutsRoofDrainageAttachment,
          otherGuttersDownspoutsRoofDrainageAttachment:
            exterior.otherGuttersDownspoutsRoofDrainageAttachment,
          guttersDownspoutsRoofDrainageExtensionNeeded:
            exterior.guttersDownspoutsRoofDrainageExtensionNeeded,
          otherGuttersDownspoutsRoofDrainageExtensionNeeded:
            exterior.otherGuttersDownspoutsRoofDrainageExtensionNeeded,
          guttersDownspoutsRoofDrainageComments:
            exterior.guttersDownspoutsRoofDrainageComments,
          windowsAndPatioDoorsApproximateAge:
            exterior.windowsAndPatioDoorsApproximateAge,
          otherWindowsAndPatioDoorsApproximateAge:
            exterior.otherWindowsAndPatioDoorsApproximateAge,
          windowsAndPatioDoorsMaterialAndType:
            exterior.windowsAndPatioDoorsMaterialAndType,
          otherWindowsAndPatioDoorsMaterialAndType:
            exterior.otherWindowsAndPatioDoorsMaterialAndType,
          windowsAndPatioDoorsCondition: exterior.windowsAndPatioDoorsCondition,
          otherWindowsAndPatioDoorsCondition:
            exterior.otherWindowsAndPatioDoorsCondition,
          windowsAndPatioDoorsComments: exterior.windowsAndPatioDoorsComments,
          otherWindowsAndPatioDoorsComments:
            exterior.otherWindowsAndPatioDoorsComments,
          windowScreensMaterial: exterior.windowScreensMaterial,
          otherWindowScreensMaterial: exterior.otherWindowScreensMaterial,
          windowScreensCondition: exterior.windowScreensCondition,
          otherWindowScreensCondition: exterior.otherWindowScreensCondition,
          windowScreensComments: exterior.windowScreensComments,
          otherWindowScreensComments: exterior.otherWindowScreensComments,
          basementWindowsMaterial: exterior.basementWindowsMaterial,
          otherBasementWindowsMaterial: exterior.otherBasementWindowsMaterial,
          basementWindowsComments: exterior.basementWindowsComments,
          otherBasementWindowsComments: exterior.otherBasementWindowsComments,
          patioDoorMaterial: exterior.patioDoorMaterial,
          otherPatioDoorMaterial: exterior.otherPatioDoorMaterial,
          otherPatioDoorComments: exterior.otherPatioDoorComments,
          patioScreenDoorMaterial: exterior.patioScreenDoorMaterial,
          otherPatioScreenDoorMaterial: exterior.otherPatioScreenDoorMaterial,
          otherPatioScreenDoorComments: exterior.otherPatioScreenDoorComments,
          gasMeterComments: exterior.gasMeterComments,
          otherGasMeterComments: exterior.otherGasMeterComments,
          electricalExteriorOutletsAndLights:
            exterior.electricalExteriorOutletsAndLights,
          otherElectricalExteriorOutletsAndLights:
            exterior.otherElectricalExteriorOutletsAndLights,
          exteriorHoseBibsDescription: exterior.exteriorHoseBibsDescription,
          otherExteriorHoseBibsDescription:
            exterior.otherExteriorHoseBibsDescription,
          airConditioningManufacturer: exterior.airConditioningManufacturer,
          otherAirConditioningManufacturer:
            exterior.otherAirConditioningManufacturer,
          airConditioningApproximateAge: exterior.airConditioningApproximateAge,
          otherAirConditioningApproximateAge:
            exterior.otherAirConditioningApproximateAge,
          airConditioningAreaServed: exterior.airConditioningAreaServed,
          otherAirConditioningAreaServed:
            exterior.otherAirConditioningAreaServed,
          airConditioningFuelType: exterior.airConditioningFuelType,
          otherAirConditioningFuelType: exterior.otherAirConditioningFuelType,
          airConditioningCondition: exterior.airConditioningCondition,
          otherAirConditioningCondition: exterior.otherAirConditioningCondition,
          airConditioningCondenserFins: exterior.airConditioningCondenserFins,
          otherAirConditioningCondenserFins:
            exterior.otherAirConditioningCondenserFins,
          airConditioningCabinetHousing: exterior.airConditioningCabinetHousing,
          otherAirConditioningCabinetHousing:
            exterior.otherAirConditioningCabinetHousing,
          airConditioningRefrigerantLineInsulation:
            exterior.airConditioningRefrigerantLineInsulation,
          otherAirConditioningRefrigerantLineInsulation:
            exterior.otherAirConditioningRefrigerantLineInsulation,
          airConditioningSystemOperation:
            exterior.airConditioningSystemOperation,
          otherAirConditioningSystemOperation:
            exterior.otherAirConditioningSystemOperation,
          airConditioningComments: exterior.airConditioningComments,
          otherAirConditioningComments: exterior.otherAirConditioningComments,
        })),
      },
      garageCarportDetails: {
        type: req.body.garageCarportDetails.type,
        otherType: req.body.garageCarportDetails.otherType,
        garageDoor: req.body.garageCarportDetails.garageDoor,
        otherGarageDoor: req.body.garageCarportDetails.otherGarageDoor,
        automaticOpener: req.body.garageCarportDetails.automaticOpener,
        otherAutomaticOpener:
          req.body.garageCarportDetails.otherAutomaticOpener,
        safetyReverses: req.body.garageCarportDetails.safetyReverses,
        otherSafetyReverses: req.body.garageCarportDetails.otherSafetyReverses,
        roofing: req.body.garageCarportDetails.roofing,
        otherRoofing: req.body.garageCarportDetails.otherRoofing,
        floorFoundation: req.body.garageCarportDetails.floorFoundation,
        otherFloorFoundation:
          req.body.garageCarportDetails.otherFloorFoundation,
        floorFoundationCondition:
          req.body.garageCarportDetails.floorFoundationCondition,
        otherFloorFoundationCondition:
          req.body.garageCarportDetails.otherFloorFoundationCondition,
        ceiling: req.body.garageCarportDetails.ceiling,
        otherCeiling: req.body.garageCarportDetails.otherCeiling,
        ceilingCondition: req.body.garageCarportDetails.ceilingCondition,
        otherCeilingCondition:
          req.body.garageCarportDetails.otherCeilingCondition,
        exteriorWalls: req.body.garageCarportDetails.exteriorWalls,
        otherExteriorWalls: req.body.garageCarportDetails.otherExteriorWalls,
        interiorWalls: req.body.garageCarportDetails.interiorWalls,
        otherInteriorWalls: req.body.garageCarportDetails.otherInteriorWalls,
        serviceDoor: req.body.garageCarportDetails.serviceDoor,
        otherServiceDoor: req.body.garageCarportDetails.otherServiceDoor,
        serviceDoorCondition:
          req.body.garageCarportDetails.serviceDoorCondition,
        otherServiceDoorCondition:
          req.body.garageCarportDetails.otherServiceDoorCondition,
        serviceDoorSelfClose:
          req.body.garageCarportDetails.serviceDoorSelfClose,
        otherServiceDoorSelfClose:
          req.body.garageCarportDetails.otherServiceDoorSelfClose,
        electrical: req.body.garageCarportDetails.electrical,
        otherElectrical: req.body.garageCarportDetails.otherElectrical,
        fireSeparationWall: req.body.garageCarportDetails.fireSeparationWall,
        otherFireSeparationWall:
          req.body.garageCarportDetails.otherFireSeparationWall,
        comments: req.body.garageCarportDetails.comments,
      },
      kitchenDetails: {
        kitchens: req.body.kitchenDetails.kitchens.map((kitchen) => ({
          name: kitchen.name,
          countertopsCondition: kitchen.countertopsCondition,
          otherCountertopsCondition: kitchen.otherCountertopsCondition,
          countertopsComments: kitchen.countertopsComments,
          otherCountertopsComments: kitchen.otherCountertopsComments,
          cabinetsCondition: kitchen.cabinetsCondition,
          otherCabinetsCondition: kitchen.otherCabinetsCondition,
          cabinetsComments: kitchen.cabinetsComments,
          otherCabinetsComments: kitchen.otherCabinetsComments,
          plumbingCondition: kitchen.plumbingCondition,
          otherPlumbingCondition: kitchen.otherPlumbingCondition,
          faucet: kitchen.faucet,
          otherFaucet: kitchen.otherFaucet,
          functionalDrainage: kitchen.functionalDrainage,
          otherFunctionalDrainage: kitchen.otherFunctionalDrainage,
          floorMaterial: kitchen.floorMaterial,
          otherFloorMaterial: kitchen.otherFloorMaterial,
          floorCondition: kitchen.floorCondition,
          otherFloorCondition: kitchen.otherFloorCondition,
          floorComments: kitchen.floorComments,
          otherFloorComments: kitchen.otherFloorComments,
          wallsCondition: kitchen.wallsCondition,
          otherWallsCondition: kitchen.otherWallsCondition,
          ceilingsCondition: kitchen.ceilingsCondition,
          otherCeilingsCondition: kitchen.otherCeilingsCondition,
          electricalCondition: kitchen.electricalCondition,
          otherElectricalCondition: kitchen.otherElectricalCondition,
          rangeCondition: kitchen.rangeCondition,
          otherRangeCondition: kitchen.otherRangeCondition,
          rangeStatus: kitchen.rangeStatus,
          otherRangeStatus: kitchen.otherRangeStatus,
          dishwasherCondition: kitchen.dishwasherCondition,
          otherDishwasherCondition: kitchen.otherDishwasherCondition,
          dishwasherStatus: kitchen.dishwasherStatus,
          otherDishwasherStatus: kitchen.otherDishwasherStatus,
          rangeHoodFanCondition: kitchen.rangeHoodFanCondition,
          otherRangeHoodFanCondition: kitchen.otherRangeHoodFanCondition,
          rangeHoodFanStatus: kitchen.rangeHoodFanStatus,
          otherRangeHoodFanStatus: kitchen.otherRangeHoodFanStatus,
          refrigeratorCondition: kitchen.refrigeratorCondition,
          otherRefrigeratorCondition: kitchen.otherRefrigeratorCondition,
          refrigeratorStatus: kitchen.refrigeratorStatus,
          otherRefrigeratorStatus: kitchen.otherRefrigeratorStatus,
          microwaveCondition: kitchen.microwaveCondition,
          otherMicrowaveCondition: kitchen.otherMicrowaveCondition,
          microwaveStatus: kitchen.microwaveStatus,
          otherMicrowaveStatus: kitchen.otherMicrowaveStatus,
          openGroundReversePolarity: kitchen.openGroundReversePolarity,
        })),
      },
      bathroomsDetails: {
        bathrooms: req.body.bathroomsDetails.bathrooms.map((bathroom) => ({
          name: bathroom.name,
          floorMaterial: bathroom.floorMaterial,
          floorOtherMaterial: bathroom.floorOtherMaterial,
          floorCondition: bathroom.floorCondition,
          floorOtherCondition: bathroom.floorOtherCondition,
          wallsMaterial: bathroom.wallsMaterial,
          wallsOtherMaterial: bathroom.wallsOtherMaterial,
          wallsCondition: bathroom.wallsCondition,
          wallsOtherCondition: bathroom.wallsOtherCondition,
          ceilingMaterial: bathroom.ceilingMaterial,
          ceilingOtherMaterial: bathroom.ceilingOtherMaterial,
          ceilingCondition: bathroom.ceilingCondition,
          ceilingOtherCondition: bathroom.ceilingOtherCondition,
          doorMaterial: bathroom.doorMaterial,
          doorOtherMaterial: bathroom.doorOtherMaterial,
          doorCondition: bathroom.doorCondition,
          doorOtherCondition: bathroom.doorOtherCondition,
          windows: bathroom.windows,
          otherWindows: bathroom.otherWindows,
          electrical: bathroom.electrical,
          otherElectrical: bathroom.otherElectrical,
          counterCabinet: bathroom.counterCabinet,
          otherCounterCabinet: bathroom.otherCounterCabinet,
          sinkBasin: bathroom.sinkBasin,
          otherSinkBasin: bathroom.otherSinkBasin,
          plumbing: bathroom.plumbing,
          otherPlumbing: bathroom.otherPlumbing,
          toilet: bathroom.toilet,
          otherToilet: bathroom.otherToilet,
          bathtub: bathroom.bathtub,
          otherBathtub: bathroom.otherBathtub,
          standingShower: bathroom.standingShower,
          otherStandingShower: bathroom.otherStandingShower,
          faucets: bathroom.faucets,
          otherFaucets: bathroom.otherFaucets,
          waterFlow: bathroom.waterFlow,
          otherWaterFlow: bathroom.otherWaterFlow,
          moistureStains: bathroom.moistureStains,
          otherMoistureStains: bathroom.otherMoistureStains,
          heatSource: bathroom.heatSource,
          otherHeatSource: bathroom.otherHeatSource,
          ventilation: bathroom.ventilation,
          otherVentilation: bathroom.otherVentilation,
        })),
      },
      roomsDetails: {
        rooms: req.body.roomsDetails.rooms.map((room) => ({
          name: room.name,
          wallsMaterial: room.wallsMaterial,
          otherWallsMaterial: room.otherWallsMaterial,
          wallsCondition: room.wallsCondition,
          otherWallsCondition: room.otherWallsCondition,
          ceilingMaterial: room.ceilingMaterial,
          otherCeilingMaterial: room.otherCeilingMaterial,
          ceilingCondition: room.ceilingCondition,
          otherCeilingCondition: room.otherCeilingCondition,
          closetType: room.closetType,
          otherClosetType: room.otherClosetType,
          closetCondition: room.closetCondition,
          otherClosetCondition: room.otherClosetCondition,
          floorsMaterial: room.floorsMaterial,
          otherFloorsMaterial: room.otherFloorsMaterial,
          floorsCondition: room.floorsCondition,
          otherFloorsCondition: room.otherFloorsCondition,
          doorMaterial: room.doorMaterial,
          otherDoorMaterial: room.otherDoorMaterial,
          doorCondition: room.doorCondition,
          otherDoorCondition: room.otherDoorCondition,
          windows: room.windows,
          otherWindows: room.otherWindows,
          electrical: room.electrical,
          otherElectrical: room.otherElectrical,
          heatSource: room.heatSource,
          otherHeatSource: room.otherHeatSource,
          moistureStains: room.moistureStains,
          otherMoistureStains: room.otherMoistureStains,
          comments: room.comments,
        })),
      },
      ImageUploadFiles: req.body.ImageUploadFiles,
    });

    await inspection.save();
    res.status(201).send({ message: "SUCCESS" });

    // Assuming you have a function to download files from an AWS bucket
    const bucketName = process.env.AWS_BUCKET_NAME;
    downloadAllFilesFromBucket(bucketName);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find();
    res.status(200).send(inspections);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.uploadFile = (req, res, next) => {
  const file = req.file;

  if (!file) {
    const error = new Error("Please upload a file");
    error.status = 400;
    return next(error);
  }

  res.status(200).json({
    message: "File uploaded successfully",
    filename: file.filename,
    path: file.path,
  });
};

// exports.generatePDFs = async (req, res) => {
//   console.log("hi i'm here");
//   try {
//     const inspection = await Inspection.findOne().sort({ _id: -1 });
//     if (!inspection) {
//       return res.status(404).send({ message: "Inspection not found" });
//     }

//     res.setHeader("Content-disposition", "attachment; filename=report.pdf");
//     res.setHeader("Content-type", "application/pdf");
//     const doc = new PDFDocument();
//     doc.pipe(res);

//     // Add logo
//     doc.image("./public/Images/logo.png", {
//       fit: [125, 125],
//       align: "center",
//       valign: "center",
//       y: doc.y - 40,
//       x: doc.x - 20,
//     });

//     // Add title
//     doc.moveDown(1);
//     doc
//       .font("Times-Roman")
//       .fontSize(36)
//       .font("Times-BoldItalic")
//       .text("EYE-TECH", 200, 50);
//     doc
//       .font("Times-Roman")
//       .fontSize(36)
//       .font("Times-BoldItalic")
//       .text("Home Inspections Inc.", 200, 90);

//     // Add report title
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(36)
//       .text(
//         "HOME INSPECTION REPORT",
//         (doc.page.width - doc.widthOfString("HOME INSPECTION REPORT")) / 3 + 3,
//         200
//       );

//     // Add house image
//     // doc.image('./public/Images/house.png', 130, undefined, { width: 350 });

//     const imagesDir = "./public/Images/upload_images";
//     const images = fs.readdirSync(imagesDir).filter((file) => {
//       const ext = path.extname(file).toLowerCase();
//       return ext === ".png" || ext === ".jpg" || ext === ".jpeg";
//     });

//     const imageWidth = 50;
//     const imageHeight = 50;
//     const imageHomeWidth = 350;
//     const imageHomeHeight = 350;
//     const pageWidth = doc.page.width;

//     const totalImageWidth = images.length * imageHomeWidth;
//     const totalImageHomeWidth = images.length * imageWidth;

//     const spacing = (pageWidth - totalImageWidth) / (images.length + 1);
//     const imageSpacing =
//       (pageWidth - totalImageHomeWidth) / (images.length + 1);

//     let x = spacing;
//     const y = doc.y + 20;

//     const arrayImageFileNames = convertArrayToObject(
//       inspection?.ImageUploadFiles
//     );
//     const getHomeProfileImagesFileNames = getValueByKey(
//       arrayImageFileNames,
//       "homeprofilePicture"
//     );
//     const getDrivewayImagesFileNames = getValueByKey(
//       arrayImageFileNames,
//       "drivayParking"
//     );
//     const getHandRailsImagesFileNames = getValueByKey(
//       arrayImageFileNames,
//       "handrailsImage"
//     );
//     const getBalconyImagesFileNames = getValueByKey(
//       arrayImageFileNames,
//       "balconyImage"
//     );
//     const getFenceImagesFileNames = getValueByKey(
//       arrayImageFileNames,
//       "fenceImage"
//     );
//     const getLandscapingImagesFileNames = getValueByKey(
//       arrayImageFileNames,
//       "landscapingImage"
//     );
//     // const exteriorWallImagesFileNames = getValueByKey(arrayImageFileNames, 'exteriorWallImage');
//     // const foundationImagesFileNames = getValueByKey(arrayImageFileNames, 'foundationImage');
//     // const gasMeterImagesFileNames = getValueByKey(arrayImageFileNames, 'gasMeterImage');
//     // const electricalImagesFileNames = getValueByKey(arrayImageFileNames, 'electricalImage');
//     // const exteriorHoseBibsImagesFileNames = getValueByKey(arrayImageFileNames, 'exteriorHoseBibsImage');
//     // const airConditioningImagesFileNames = getValueByKey(arrayImageFileNames, 'airConditioningImage');
//     // const guttersDownspoutsRoofDrainageImagesFileNames = getValueByKey(arrayImageFileNames, 'guttersDownspoutsRoofDrainageImage');
//     // const windowScreensImagesFileNames = getValueByKey(arrayImageFileNames, 'windowScreensImage');
//     // const windowsAndPatioDoorsImagesFileNames = getValueByKey(arrayImageFileNames, 'windowsAndPatioDoorsImage');
//     // const basementWindowsImagesFileNames = getValueByKey(arrayImageFileNames, 'basementWindowsImage');
//     const garageCarpetImagesFileNames = getValueByKey(
//       arrayImageFileNames,
//       "garageCarportImage"
//     );

//     getHomeProfileImagesFileNames?.forEach((image) => {
//       doc.image(path.join(imagesDir, image), x, y, {
//         width: imageHomeWidth,
//         height: imageHomeHeight,
//       });
//       x += imageHomeWidth + spacing;
//     });

//     // Add client address and date
//     const bottomY = doc.page.height - 120;
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(20)
//       .text(`${inspection.clientInformation.clientAddress}`, 0, bottomY, {
//         align: "center",
//         width: doc.page.width,
//       });
//     doc.text("APRIL 17, 2024", { align: "center" });
//     doc.moveDown(1);

//     // Add new page
//     doc.addPage();

//     // Add general information
//     doc.font("Helvetica-Bold").fontSize(20).text("GENERAL INFORMATION");
//     doc
//       .moveTo(70, doc.y)
//       .lineTo(doc.page.width - 50, doc.y)
//       .stroke();
//     doc.moveDown(0.5);

//     // Add client information
//     doc.font("Helvetica-Bold").fontSize(14).text("CLIENT INFORMATION");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Property Address: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.clientInformation.clientAddress)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Contact name: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.clientInformation.contactName)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Phone No: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.clientInformation.phoneNumber)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Email: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.clientInformation.email)
//       .fillColor("black");

//     // Add inspection company information
//     doc.moveDown(1);
//     doc.font("Helvetica-Bold").fontSize(14).text("INSPECTION COMPANY");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Inspector name: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.inspectionCompany.inspectorName)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Company name: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text("EYE-TECH Home Inspections Inc.")
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Phone no: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.inspectionCompany.phoneNumber)
//       .fillColor("black");
//     doc.moveDown(6);

//     doc
//       .moveTo(98, doc.y)
//       .lineTo(doc.page.width - 98, doc.y)
//       .stroke();
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(20)
//       .text("DEFINITIONS", { align: "center" });
//     doc
//       .moveTo(98, doc.y)
//       .lineTo(doc.page.width - 98, doc.y)
//       .stroke();
//     doc.moveDown();
//     doc
//       .fontSize(12)
//       .text(
//         "NOTE: All definitions listed below refer to the property or item listed as inspected on this report at the time of inspection"
//       );
//     doc.moveDown(2);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Acceptable: Functional with no obvious signs of defects");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text(
//         "Marginal: Item is not fully functional and requires repair or servicing"
//       );
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text(
//         "Defective: Item needs immediate repair or replacement. It is unable to perform its intended function."
//       );
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Not present: Item not present or not found");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text(
//         "Not inspected: Item was unable to be inspected for safety reasons or due to lack of power, Inaccessible or disconnected."
//       );

//     // Add building data
//     doc.addPage();
//     doc.font("Helvetica-Bold").fontSize(20).text("BUILDING DATA");
//     doc
//       .moveTo(70, doc.y)
//       .lineTo(doc.page.width - 50, doc.y)
//       .stroke();
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Estimated age: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.estimatedAge)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Building type: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.buildingType)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("State of Occupancy: ", {
//         align: "left",
//         indent: 0,
//         continued: true,
//       })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.occupancyState)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Garage: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.garage)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Exterior: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.exterior)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Electricity ON: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.electricityOn)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Gas/Oil ON: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.gasOilOn)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Water ON: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.waterOn)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Weather condition: ", {
//         align: "left",
//         indent: 0,
//         continued: true,
//       })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.weatherCondition)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Recent rain: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.recentRain)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Soil condition: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.soilCondition)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Outdoor temp: Approx.: ", {
//         align: "left",
//         indent: 0,
//         continued: true,
//       })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.outdoorTemperature)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Inspection date: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.buildingForm.inspectionDate)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Start time: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(
//         `Start time: ${inspection.buildingForm.startTime} End time: ${inspection.buildingForm.endTime}`
//       )
//       .fillColor("black");

//     // Add lots and grounds details
//     doc.addPage();
//     doc.font("Helvetica-Bold").fontSize(20).text("LOTS AND GROUNDS");
//     doc
//       .moveTo(70, doc.y)
//       .lineTo(doc.page.width - 50, doc.y)
//       .stroke();
//     doc.moveDown(1);
//     doc.font("Helvetica-Bold").fontSize(14).text("DRIVEWAY/PARKING");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Material: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.driveway.material)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Condition: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.driveway.condition)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Comments: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.driveway.comments)
//       .fillColor("black");

//     doc.moveDown(1);

//     if (getDrivewayImagesFileNames?.length === 0) {
//       console.log("No images to add.");
//       // You can add additional logic here, such as adding a placeholder image or text
//       doc.text("No images available", x, y);
//     } else {
//       getDrivewayImagesFileNames.forEach((image) => {
//         doc.image(path.join(imagesDir, image), x, y, {
//           width: imageWidth,
//           height: imageHeight,
//         });
//         x += imageWidth + spacing;
//       });
//     }

//     doc.moveDown(1);

//     doc.font("Helvetica-Bold").fontSize(14).text("PORCH");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Material: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.porch.material)
//       .fillColor("black");

//     if (
//       !getHomeProfileImagesFileNames ||
//       getHomeProfileImagesFileNames.length === 0
//     ) {
//       console.log("No images to add.");
//       // Add additional logic here, such as adding a placeholder image or text
//       doc.text("No images available", x, y);
//     } else {
//       getHomeProfileImagesFileNames.forEach((image) => {
//         doc.image(path.join(imagesDir, image), x, y, {
//           width: imageWidth,
//           height: imageHeight,
//         });
//         x += imageWidth + spacing;
//       });
//     }

//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Steps and Handrails: ", {
//         align: "left",
//         indent: 45,
//         continued: true,
//       })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.stepsHandrails.material)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Condition: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.porch.condition)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Comments: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.porch.comments)
//       .fillColor("black");

//     doc.moveDown(1);

//     if (getHandRailsImagesFileNames?.length === 0) {
//       console.log("No images to add.");
//       // You can add additional logic here, such as adding a placeholder image or text
//       doc.text("No images available", x, y);
//     } else {
//       getHandRailsImagesFileNames.forEach((image) => {
//         doc.image(path.join(imagesDir, image), x, y, {
//           width: imageWidth,
//           height: imageHeight,
//         });
//         x += imageWidth + spacing;
//       });
//     }

//     doc.moveDown(1);
//     doc.font("Helvetica-Bold").fontSize(14).text("DECK /PATIO");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Material: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.deckPatio.material)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Condition: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.deckPatio.condition)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Condition: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.deckPatio.comments)
//       .fillColor("black");

//     doc.moveDown(1);

//     if (!getBalconyImagesFileNames || getBalconyImagesFileNames.length === 0) {
//       console.log("No images to add.");
//       // Add additional logic here, such as adding a placeholder image or text
//       doc.text("No images available", x, y);
//     } else {
//       getBalconyImagesFileNames.forEach((image) => {
//         doc.image(path.join(imagesDir, image), x, y, {
//           width: imageWidth,
//           height: imageHeight,
//         });
//         x += imageWidth + spacing;
//       });
//     }

//     doc.moveDown(1);
//     doc.font("Helvetica-Bold").fontSize(14).text("FENCE");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Material: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.fence.material)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Condition: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.fence.condition)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Comments: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.lotsGroundsDetails.fence.comments)
//       .fillColor("black");

//     if (!getFenceImagesFileNames || getFenceImagesFileNames.length === 0) {
//       console.log("No images to add.");
//       // Add additional logic here, such as adding a placeholder image or text
//       doc.text("No images available", x, y);
//     } else {
//       getFenceImagesFileNames.forEach((image) => {
//         doc.image(path.join(imagesDir, image), x, y, {
//           width: imageWidth,
//           height: imageHeight,
//         });
//         x += imageWidth + spacing;
//       });
//     }

//     doc.addPage();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("LANDSCAPING AFFECTING FOUNDATION");
//     doc
//       .font("Helvetica")
//       .fontSize(14)
//       .text(inspection.lotsGroundsDetails.landscaping.recommendations);

//     doc.moveDown(1);

//     if (
//       !getLandscapingImagesFileNames ||
//       getLandscapingImagesFileNames.length === 0
//     ) {
//       console.log("No images to add.");
//       // Add additional logic here, such as adding a placeholder image or text
//       doc.text("No images available", x, y);
//     } else {
//       getLandscapingImagesFileNames.forEach((image) => {
//         doc.image(path.join(imagesDir, image), x, y, {
//           width: imageWidth,
//           height: imageHeight,
//         });
//         x += imageWidth + spacing;
//       });
//     }

//     // Add roof details
//     doc.addPage();
//     doc.font("Helvetica-Bold").fontSize(20).text("ROOF");
//     doc
//       .moveTo(70, doc.y)
//       .lineTo(doc.page.width - 50, doc.y)
//       .stroke();
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(11)
//       .text(
//         "I’m not a professional roofer. Feel free to hire a professional roofer prior to closing to find the exact condition of the roof. I will do my best to inspect the roof system within my limitations."
//       );
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(11)
//       .text(
//         "It’s virtually impossible to detect a leak except as it’s occurring or by specific water tests which are beyond the scope of my inspection. Recommend inspecting roofs annually to monitor the condition. Performance of roofing can be unpredictable due to severe weather conditions and animal damage. A leak-free lifespan is impossible to predict. Leakage is most likely to occur at joints where surface transitions as well as roof penetrations (chimneys, pipes, vents). It is proactive and recommended to have the roof done when the covering is showing signs of deterioration and BEFORE leaks are showing. I recommend that you ask the seller for receipts for roofing work to find out its age and if there is any remaining warranty, and that you include comprehensive roof coverage in your home insurance policy."
//       );
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Style of roof: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.roofDetails.roofDescription.style)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Pitch: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.roofDetails.roofDescription.pitch)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Visibility: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.roofDetails.roofDescription.visibility)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Method of Inspection: ", {
//         align: "left",
//         indent: 0,
//         continued: true,
//       })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.roofDetails.roofDescription.methodOfInspection)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Ventilation Present: ", {
//         align: "left",
//         indent: 0,
//         continued: true,
//       })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.roofDetails.roofDescription.ventilationPresent)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Ventilation Type: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.roofDetails.roofDescription.ventilationType)
//       .fillColor("black");

//     doc.moveDown(1);
//     doc.font("Helvetica-Bold").fontSize(14).text("CONDITION OF ROOF COVERINGS");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Material: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.roofDetails.conditionOfCoverings.material)
//       .fillColor("black");
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Condition: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.roofDetails.conditionOfCoverings.condition)
//       .fillColor("black");

//     doc.font("Helvetica-Bold").fontSize(14).text("PLUMBING VENTS");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Plumbing vents: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.roofDetails.plumbingVents.material)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Condition: ", { align: "left", indent: 0, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.roofDetails.plumbingVents.condition)
//       .fillColor("black");

//     doc.moveDown(2);
//     doc
//       .font("Helvetica")
//       .fontSize(8)
//       .text("*Conditions reported above reflects visible portion only");

//     // Add exterior details

//     doc.addPage();

//     const addExteriorHeader = (doc) => {
//       doc.font("Helvetica-Bold").fontSize(20).text("EXTERIOR");
//       doc
//         .moveTo(70, doc.y)
//         .lineTo(doc.page.width - 50, doc.y)
//         .stroke();
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "All exterior elements are inspected for condition, function, and potential issues.",
//           { indent: 0 }
//         );
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("NOTE: ", { align: "left", indent: 0, continued: true })
//         .font("Helvetica")
//         .fillColor("black")
//         .text(
//           "Some issues may only become apparent under certain conditions, which may differ from the inspection conditions."
//         )
//         .fillColor("black");
//       doc.moveDown(1);
//     };

//     const addExteriorDetails = (doc, exterior, index) => {
//       const startY = doc.y;
//       const pageHeight = doc.page.height;
//       const marginBottom = 50;
//       // Estimate the height of the exterior details block
//       const exteriorDetailsHeight = 14 * 30; // 30 lines of text with font size 14
//       // Check if adding the exterior details will overflow the page

//       const exteriorWallImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "exteriorWallImage" + index
//       );
//       const foundationImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "foundationImage" + index
//       );
//       const gasMeterImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "gasMeterImage" + index
//       );
//       const electricalImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "electricalImage" + index
//       );
//       const exteriorHoseBibsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "exteriorHoseBibsImage" + index
//       );
//       const airConditioningImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "airConditioningImage" + index
//       );
//       const guttersDownspoutsRoofDrainageImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "guttersDownspoutsRoofDrainageImage" + index
//       );
//       const windowScreensImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "windowScreensImage" + index
//       );
//       const windowsAndPatioDoorsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "windowsAndPatioDoorsImage" + index
//       );
//       const basementWindowsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "basementWindowsImage" + index
//       );

//       if (startY + exteriorDetailsHeight > pageHeight - marginBottom) {
//         doc.addPage();
//         addExteriorHeader(doc);
//       }
//       doc.font("Helvetica-Bold").fontSize(14).text("EXTERIOR WALL");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Type: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.exteriorWallType)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.exteriorWallCondition)
//         .fillColor("black");
//       doc.moveDown(1);

//       if (
//         !exteriorWallImagesFileNames ||
//         exteriorWallImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         exteriorWallImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }

//       doc.moveDown(1);
//       doc.font("Helvetica-Bold").fontSize(14).text("FOUNDATION");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Type: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.foundationType)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.foundationCondition)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Comments: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.foundationComments)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !foundationImagesFileNames ||
//         foundationImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         foundationImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc.font("Helvetica-Bold").fontSize(14).text("EXTERIOR DOOR");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Main Entry door: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.mainEntryDoor)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Door Condition: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.mainEntryDoorCondition)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Weather stripping: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.weatherStripping)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Storm door: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.stormDoor)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.stormDoorCondition)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Doorbell: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.doorbell)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Type: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.doorbellType)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !electricalImagesFileNames ||
//         electricalImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         electricalImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Side door: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.sideDoor)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Door Condition: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.sideDoorCondition)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Weather stripping: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.sideDoorWeatherStripping)
//         .fillColor("black");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Patio door: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.patioDoor)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Door Condition: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.patioDoorCondition)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Comments: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.patioDoorComments)
//         .fillColor("black");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Patio Screen door: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.patioScreenDoor)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.patioScreenDoorCondition)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Comments: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.patioScreenDoorComments)
//         .fillColor("black");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Comments: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.exteriorDoorsComments)
//         .fillColor("black");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("GUTTERS / DOWNSPOUTS / ROOF DRAINAGE");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Materials: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.guttersDownspoutsRoofDrainageMaterial)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.guttersDownspoutsRoofDrainageCondition)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Leaking: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.guttersDownspoutsRoofDrainageLeaking)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Attachment: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.guttersDownspoutsRoofDrainageAttachment)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Extension needed: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.guttersDownspoutsRoofDrainageExtensionNeeded)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Comments: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.guttersDownspoutsRoofDrainageComments)
//         .fillColor("black");
//       doc.moveDown(1);

//       if (
//         !guttersDownspoutsRoofDrainageImagesFileNames ||
//         guttersDownspoutsRoofDrainageImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         guttersDownspoutsRoofDrainageImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }

//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "Always ensure that the extension is positioned away from the foundation wall; doing this will help rainwater move away from the house."
//         );
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "It is recommended to landscape the house accordingly so that rainwater runs away from the house."
//         );
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "Discharge below grade met the previous standard when the house was built. However, it needs to be updated to satisfy current local municipality requirements. Check with the local authority to determine if the roof water must be drained above ground, 4-6 feet away from the building."
//         );
//       doc.moveDown(1);
//       doc.font("Helvetica-Bold").fontSize(14).text("WINDOWS and PATIO DOORS");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Approximate age: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.windowsAndPatioDoorsApproximateAge)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Material and Type: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.windowsAndPatioDoorsMaterialAndType)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.windowsAndPatioDoorsCondition)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Comments: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.windowsAndPatioDoorsComments)
//         .fillColor("black");
//       doc.moveDown(1);

//       if (
//         !windowsAndPatioDoorsImagesFileNames ||
//         windowsAndPatioDoorsImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         windowsAndPatioDoorsImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);

//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Window screens: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.windowScreensMaterial)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.windowScreensCondition)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Comments: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.windowScreensComments)
//         .fillColor("black");
//       doc.moveDown(1);

//       if (
//         !windowScreensImagesFileNames ||
//         windowScreensImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         windowScreensImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }

//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Basement windows: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.basementWindowsMaterial)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Comments: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.basementWindowsComments)
//         .fillColor("black");
//       doc.moveDown(1);

//       if (
//         !basementWindowsImagesFileNames ||
//         basementWindowsImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         basementWindowsImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }

//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Recommendation:", { indent: 45 });
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "All windows will need periodic caulking on both inside and outside of the window and door system.",
//           { indent: 45 }
//         );
//       doc.moveDown(1);
//       doc.font("Helvetica-Bold").fontSize(14).text("GAS METER");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("HOMEOWNER TIP:", { indent: 45 });
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "Please keep the area around the gas meter clear of materials and vegetation for accessibility.",
//           { indent: 45 }
//         );
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Protect meter from impact damage. ", { indent: 45 });
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Comments: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.gasMeterComments)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!gasMeterImagesFileNames || gasMeterImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         gasMeterImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }

//       doc.moveDown(1);
//       doc.font("Helvetica-Bold").fontSize(14).text("ELECTRICAL");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Exterior outlets and lights: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.electricalExteriorOutletsAndLights)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !electricalImagesFileNames ||
//         electricalImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         electricalImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);

//       doc.font("Helvetica-Bold").fontSize(14).text("EXTERIOR HOSE BIBS");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Acceptable", { indent: 45 });
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "Always recommend shutting off exterior hoses in garage and yard FROM THE INTERIOR and BLEEDING THE LINES to reduce freezing damage during winter months. ",
//           { indent: 45 }
//         );
//       doc.moveDown(1);

//       if (
//         !exteriorHoseBibsImagesFileNames ||
//         exteriorHoseBibsImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         exteriorHoseBibsImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }

//       doc.moveDown(1);
//       doc.font("Helvetica-Bold").fontSize(14).text("AIR CONDITIONING");
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("HOMEOWNER TIP:", { indent: 45 });
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "Please keep the area around the air condition unit clear of materials and vegetation for accessibility.",
//           { indent: 45 }
//         );
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Protect AC unit from impact damage.", { indent: 45 });
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Manufacturer: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.airConditioningManufacturer)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Approximate age: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.airConditioningApproximateAge)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Area served: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.airConditioningAreaServed)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Fuel type: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.airConditioningFuelType)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.airConditioningCondition)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condenser Fins: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.airConditioningCondenserFins)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Cabinet/Housing: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.airConditioningCabinetHousing)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Refrigerant line Insulation: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.airConditioningRefrigerantLineInsulation)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("A/C System operation: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(exterior.airConditioningSystemOperation)
//         .fillColor("black");
//       doc.moveDown(1);
//       doc.font("Helvetica-Bold").fontSize(14).text("Recommendation: ");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "We recommend setting up a service contract with an AC maintenance company to ensure the equipment is properly serviced annually.",
//           { indent: 45 }
//         );
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "The design life of the unit is 12-18 years. This can be verified by an HVAC specialist. At the very least the A/C unit should be serviced annually.",
//           { indent: 45 }
//         );

//       doc.moveDown(1);
//       if (
//         !airConditioningImagesFileNames ||
//         airConditioningImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         airConditioningImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//     };

//     // Start the document and add the initial header
//     doc.addPage();
//     addExteriorHeader(doc);

//     // Loop through the exterior details and add them
//     inspection.exteriorDetails.exterior.forEach((exterior) => {
//       addExteriorDetails(doc, exterior);
//     });

//     // Add garage/carport details
//     doc.addPage();
//     doc.font("Helvetica-Bold").fontSize(20).text("GARAGE/CARPORT");
//     doc
//       .moveTo(70, doc.y)
//       .lineTo(doc.page.width - 50, doc.y)
//       .stroke();
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Type: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.type)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Garage door: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.garageDoor)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Automatic opener: ", {
//         align: "left",
//         indent: 45,
//         continued: true,
//       })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.automaticOpener)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Safety Reverses: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.safetyReverses)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Roofing: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.roofing)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Floor / Foundation: ", {
//         align: "left",
//         indent: 45,
//         continued: true,
//       })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.floorFoundation)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Condition: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.floorFoundationCondition)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Ceiling: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.ceiling)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Condition: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.ceilingCondition)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Exterior Walls: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.exteriorWalls)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Interior walls: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.interiorWalls)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Service door: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.serviceDoor)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Door condition: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.serviceDoorCondition)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Self-close: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.serviceDoorSelfClose)
//       .fillColor("black");
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text(
//         "Service doors between garage and house must be self-closing as protection against fire and dangerous gases.",
//         { indent: 45 }
//       );
//     doc.moveDown(1);
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Electrical (Receptacles and Lights): ", {
//         align: "left",
//         indent: 45,
//         continued: true,
//       })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.electrical)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Fire separation wall: ", {
//         align: "left",
//         indent: 45,
//         continued: true,
//       })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.fireSeparationWall)
//       .fillColor("black");
//     doc.moveDown();
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Comments: ", { align: "left", indent: 45, continued: true })
//       .font("Helvetica")
//       .fillColor("blue")
//       .text(inspection.garageCarportDetails.comments)
//       .fillColor("black");
//     doc.moveDown(1);

//     if (
//       !garageCarpetImagesFileNames ||
//       garageCarpetImagesFileNames.length === 0
//     ) {
//       console.log("No images to add.");
//       // Add additional logic here, such as adding a placeholder image or text
//       doc.text("No images available", x, y);
//     } else {
//       garageCarpetImagesFileNames.forEach((image) => {
//         doc.image(path.join(imagesDir, image), x, y, {
//           width: imageWidth,
//           height: imageHeight,
//         });
//         x += imageWidth + spacing;
//       });
//     }
//     doc.moveDown(1);
//     //

//     const addKitchensHeader = (doc) => {
//       doc.font("Helvetica-Bold").fontSize(20).text("KITCHEN");
//       doc
//         .moveTo(70, doc.y)
//         .lineTo(doc.page.width - 50, doc.y)
//         .stroke();
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "Kitchen appliances are checked for power where possible. Appliances are NOT run through full cycles and functionality as part of a home inspection.",
//           { indent: 0 }
//         );
//       doc.moveDown(1);
//     };

//     const addKitchenDetails = (doc, kitchen, index) => {
//       const startY = doc.y;
//       const pageHeight = doc.page.height;
//       const marginBottom = 50;
//       // Estimate the height of the kitchen details block
//       const kitchenDetailsHeight = 14 * 20; // 20 lines of text with font size 14
//       // Check if adding the kitchen details will overflow the page

//       const countertopsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "CountertopsImage" + index
//       );
//       const fDrainageImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "fDrainageImage" + index
//       );
//       const cabinetsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "CabinetsImage" + index
//       );
//       const kitchenFloorImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "kitchenFloorImage" + index
//       );
//       const kitchenWallsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "kitchenWallsImage" + index
//       );
//       const kitchenElectricalOutImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "kitchenElectricalOutImage" + index
//       );
//       const kitchenCeilingImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "kitchenCeilingImage" + index
//       );
//       const kitchenRaneHoodImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "kitchenRaneHoodImage" + index
//       );
//       const roomRefrigeratorImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "roomRefrigeratorImage" + index
//       );
//       const microWaveImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "microWaveImage" + index
//       );
//       const kitchenReverseImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "kitchenReverse" + index
//       );

//       if (startY + kitchenDetailsHeight > pageHeight - marginBottom) {
//         doc.addPage();
//         addKitchensHeader(doc);
//       }
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(`KITCHEN ${index + 1}`, {
//           align: "left",
//           indent: 0,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.name)
//         .fillColor("black");
//       doc.moveDown(2);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Countertops: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.countertopsCondition)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Comments: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.countertopsComments)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !countertopsImagesFileNames ||
//         countertopsImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         countertopsImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Cabinets: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.cabinetsCondition)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Comments: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.cabinetsComments)
//         .fillColor("black");
//       doc.moveDown();
//       doc.moveDown(1);
//       if (!cabinetsImagesFileNames || cabinetsImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         cabinetsImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Plumbing: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.plumbingCondition)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Faucet: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.faucet)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Functional drainage: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.functionalDrainage)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!fDrainageImagesFileNames || fDrainageImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         fDrainageImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Floor: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.floorMaterial)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.floorCondition)
//         .fillColor("black");
//       doc.moveDown();
//       doc.moveDown(1);
//       if (
//         !kitchenFloorImagesFileNames ||
//         kitchenFloorImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         kitchenFloorImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Walls: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.wallsCondition)
//         .fillColor("black");
//       doc.moveDown();
//       doc.moveDown(1);
//       if (
//         !kitchenWallsImagesFileNames ||
//         kitchenWallsImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         kitchenWallsImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Ceilings: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.ceilingsCondition)
//         .fillColor("black");
//       doc.moveDown();
//       doc.moveDown(1);
//       if (
//         !kitchenCeilingImagesFileNames ||
//         kitchenCeilingImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         kitchenCeilingImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Electrical outlets and lights: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.electricalCondition)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !kitchenElectricalOutImagesFileNames ||
//         kitchenElectricalOutImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         kitchenElectricalOutImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Appliances", { indent: 45 });
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Range: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.rangeCondition)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Dishwasher: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.dishwasherCondition)
//         .fillColor("black");
//       doc.moveDown();
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Range Hood Fan: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.rangeHoodFanCondition)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !kitchenRaneHoodImagesFileNames ||
//         kitchenRaneHoodImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         kitchenRaneHoodImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Recommendation:", { indent: 45 });
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "Always keep the range hood filter clean to maintain efficiency, reduce energy costs and minimize the risk of grease fire.",
//           { indent: 45 }
//         );
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Refrigerator: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.refrigeratorCondition)
//         .fillColor("black");
//       doc.moveDown(1);

//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Microwave: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.microwaveCondition)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!microWaveImagesFileNames || microWaveImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         microWaveImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Open ground/Reverse polarity: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(kitchen.openGroundReversePolarity)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !kitchenReverseImagesFileNames ||
//         kitchenReverseImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         kitchenReverseImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//     };

//     doc.addPage();
//     addKitchensHeader(doc);

//     if (inspection.kitchenDetails && inspection.kitchenDetails.kitchens) {
//       inspection.kitchenDetails.kitchens.forEach((kitchen, index) => {
//         addKitchenDetails(doc, kitchen, index);
//       });
//     } else {
//       console.error("No kitchen details found in the inspection object.");
//     }

//     const addBathroomHeader = (doc) => {
//       doc.font("Helvetica-Bold").fontSize(20).text("BATHROOMS");
//       doc
//         .moveTo(70, doc.y)
//         .lineTo(doc.page.width - 50, doc.y)
//         .stroke();
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "All water fixtures are tested in the bathrooms for hot and cold supply, function, and leaks.",
//           { indent: 0 }
//         );
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("NOTE: ", { align: "left", indent: 0, continued: true })
//         .font("Helvetica")
//         .fillColor("black")
//         .text(
//           "Sometimes leakage only occurs during certain conditions, which may be different than the standard test methods used during the inspection. "
//         )
//         .fillColor("black");
//       doc.moveDown(1);
//     };

//     const addBathroomDetails = (doc, bathroom, index) => {
//       const startY = doc.y;
//       const pageHeight = doc.page.height;
//       const marginBottom = 50;
//       // Estimate the height of the bathroom details block
//       const bathroomDetailsHeight = 14 * 18; // 18 lines of text with font size 14
//       // Check if adding the bathroom details will overflow the page

//       const floorImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "floorImage" + index
//       );
//       const wallsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "wallsImage" + index
//       );
//       const ceilingImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "ceilingImage" + index
//       );
//       const bathroomDoorImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "bathroomDoorImage" + index
//       );
//       const bathroomWindowsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "bathroomWindowsImage" + index
//       );
//       const electricalImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "electricalImage" + index
//       );
//       const sinkBasinImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "sinkBasinImage" + index
//       );
//       const plumbingImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "plumbingImage" + index
//       );
//       const toiletsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "toiletsImage" + index
//       );
//       const bathtubImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "bathtubImage" + index
//       );
//       const standingShowerImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "standingShowerImage" + index
//       );
//       const faucetsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "faucetsImage" + index
//       );
//       const waterFlowImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "waterFlowImage" + index
//       );
//       const moistureStainsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "moistureStainsImage" + index
//       );
//       const heatSourceImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "heatSourceImage" + index
//       );
//       const ventilationImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "ventilationImage" + index
//       );
//       if (startY + bathroomDetailsHeight > pageHeight - marginBottom) {
//         doc.addPage();
//         addBathroomHeader(doc);
//       }
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(`BATHROOM ${index + 1}`, {
//           align: "left",
//           indent: 0,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text("(Manually fill)")
//         .fillColor("black");
//       doc.moveDown(2);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Floor: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.floorMaterial)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.floorCondition)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!floorImagesFileNames || floorImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         floorImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Walls: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.wallsMaterial)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.wallsCondition)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!wallsImagesFileNames || wallsImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         wallsImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Ceiling: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.ceilingMaterial)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.ceilingCondition)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!ceilingImagesFileNames || ceilingImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         ceilingImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Door: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.doorMaterial)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.doorCondition)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !bathroomDoorImagesFileNames ||
//         bathroomDoorImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         bathroomDoorImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Windows: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.windows)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !bathroomWindowsImagesFileNames ||
//         bathroomWindowsImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         bathroomWindowsImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Electrical: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.electrical)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !electricalImagesFileNames ||
//         electricalImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         electricalImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Counter/Cabinet: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.counterCabinet)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!sinkBasinImagesFileNames || sinkBasinImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         sinkBasinImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Sink/Basin: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.sinkBasin)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!sinkBasinImagesFileNames || sinkBasinImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         sinkBasinImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Plumbing: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.plumbing)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!plumbingImagesFileNames || plumbingImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         plumbingImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Toilet: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.toilet)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!toiletsImagesFileNames || toiletsImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         doc.text("No images available", x, y);
//       } else {
//         toiletsImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Bathtub: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.bathtub)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!bathtubImagesFileNames || bathtubImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         bathtubImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Standing shower: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.standingShower)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !standingShowerImagesFileNames ||
//         standingShowerImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         standingShowerImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Faucets: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.faucets)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!faucetsImagesFileNames || faucetsImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         faucetsImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Water flow: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.waterFlow)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Moisture stains present: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.moistureStains)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!waterFlowImagesFileNames || waterFlowImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         waterFlowImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Heat source: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.heatSource)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !heatSourceImagesFileNames ||
//         heatSourceImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         heatSourceImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Ventilation: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(bathroom.ventilation)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !ventilationImagesFileNames ||
//         ventilationImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         ventilationImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//     };

//     // Start the document and add the initial header
//     doc.addPage();
//     addBathroomHeader(doc);
//     // Loop through the bathrooms and add their details
//     inspection.bathroomsDetails.bathrooms.forEach((bathroom, index) => {
//       addBathroomDetails(doc, bathroom, index);
//     });

//     const addRoomsHeader = (doc) => {
//       doc.font("Helvetica-Bold").fontSize(20).text("ROOMS");
//       doc
//         .moveTo(70, doc.y)
//         .lineTo(doc.page.width - 50, doc.y)
//         .stroke();
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(
//           "Readily accessible and visible areas are inspected. Heavy furniture and stored belongings can limit access to certain areas.",
//           { indent: 0 }
//         );
//       doc.moveDown(1);
//     };

//     const addRoomDetails = (doc, room, index) => {
//       const startY = doc.y;
//       const pageHeight = doc.page.height;
//       const marginBottom = 50;
//       // Estimate the height of the room details block
//       const roomDetailsHeight = 14 * 12; // 12 lines of text with font size 14
//       // Check if adding the room details will overflow the page
//       const roomWallsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "roomWallsImage" + index
//       );
//       const roomCeilingImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "roomCeilingImage" + index
//       );
//       const roomsClosetImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "roomsClosetImage" + index
//       );
//       const roomsFloorsImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "roomsFloorsImage" + index
//       );
//       const roomsDoorImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "roomsDoorImage" + index
//       );
//       const roomsWindowImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "roomsWindowImage" + index
//       );
//       const roomsElectricalImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "roomsElectricalImage" + index
//       );
//       const heatSourceImagesFileNames = getValueByKey(
//         arrayImageFileNames,
//         "heatSourceImage" + index
//       );
//       if (startY + roomDetailsHeight > pageHeight - marginBottom) {
//         doc.addPage();
//         addRoomsHeader(doc);
//       }
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text(`ROOM ${index + 1}`, {
//           align: "left",
//           indent: 0,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.name)
//         .fillColor("black");
//       doc.moveDown(2);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Walls: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.wallsMaterial)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.wallsCondition)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!roomWallsImagesFileNames || roomWallsImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         roomWallsImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Ceiling: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.ceilingMaterial)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.ceilingCondition)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !roomCeilingImagesFileNames ||
//         roomCeilingImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         if (
//           !roomCeilingImagesFileNames ||
//           roomCeilingImagesFileNames.length === 0
//         ) {
//           console.log("No images to add.");
//           // Add additional logic here, such as adding a placeholder image or text
//           doc.text("No images available", x, y);
//         } else {
//           roomCeilingImagesFileNames.forEach((image) => {
//             doc.image(path.join(imagesDir, image), x, y, {
//               width: imageWidth,
//               height: imageHeight,
//             });
//             x += imageWidth + spacing;
//           });
//         }
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Closet: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.closetType)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.closetCondition)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !roomsClosetImagesFileNames ||
//         roomsClosetImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         roomsClosetImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Floors: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.floorsMaterial)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.floorsCondition)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !roomsFloorsImagesFileNames ||
//         roomsFloorsImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         roomsFloorsImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Door: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.doorMaterial)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Condition: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.doorCondition)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (!roomsDoorImagesFileNames || roomsDoorImagesFileNames.length === 0) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         roomsDoorImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Windows: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.windows)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !roomsWindowImagesFileNames ||
//         roomsWindowImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         roomsWindowImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Electrical: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.electrical)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !roomsElectricalImagesFileNames ||
//         roomsElectricalImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         roomsElectricalImagesFileNames.forEach((image) => {
//           doc.image(path.join(imagesDir, image), x, y, {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           x += imageWidth + spacing;
//         });
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Heat source: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.heatSource)
//         .fillColor("black");
//       doc.moveDown(1);
//       if (
//         !heatSourceImagesFileNames ||
//         heatSourceImagesFileNames.length === 0
//       ) {
//         console.log("No images to add.");
//         // Add additional logic here, such as adding a placeholder image or text
//         doc.text("No images available", x, y);
//       } else {
//         if (
//           !heatSourceImagesFileNames ||
//           heatSourceImagesFileNames.length === 0
//         ) {
//           console.log("No images to add.");
//           // Add additional logic here, such as adding a placeholder image or text
//           doc.text("No images available", x, y);
//         } else {
//           heatSourceImagesFileNames.forEach((image) => {
//             doc.image(path.join(imagesDir, image), x, y, {
//               width: imageWidth,
//               height: imageHeight,
//             });
//             x += imageWidth + spacing;
//           });
//         }
//       }
//       doc.moveDown(1);
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Moisture stains: ", {
//           align: "left",
//           indent: 45,
//           continued: true,
//         })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.moistureStains)
//         .fillColor("black");
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("Comments: ", { align: "left", indent: 45, continued: true })
//         .font("Helvetica")
//         .fillColor("blue")
//         .text(room.comments)
//         .fillColor("black");
//     };

//     // Start the document and add the initial header
//     doc.addPage();
//     addRoomsHeader(doc);

//     // Loop through the rooms and add their details
//     inspection.roomsDetails.rooms.forEach((room, index) => {
//       addRoomDetails(doc, room, index);
//     });

//     // End the document
//     doc.end();

//     // Delete files in the directory after the PDF is generated
//     doc.on("end", () => {
//       deleteFilesInDirectory(imagesDir);
//     });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// exports.generatePDFs = async (req, res) => {
//   try {
//     const inspection = await Inspection.findOne().sort({ _id: -1 });
//     if (!inspection) {
//       return res.status(404).send({ message: 'Inspection not found' });
//     }

//     res.setHeader('Content-disposition', 'attachment; filename=report.pdf');
//     res.setHeader('Content-type', 'application/pdf');

//     const doc = new PDFDocument();
//     doc.pipe(res);

//     // Helper function to add a section title
//     const addSectionTitle = (title) => {
//       doc.addPage();
//       doc.font('Helvetica-Bold').fontSize(20).text(title);
//       doc.moveTo(70, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
//       doc.moveDown(1);
//     };

//     // Helper function to add an image with optional placeholder text
//     const addImages = (images, imagesDir, doc, imageWidth, imageHeight) => {
//       if (!images || images.length === 0) {
//         doc.text('No images available');
//       } else {
//         images.forEach((image) => {
//           doc.image(path.join(imagesDir, image), {
//             width: imageWidth,
//             height: imageHeight,
//           });
//           doc.moveDown(0.5);
//         });
//       }
//     };

//     // Helper function to add text with a title and content
//     const addText = (title, content) => {
//       doc.font('Helvetica-Bold').fontSize(14).text(`${title}: `, { continued: true })
//          .font('Helvetica').fillColor('blue').text(content).fillColor('black');
//       doc.moveDown(1);
//     };

//     // Example sections
//     const imagesDir = './public/Images/upload_images';

//     // Add Header with logo and title
//     doc.image('./public/Images/logo.png', { fit: [125, 125], align: 'center' });
//     doc.moveDown(1);
//     doc.font('Times-BoldItalic').fontSize(36).text('EYE-TECH Home Inspections Inc.', { align: 'center' });
//     doc.moveDown(1);

//     // Add Client Information
//     addSectionTitle('GENERAL INFORMATION');
//     addText('Property Address', inspection.clientInformation.clientAddress);
//     addText('Contact Name', inspection.clientInformation.contactName);
//     addText('Phone Number', inspection.clientInformation.phoneNumber);
//     addText('Email', inspection.clientInformation.email);

//     // Add Lots and Grounds details with images
//     addSectionTitle('LOTS AND GROUNDS');
//     addText('Driveway Material', inspection.lotsGroundsDetails.driveway.material);
//     addText('Driveway Condition', inspection.lotsGroundsDetails.driveway.condition);
//     addImages(inspection.lotsGroundsDetails.driveway.images, imagesDir, doc, 150, 100);

//     // Add Roof Details
//     addSectionTitle('ROOF');
//     addText('Roof Style', inspection.roofDetails.roofDescription.style);
//     addText('Roof Pitch', inspection.roofDetails.roofDescription.pitch);
//     addImages(inspection.roofDetails.roofDescription.images, imagesDir, doc, 150, 100);

//     // Add more sections as needed following the same pattern...

//     // Finalize the PDF
//     doc.end();

//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     res.status(500).send({ error: 'Failed to generate PDF' });
//   }
// };
