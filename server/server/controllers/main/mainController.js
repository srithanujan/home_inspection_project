const Inspection = require("../../models/main/mainModel");
const generateGeneralInfo = require("../../report/general_report");
const generateGroundsInfo = require("../../report/lotsAndGrounds_report");
const generateElectricalSystemInfo = require("../../report/electricalSystem_report");
const generateRoomInfo = require("../../report/room_report");
const generateRoofInfo = require("../../report/roof_report");
const generateBuildingInfo = require("../../report/building_report");
const generateGarageCarportInfo = require("../../report/garagecarport_report");
const generateBathroomInfo = require("../../report/bathroom_report");
const generateCommonAreasInfo = require("../../report/commonAreas_report");
const generateInteriorInfo = require("../../report/interior_report");
const generateHeatingSystemInfo = require("../../report/heatingSystem_report");
const generateLaundryInfo = require("../../report/laundry_report");
const generatePlumbingInfo = require("../../report/plumbing_report");
const generateKitchenInfo = require("../../report/kitchen_report");
const generateExteriorInfo = require("../../report/exterior_report");
const generateCoverPage = require("../../report/coverReport");
const generateBasementInfo = require("../../report/basement_report");
const generateStaticLetter = require("../../report/staticLetter_report");
const generatestaticHomeSetup = require("../../report/staticHomeSetup_report");
const generateStaticLastPageInfo = require("../../report/staticLastPage_report");

const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

exports.createInspection = async (req, res) => {
  try {
    const { inspections } = req.body;
    let inspectionData = await Inspection.findOne({ inspections });
    if (inspectionData)
      return res
        .status(409)
        .json({ code: 409, error: { message: "Already Exists" } });
    const newInspectionDocument = new Inspection({ inspections });
    const newInspection = await newInspectionDocument.save();
    res.status(201).json({ code: 200, data: { id: newInspection._id } });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getInspectionList = async (req, res) => {
  try {
    const inspections = await Inspection.find().select("_id inspections");

    res.status(200).json({
      code: 200,
      data: inspections,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "An error occurred while fetching inspections",
      error: error.message,
    });
  }
};

exports.deleteInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;

    const deletedInspection = await Inspection.findByIdAndDelete(inspectionId);

    if (!deletedInspection) {
      return res.status(404).json({
        code: 404,
        message: 404,
      });
    }

    res.status(200).json({
      code: 200,
      message: 200,
      data: deletedInspection,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "An error occurred while deleting the inspection",
      error: error.message,
    });
  }
};

exports.getInspectionSchema = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspections = await Inspection.findById(inspectionId);

    if (!inspections) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      code: 200,
      data: inspections,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "An error occurred while fetching full inspection details",
      error: error.message,
    });
  }
};

exports.generatePDFs = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspections = await Inspection.findById(inspectionId)
      .populate("generalInfo")
      .populate("buildingInfo")
      .populate("groundsInfo")
      .populate("roofInfo")
      .populate("exteriorInfo")
      .populate("garageCarportInfo")
      .populate("kitchenInfo")
      .populate("bathroomInfo")
      .populate("roomInfo")
      .populate("commonAreasInfo")
      .populate("laundryInfo")
      .populate("plumbingInfo")
      .populate("interiorInfo")
      .populate("heatingSystemInfo")
      .populate("electricalSystemInfo")
      .populate("basementInfo");

    if (!inspections) {
      return res.status(404).json({ message: "Inspection not found" });
    }

    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      let pdfData = Buffer.concat(buffers);
      res
        .status(200)
        .set({
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="Inspection_Report.pdf"',
        })
        .send(pdfData);
    });

    // Cover Page
    const logoPath = path.resolve(__dirname, "../../public/Images/logo.png");
    generateCoverPage(doc, logoPath);

    // Initialize Page Number
    let pageNumber = 2;

    // General Information Section
    pageNumber = generateGeneralInfo(doc, inspections.generalInfo, pageNumber);

    // Building Information Section
    pageNumber = await generateBuildingInfo(
      doc,
      inspections.buildingInfo,
      pageNumber
    );

    // Lots and Grounds Information Section
    pageNumber = await generateGroundsInfo(
      doc,
      inspections.groundsInfo,
      pageNumber
    );

    // Roof Information Section
    pageNumber = await generateRoofInfo(doc, inspections.roofInfo, pageNumber);

    // Exterior Information Section
    pageNumber = await generateExteriorInfo(
      doc,
      inspections.exteriorInfo,
      pageNumber
    );

    // Garage/Carport Information Section
    pageNumber = await generateGarageCarportInfo(
      doc,
      inspections.garageCarportInfo,
      pageNumber
    );

    // Kitchen Information Section
    pageNumber = await generateKitchenInfo(
      doc,
      inspections.kitchenInfo,
      pageNumber
    );

    // Bathroom Information Section
    pageNumber = await generateBathroomInfo(
      doc,
      inspections.bathroomInfo,
      pageNumber
    );

    // Room Information Section
    pageNumber = await generateRoomInfo(doc, inspections.roomInfo, pageNumber);

    // Common Areas Information Section
    pageNumber = await generateCommonAreasInfo(
      doc,
      inspections.commonAreasInfo,
      pageNumber
    );

    // Laundry Information Section
    pageNumber = await generateLaundryInfo(
      doc,
      inspections.laundryInfo,
      pageNumber
    );

    // Interior Information Section
    pageNumber = await generateInteriorInfo(
      doc,
      inspections.interiorInfo,
      pageNumber
    );

    // Plumbing System Information Section
    pageNumber = await generatePlumbingInfo(
      doc,
      inspections.plumbingInfo,
      pageNumber
    );

    // Heating System Information Section
    pageNumber = await generateHeatingSystemInfo(
      doc,
      inspections.heatingSystemInfo,
      pageNumber
    );

    // Electrical System Information Section
    pageNumber = await generateElectricalSystemInfo(
      doc,
      inspections.electricalSystemInfo,
      pageNumber
    );

    // Basement Information Section
    pageNumber = generateBasementInfo(
      doc,
      inspections.basementInfo,
      pageNumber
    );

    //Static Section
    pageNumber = generateStaticLetter(doc, inspections.generalInfo, pageNumber);
    pageNumber = generatestaticHomeSetup(doc, pageNumber);
    pageNumber = generateStaticLastPageInfo(doc, pageNumber);

    doc.end();
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "An error occurred while generating the PDF",
      error: error.message,
    });
  }
};
