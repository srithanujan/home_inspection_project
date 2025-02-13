const drawFooter = require("./footer");
const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");

const generateBathroomInfo = async (
  doc,
  bathroomInfo,
  pageNumber,
  inspectionId
) => {
  const indentOptions = { indent: 20 };

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

  // Helper function to render fields with labels and values
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

  //insert image
  const insertImage = async (baseNames, index) => {
    for (const baseName of baseNames) {
      const imageName = `${baseName}${index}`;
      const imageUrl = await fetchImageFromDB(inspectionId, imageName);
      if (!imageUrl) {
        continue;
      }
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

  // Bathroom Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("BATHROOM");
  doc.lineWidth(0.5);
  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  // Introductory Paragraph
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "All water fixtures are tested in the bathrooms for hot and cold supply, function, and leaks."
    )
    .font("Helvetica-BoldOblique")
    .text(
      "NOTE: Sometimes leakage only occurs during certain conditions, which may differ from the standard test methods used during the inspection."
    );
  doc.moveDown(1);

  let bathroomIndex = 0; // Track index for unique images

  for (const bathroom of bathroomInfo.bathrooms) {
    // Bathroom Title
    doc.font("Helvetica-Bold").fontSize(12).text("BATHROOM");
    doc.moveDown(0.5);

    // Bathroom Name (without index)
    renderField("Name", bathroom.name, { indent: 20 });
    doc.moveDown(1);

    // Floor Section
    renderField(
      "Floor",
      formatField(
        bathroom.bathroomFloors.bathroomFloorsMaterial,
        bathroom.bathroomFloors.otherBathroomFloorsMaterial
      ),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        bathroom.bathroomFloors.bathroomFloorsCondition,
        bathroom.bathroomFloors.otherBathroomCondition
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["bathroomFloorImage"], bathroomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Walls Section
     checkSpace(50);
    renderField(
      "Walls",
      formatField(
        bathroom.bathroomWalls.bathroomsWallsMaterial,
        bathroom.bathroomWalls.otherBathromsWallsMaterial
      ),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        bathroom.bathroomWalls.bathroomWallsCondition,
        bathroom.bathroomWalls.otherBathroomWallsCondition
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["bathroomWallImange"], bathroomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Ceiling Section
    checkSpace(50);
    renderField(
      "Ceiling",
      formatField(
        bathroom.bathroomCeilings.bathroomCeilingsMaterial,
        bathroom.bathroomCeilings.otherBathroomCeilingsMaterial
      ),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        bathroom.bathroomCeilings.bathroomCeilingsCondition,
        bathroom.bathroomCeilings.otherBathroomCeilingsCondition
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["bathroomCeilingImage"], bathroomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Doors Section
    checkSpace(50);
    renderField(
      "Doors",
      formatField(
        bathroom.bathroomDoors.bathroomDoorsMaterial,
        bathroom.bathroomDoors.otherBathroomDoorsMaterial
      ),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        bathroom.bathroomDoors.bathroomDoorsCondition,
        bathroom.bathroomDoors.otherBathroomDoorsCondition
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["bathroomDoorImage"], bathroomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Windows Section
    checkSpace(50);
    renderField(
      "Windows",
      formatField(
        bathroom.bathroomWindows.bathroomWindowsMaterial,
        bathroom.bathroomWindows.otherBathroomWindowsMaterial
      ),
      indentOptions
    );

     doc.moveDown(1);
     checkSpace(50);
     if (await insertImage(["bathroomWindowsImage"], bathroomIndex)) {
       doc.moveDown(1);
       doc.moveDown(1);
     }

    // Electrical Section
    checkSpace(50);
    renderField(
      "Electrical",
      formatField(
        bathroom.bathroomElectricals.bathroomElectricalsMaterial,
        bathroom.bathroomElectricals.otherBathroomElectricalsMaterial
      ),
      indentOptions
    );

     doc.moveDown(1);
     checkSpace(50);
     if (await insertImage(["bathroomElectricalImage"], bathroomIndex)) {
       doc.moveDown(1);
       doc.moveDown(1);
     }

    // Counter Cabinets Section
    checkSpace(50);
    renderField(
      "Counter/Cabinets",
      formatField(
        bathroom.bathroomCounterCabinets.bathroomCounterCabinetsMaterial,
        bathroom.bathroomCounterCabinets.otherBathroomCounterCabinetsMaterial
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["bathroomCounterCabinetImage"], bathroomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Sink Basins Section
    checkSpace(50);
    renderField(
      "Sink Basins",
      formatField(
        bathroom.bathroomSinkBasins.bathroomSinkBasinsMaterial,
        bathroom.bathroomSinkBasins.otherBathroomSinkBasinsMaterial
      ),
      indentOptions
    );

    // Plumbing Section
    checkSpace(50);
    renderField(
      "Plumbing",
      formatField(
        bathroom.bathroomPlumbings.bathroomPlumbingsMaterial,
        bathroom.bathroomPlumbings.otherBathroomPlumbingsMaterial
      ),
      indentOptions
    );
    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["bathroomPlumbingImage"], bathroomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Toilets Section
    checkSpace(50);
    renderField(
      "Toilet",
      formatField(
        bathroom.bathroomToilets.bathroomToiletsMaterial,
        bathroom.bathroomToilets.otherbathroomToiletsMaterial
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["bathroomToiletImage"], bathroomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Bathtubs Section
    checkSpace(50);
    renderField(
      "Bathtub",
      formatField(
        bathroom.bathroomBathtubs.bathroomBathtubsMaterial,
        bathroom.bathroomBathtubs.otherBathroomBathtubsMaterial
      ),
      indentOptions
    );

    // Standing Showers Section
    checkSpace(50);
    renderField(
      "Standing Shower",
      formatField(
        bathroom.bathroomStandingShowers.bathroomStandingShowersMaterial,
        bathroom.bathroomStandingShowers.otherBathroomStandingShowersMaterial
      ),
      indentOptions
    );
    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["bathroomStandingShowerImage"], bathroomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Faucets Section
    checkSpace(50);
    renderField(
      "Faucets",
      formatField(
        bathroom.bathroomFaucets.bathroomFaucetsMaterial,
        bathroom.bathroomFaucets.otherBathroomFaucetsMaterial
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["bathroomFaucetsImage"], bathroomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Water Flows Section
    checkSpace(50);
    renderField(
      "Water Flow",
      formatField(
        bathroom.bathroomWaterFlows.bathroomWaterFlowsMaterial,
        bathroom.bathroomWaterFlows.otherBathroomWaterFlowsMaterial
      ),
      indentOptions
    );

    doc.moveDown(1);

    // Moisture Stains Section
    checkSpace(50);
    renderField(
      "Moisture Stains present",
      formatField(
        bathroom.bathroomMoistureStains.bathroomMoistureStainsMaterial,
        bathroom.bathroomMoistureStains.otherBathroomMoistureStainsMaterial
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (
      await insertImage(["bathroomMoistureStainsPresentImage"], bathroomIndex)
    ) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Heat Sources Section
    checkSpace(50);
    renderField(
      "Heat Source",
      formatField(
        bathroom.bathroomHeatSources.bathroomHeatSourcesMaterial,
        bathroom.bathroomHeatSources.otherBathroomHeatSourcesMaterial
      ),
      indentOptions
    );

    doc.moveDown(1);

    // Ventilations Section
    checkSpace(50);
    renderField(
      "Ventilation",
      formatField(
        bathroom.bathroomVentilations.bathroomVentilationsMaterial,
        bathroom.bathroomVentilations.otherbathroomVentilationsMaterial
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["bathroomVentilationImage"], bathroomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Comments Section
    if (bathroom.bathroomComments) {
      renderField("Comments", bathroom.bathroomComments, indentOptions);
    }

    bathroomIndex++;
  }

    drawFooter(doc, currentPage);
    currentPage++;
    doc.addPage();

    return currentPage;
};

module.exports = generateBathroomInfo;