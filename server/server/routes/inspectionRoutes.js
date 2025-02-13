const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const inspectionController = require("../controllers/inspectionController");
const {
  createAuthenticationControllerFn,
  loginInspectorControllerFn,
} = require("../controllers/inspectorController");
const generalController = require("../controllers/general-information/general-information");
const buildingDataController = require("../controllers/building-data/building-data");
const basementController = require("../controllers/basement/basementController");
const commonAreaController = require("../controllers/common-area/commonAreaController");
const kitchenController = require("../controllers/kitchen/kitchenController");
const laundryController = require("../controllers/laundry/laundryController");
const roomsController = require("../controllers/room/roomController");
const lotsAndGroundController = require("../controllers/lotsAndGround/lotsAndGroundsController");
const roofController = require("../controllers/roof/roofController");
const exteriorController = require("../controllers/exterior/exteriorController");
const garageCarportController = require("../controllers/garage-carport/garageCarportController");
const bathroomController = require("../controllers/bathroom/bathroomController");
const plumbingController = require("../controllers/plumbing/plumbingController");

const heatingSystemController = require("../controllers/heating-system/heatingSystemController");
const electricalController = require("../controllers/electrical-system/electricalSystemController");

const interiorController = require("../controllers/interior/interiorController");

const fullInspectionController = require("../controllers/main/mainController");

router.post("/add", inspectionController.addInspection);
router.get("/fetchInspectors", inspectionController.getAllInspections);
router.post("/upload", upload.single("file"), inspectionController.uploadFile);
router.get("/generatePDF/:inspectionId", fullInspectionController.generatePDFs);
router.get("/getPost", inspectionController.getAllPosts);
router.post("/posts", upload.single("image"), inspectionController.createPost);
router.post("/api/deletePost/:id", inspectionController.deletePost);
router.post("/api/deleteAllFiles", inspectionController.deleteAllFiles);
router.get("/test", inspectionController.testAPI);
router.post("/createInspector", createAuthenticationControllerFn);
router.post("/login", loginInspectorControllerFn);

router.post("/createGeneralInfoUri", generalController.addGeneralToInspection);
router.get(
  "/getGeneralInfoUri/:inspectionId",
  generalController.getGeneralAndInspection
);

router.post(
  "/createBuildingDataUri",
  buildingDataController.addBuildingDataToInspection
);
router.get(
  "/getBuildingDataUri/:inspectionId",
  buildingDataController.getBuildingDataAndInspection
);

router.post(
  "/createLotsAndGroundsUri",
  lotsAndGroundController.addGroundsDataToInspection
);
router.get(
  "/getLotsAndGroundsUri/:inspectionId",
  lotsAndGroundController.getGroundsDataAndInspection
);

router.post("/createRoofUri", roofController.addRoofDataToInspection);
router.get(
  "/getRoofUri/:inspectionId",
  roofController.getRoofDataAndInspection
);

router.post(
  "/createExteriorUri",
  exteriorController.addExteriorDetailsToInspection
);
router.get(
  "/getExteriorUri/:inspectionId",
  exteriorController.getExteriorDetailsAndInspection
);

router.post(
  "/createGarageCarpotUri",
  garageCarportController.addGarageCarportDataToInspection
);
router.get(
  "/getGarageCarpotUri/:inspectionId",
  garageCarportController.getGarageCarportDataAndInspection
);

router.post("/createKitchenUri", kitchenController.addKitchenDataToInspection);
router.get(
  "/getKitchenUri/:inspectionId",
  kitchenController.getKitchenDataAndInspection
);

router.post(
  "/createBathroomUri",
  bathroomController.addBathroomDataToInspection
);
router.get(
  "/getBathroomUri/:inspectionId",
  bathroomController.getBathroomDataAndInspection
);

router.post("/createRoomUri", roomsController.addRoomDataToInspection);
router.get(
  "/getRoomUri/:inspectionId",
  roomsController.getRoomDataAndInspection
);

router.post(
  "/createCommonAreaUri",
  commonAreaController.addCommonAreasDataToInspection
);
router.get(
  "/getCommonAreaUri/:inspectionId",
  commonAreaController.getCommonAreasDataAndInspection
);

router.post("/createLaundryUri", laundryController.addLaundryDataToInspection);
router.get(
  "/getLaundryUri/:inspectionId",
  laundryController.getLaundryDataAndInspection
);

router.post(
  "/createPlumbingUri",
  plumbingController.addPlumbingDataToInspection
);
router.get(
  "/getPlumbingUri/:inspectionId",
  plumbingController.getPlumbingDataAndInspection
);

router.post(
  "/createHeatingSystemUri",
  heatingSystemController.addHeatingSystemDataToInspection
);
router.get(
  "/getHeatingSystemUri/:inspectionId",
  heatingSystemController.getHeatingSystemDataAndInspection
);

router.post(
  "/createElectricalSystemUri",
  electricalController.addElectricalSystemDataToInspection
);
router.get(
  "/getElectricalSystemUri/:inspectionId",
  electricalController.getElectricalSystemDataAndInspection
);

router.post(
  "/createBasementUri",
  basementController.addBasementDataToInspection
);
router.get(
  "/getBasementUri/:inspectionId",
  basementController.getBasementDataAndInspection
);

router.post(
  "/createInteriorUri",
  interiorController.addInteriorDataToInspection
);
router.get(
  "/getInteriorUri/:inspectionId",
  interiorController.getInteriorDataAndInspection
);

router.post("/createInspectionUri", fullInspectionController.createInspection);
router.get(
  "/getInspectionTableUri",
  fullInspectionController.getInspectionList
);
router.delete(
  "/deleteInspectionUri/:inspectionId",
  fullInspectionController.deleteInspection
);
router.get(
  "/getInspectionSchemaUri/:inspectionId",
  fullInspectionController.getInspectionSchema
);

module.exports = router;
