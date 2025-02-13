const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");
const drawFooter = require("./footer");

const generateGarageCarportInfo = async (
  doc,
  garageCarportInfo,
  pageNumber,
  inspectionId
) => {
  const defaultX = 50;
  const indent = 20;

  //////////////////footer handling////////////////
  let currentPage = pageNumber;

  const handlePageBreak = () => {
    drawFooter(doc, currentPage);
    currentPage++;
    doc.addPage();
  };

  const originalAddPage = doc.addPage.bind(doc);
  doc.addPage = () => {
    originalAddPage();
  };

  const checkSpace = (neededSpace = 50) => {
    if (doc.y + neededSpace > doc.page.height - doc.page.margins.bottom) {
      handlePageBreak();
    }
  };
  //////////////////footer handling////////////////

  // Helper function to format fields to handle "Other" values
  const formatField = (field, otherField) => {
    const filteredValues = (field || []).filter(
      (value) => value && value !== "N/A" && value !== "Other"
    );
    if (otherField && otherField !== "N/A") {
      filteredValues.push(otherField);
    }
    return filteredValues.join(", ");
  };

  const renderField = (label, value, options = {}) => {
    if (value) {
      checkSpace(50); 
      doc
        .font("Helvetica-Bold")
        .text(`${label}: `, { continued: true, ...options })
        .font("Helvetica")
        .text(value, options);
    }
  };

  // Insert Images
  const insertImage = async (imageName) => {
    const imageUrl = await fetchImageFromDB(inspectionId, imageName);
    if (imageUrl) {
      const imageBuffer = await fetchImage(imageUrl);
      if (imageBuffer) {
        const imageWidth = 200;
        const imageHeight = 150;
        const padding = 10;
        const centerX = (doc.page.width - imageWidth) / 2;

        checkSpace(imageHeight + padding);

        doc.image(imageBuffer, centerX, doc.y, {
          width: imageWidth,
          height: imageHeight,
        });
        doc.y += imageHeight + padding;
      }
    }
  };

  // GARAGE / CARPORT Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("GARAGE / CARPORT");
  doc.lineWidth(0.5);
  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);
  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  doc.font("Helvetica").fontSize(12);

  // Garage / Carport General Info
  renderField(
    "Type",
    formatField(
      garageCarportInfo.garageCarportType,
      garageCarportInfo.otherGarageCarportType
    ),
    { indent }
  );

  renderField(
    "Garage Door",
    formatField(
      garageCarportInfo.garageCarportGarageDoor,
      garageCarportInfo.otherGarageCarportGarageDoor
    ),
    { indent }
  );

  renderField(
    "Door Condition",
    formatField(
      garageCarportInfo.garageCarportDoorCondition,
      garageCarportInfo.otherGarageCarportDoorCondition
    ),
    { indent }
  );

  renderField("Comments", garageCarportInfo.garageCarportComments, { indent });

  // AUTOMATIC OPENER Section
  renderField(
    "Automatic Opener",
    formatField(
      garageCarportInfo.garageCarportAutomaticOpener,
      garageCarportInfo.otherGarageCarportAutomaticOpener
    ),
    { indent }
  );

  renderField(
    "Safety Reverses",
    formatField(
      garageCarportInfo.garageCarportSafetyReverses,
      garageCarportInfo.otherGarageCarportSafetyReverses
    ),
    { indent }
  );

  // GARAGE STRUCTURE
  renderField(
    "Roofing",
    formatField(garageCarportInfo.garageCarportRoofing, null),
    { indent }
  );

  renderField(
    "Roofing Condition",
    formatField(
      garageCarportInfo.garageCarportRoofingCondition,
      garageCarportInfo.otherGarageCarportRoofingCondition
    ),
    { indent }
  );

  doc.moveDown(0.5);

  renderField(
    "Floor/Foundation",
    formatField(
      garageCarportInfo.garageCarportFloorFoundation,
      garageCarportInfo.otherGarageCarportFloorFoundation
    ),
    { indent }
  );

  renderField(
    "Floor/Foundation Condition",
    formatField(
      garageCarportInfo.garageCarportFloorFoundationCondition,
      garageCarportInfo.otherGarageCarportFloorFoundationCondition
    ),
    { indent }
  );
  doc.moveDown(0.5);

  renderField(
    "Ceiling",
    formatField(
      garageCarportInfo.garageCarportCeiling,
      garageCarportInfo.otherGarageCarportCeiling
    ),
    { indent }
  );

  renderField(
    "Ceiling Condition",
    formatField(
      garageCarportInfo.garageCarportCeilingCondition,
      garageCarportInfo.otherGarageCarportCeilingCondition
    ),
    { indent }
  );
  doc.moveDown(0.5);

  renderField(
    "Exterior Walls",
    formatField(
      garageCarportInfo.garageCarportExteriorWalls,
      garageCarportInfo.otherGarageCarportExteriorWalls
    ),
    { indent }
  );

  renderField(
    "Interior Walls",
    formatField(
      garageCarportInfo.garageCarportInteriorWalls,
      garageCarportInfo.otherGarageCarportInteriorWalls
    ),
    { indent }
  );

  doc.moveDown(0.5);

  checkSpace(50);
  // SERVICE DOOR Section
  garageCarportInfo.serviceDoor.forEach((serviceDoor) => {
    // Format and render fields
    const serviceDoorType = serviceDoor.garageCarportServiceDoor.join(", ");
    renderField("Service Door", serviceDoorType, { indent });

    const serviceDoorCondition = formatField(
      serviceDoor.garageCarportServiceDoorCondition,
      serviceDoor.otherGarageCarportServiceDoorCondition
    );
    renderField("Door Condition", serviceDoorCondition, { indent });

    const serviceDoorSelfClose = formatField(
      serviceDoor.garageCarportServiceDoorSelfClose,
      serviceDoor.otherGarageCarportServiceDoorSelfClose
    );
    renderField("Self Close", serviceDoorSelfClose, { indent });

    doc.moveDown(0.5);
  });

  checkSpace(50);
  // Hardcoded Homeowner Tip
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "Service doors between garage and house must be self-closing as protection against fire and dangerous gases.",
      { indent }
    );

  doc.moveDown(0.5);

  renderField(
    "Electrical (Receptacles and Lights):",
    formatField(
      garageCarportInfo.garageCarportElectricalReceptaclesLights,
      garageCarportInfo.otherGarageCarportElectricalReceptaclesLights
    ),
    { indent }
  );

  renderField(
    "Fire Separation Wall",
    formatField(
      garageCarportInfo.garageCarportFireSeparationwall,
      garageCarportInfo.otherGarageCarportFireSeparationwall
    ),
    { indent }
  );

  renderField(
    "Comments",
    garageCarportInfo.garageCarportElectricalReceptaclesLightsComments,
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  await insertImage("garageCarpotImage");

  drawFooter(doc, currentPage);
  currentPage++;
  doc.addPage();

  return currentPage;
};

module.exports = generateGarageCarportInfo;
