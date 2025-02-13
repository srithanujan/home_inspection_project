const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");
const drawFooter = require("./footer");

const generateInteriorInfo = async (
  doc,
  interiorInfo,
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
      checkSpace(40);
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

  //insert image
  const insertImage2 = async (baseNames, index) => {
    for (const baseName of baseNames) {
      const imageName = `${baseName}${index}`;
      const imageUrl = await fetchImageFromDB(inspectionId, imageName);
      if (!imageUrl) {
        //console.log(`No image found for: ${imageName}`);
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

  // INTERIOR Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("INTERIOR");
  doc.lineWidth(0.5);
  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);
  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  // STAIRS Section
  checkSpace(50);
  let stairIndex = 0; // Track index for unique images
  for (const stair of interiorInfo.stair) {
    doc.font("Helvetica-Bold").fontSize(12).text("STAIRS", defaultX);
    doc.moveDown(0.5);
    renderField(
      "Material",
      formatField(
        stair.interiorStairsMaterial,
        stair.otherInteriorStairsMaterial
      ),
      { indent }
    );
    renderField(
      "Condition",
      formatField(
        stair.interiorStairsCondition,
        stair.otherInteriorStairsCondition
      ),
      { indent }
    );
    renderField("Comments", stair.interiorStairsComments?.join(", "), {
      indent,
    });

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage2(["interiorStairsImage"], stairIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }
    stairIndex++;
  }

  // HANDRAILS Section
  checkSpace(50);
  let handrailIndex = 0; // Track index for unique images
  for (const handrail of interiorInfo.handrail) {
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("HANDRAILS AND RAILINGS", defaultX);
    doc.moveDown(0.5);
    renderField(
      "Material",
      formatField(
        handrail.interiorHandrailsMaterial,
        handrail.otherInteriorHandrailsMaterial
      ),
      { indent }
    );
    renderField(
      "Condition",
      formatField(
        handrail.interiorHandrailsCondition,
        handrail.otherInteriorHandrailsCondition
      ),
      { indent }
    );
    renderField("Comments", handrail.interiorHandrailsComments?.join(", "), {
      indent,
    });

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage2(["interiorHandrailsImage"], handrailIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }
    handrailIndex++;
  }

  // SMOKE DETECTOR Section
  checkSpace(50);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("SMOKE / CO - DETECTORS", defaultX);
  doc.moveDown(0.5);
  renderField(
    "Comments",
    interiorInfo.smokeDetector.interiorSmokeDetectorComments?.join(", "),
    { indent }
  );
  doc.moveDown(1);
  await insertImage2("interiorSmokeImage");
  doc.moveDown(1);

  checkSpace(150);
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "Recommended to have working carbon monoxide and smoke detectors installed in each bedroom, in the hallway outside the bedrooms and on every level of the house. Always follow manufacturer’s recommendations for testing and battery replacement. SMOKE and CARBON MONOXIDE detectors must be replaced every 10 years or by manufacturer’s recommendation."
    );

  doc.moveDown(1);

  // SKYLIGHT Section
  checkSpace(50);
  doc.font("Helvetica-Bold").fontSize(12).text("SKY LIGHT", defaultX);
  doc.moveDown(0.5);
  renderField(
    "Type",
    formatField(
      interiorInfo.skylight.interiorSkylightType,
      interiorInfo.skylight.otherInteriorSkylightType
    ),
    { indent }
  );
  renderField(
    "Comments",
    interiorInfo.skylight.interiorSkylightComments?.join(", "),
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage2("interiorSkylightImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  // FIREPLACES Section
  checkSpace(50);
  let fireplaceIndex = 0; // Track index for unique images
  for (const fireplace of interiorInfo.fireplace) {
    doc.font("Helvetica-Bold").fontSize(12).text("FIREPLACE", defaultX);
    doc.moveDown(0.5);
    renderField(
      "Location",
      formatField(
        fireplace.interiorFireplaceLocation,
        fireplace.otherInteriorFireplaceLocation
      ),
      { indent }
    );
    renderField(
      "Type",
      formatField(
        fireplace.interiorFireplaceType,
        fireplace.otherInteriorFireplaceType
      ),
      { indent }
    );
    renderField(
      "Condition",
      formatField(
        fireplace.interiorFireplaceCondition,
        fireplace.otherInteriorFireplaceCondition
      ),
      { indent }
    );
    renderField("Comments", fireplace.interiorFireplaceComments?.join(", "), {
      indent,
    });

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage2(["interiorFireplaceImage"], fireplaceIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }
    fireplaceIndex++;
  }

  // FLOOR DRAIN Section
  checkSpace(50);
  doc.font("Helvetica-Bold").fontSize(12).text("FLOOR DRAIN", defaultX);
  doc.moveDown(0.5);
  renderField(
    "Condition",
    formatField(
      interiorInfo.floorDrain.interiorFloorDrainCondition,
      interiorInfo.floorDrain.otherInteriorFloorDrainCondition
    ),
    { indent }
  );
  renderField(
    "Comments",
    interiorInfo.floorDrain.interiorFloorDrainComments?.join(", "),
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage2("interiorFloorDrainImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  // ATTIC Section
  checkSpace(50);
  doc.font("Helvetica-Bold").fontSize(12).text("ATTICS", defaultX);
  renderField(
    "Access",
    formatField(
      interiorInfo.attic.interiorAtticAccess,
      interiorInfo.attic.otherInteriorAtticAccess
    ),
    { indent }
  );
  renderField(
    "Location",
    formatField(
      interiorInfo.attic.interiorAtticLocation,
      interiorInfo.attic.otherInteriorAtticLocation
    ),
    { indent }
  );
  renderField(
    "Inspection Method",
    formatField(
      interiorInfo.attic.interiorAtticInspectionMethod,
      interiorInfo.attic.otherInteriorAtticInspectionMethod
    ),
    { indent }
  );
  renderField(
    "Roof Framing",
    formatField(
      interiorInfo.attic.interiorAtticRoofFraming,
      interiorInfo.attic.otherInteriorAtticRoofFraming
    ),
    { indent }
  );
  renderField(
    "Sheathing",
    formatField(
      interiorInfo.attic.interiorAtticSheathing,
      interiorInfo.attic.otherInteriorAtticSheathing
    ),
    { indent }
  );
  renderField(
    "Insulation Type",
    formatField(
      interiorInfo.attic.interiorAtticInsulationType,
      interiorInfo.attic.otherInteriorAtticInsulationType
    ),
    { indent }
  );
  renderField(
    "Insulation Depth",
    formatField(
      interiorInfo.attic.interiorAtticInsulationDepth,
      interiorInfo.attic.otherInteriorAtticInsulationDepth
    ),
    { indent }
  );
  renderField(
    "Vapor Barrier",
    formatField(
      interiorInfo.attic.interiorAtticVaporBarrier,
      interiorInfo.attic.otherInteriorAtticVaporBarrier
    ),
    { indent }
  );
  renderField(
    "Ventilation",
    formatField(
      interiorInfo.attic.interiorAtticVentilation,
      interiorInfo.attic.otherInteriorAtticVentilation
    ),
    { indent }
  );
  renderField(
    "Fans exhausted to Attic",
    formatField(
      interiorInfo.attic.interiorAtticExhaustFan,
      interiorInfo.attic.otherInteriorAtticExhaustFan
    ),
    { indent }
  );

  checkSpace(50);
  if (await insertImage2("interiorAtticsImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  renderField(
    "Comments",
    interiorInfo.attic.interiorAtticComments?.join(", "),
    { indent }
  );
  doc.moveDown(1);
  await insertImage2("interiorCommentsImage");
  doc.moveDown(1);

  // SUMP PUMP Section
  checkSpace(50);
  doc.font("Helvetica-Bold").fontSize(12).text("SUMP PUMP", defaultX);
  doc.moveDown(0.5);
  renderField(
    "Location",
    formatField(
      interiorInfo.sumpPump.interiorSumpPumpLocation,
      interiorInfo.sumpPump.otherInteriorSumpPumpLocation
    ),
    { indent }
  );
  renderField(
    "Condition",
    formatField(
      interiorInfo.sumpPump.interiorSumpPumpCondition,
      interiorInfo.sumpPump.otherInteriorSumpPumpCondition
    ),
    { indent }
  );
  renderField("Comments", interiorInfo.sumpPump.interiorSumpPumpComments, {
    indent,
  });

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("interiorSumpPumpImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  drawFooter(doc, currentPage);
  currentPage++;
  doc.addPage();

  return currentPage;
};

module.exports = generateInteriorInfo;
