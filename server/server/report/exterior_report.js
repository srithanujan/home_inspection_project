const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");
const drawFooter = require("./footer");

const generateExteriorInfo = async (
  doc,
  exteriorInfo,
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

  // EXTERIOR Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("EXTERIOR");
  doc.lineWidth(0.5);
  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);
  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  // EXTERIOR WALL Section
  let exteriorWallIndex = 0; // Track index for unique images
  for (const wall of exteriorInfo.exteriorWall) {
    doc.font("Helvetica-Bold").fontSize(12).text("EXTERIOR WALL", defaultX);
    doc.moveDown(0.5);

    // Exterior Wall Fields
    const wallType = formatField(
      wall.exteriorWallType,
      wall.otherExteriorWallType
    );
    renderField("Type", wallType, { indent });

    const wallCondition = formatField(
      wall.exteriorWallCondition,
      wall.otherExteriorWallCondition
    );
    renderField("Condition", wallCondition, { indent });

    renderField("Comments", wall.exteriorWallComments, { indent });

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage2(["exteriorWallImage"], exteriorWallIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }
    exteriorWallIndex++;
  }

  checkSpace(50);
  // FOUNDATION Section
  doc.font("Helvetica-Bold").fontSize(12).text("FOUNDATION", defaultX);
  doc.moveDown(0.5);
  renderField(
    "Type",
    formatField(
      exteriorInfo.foundation.foundationType,
      exteriorInfo.foundation.otherFoundationType
    ),
    { indent }
  );
  renderField(
    "Condition",
    formatField(
      exteriorInfo.foundation.exteriorFoundationCondition,
      exteriorInfo.foundation.otherExteriorFoundationCondition
    ),
    { indent }
  );
  renderField(
    "Comments",
    exteriorInfo.foundation.foundationComments?.join(", "),
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("exteriorFoundationImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  // EXTERIOR DOORS Section
  checkSpace(50);
  doc.font("Helvetica-Bold").fontSize(12).text("EXTERIOR DOOR", defaultX);
  doc.moveDown(0.5);
  renderField(
    "Main Entry Door",
    formatField(
      exteriorInfo.exteriorExteriorDoor.exteriorDoorMainEntryDoor,
      exteriorInfo.exteriorExteriorDoor.otherExteriorDoorMainEntryDoor
    ),
    { indent }
  );
  renderField(
    "Door Condition",
    formatField(
      exteriorInfo.exteriorExteriorDoor.exteriorDoorDoorCondition,
      exteriorInfo.exteriorExteriorDoor.otherExteriorDoorDoorCondition
    ),
    { indent }
  );
  renderField(
    "Weather Stripping",
    exteriorInfo.exteriorExteriorDoor.exteriorDoorWeatherStripping?.join(", "),
    { indent }
  );
  renderField(
    "Storm Door",
    exteriorInfo.exteriorExteriorDoor.exteriorDoorStormDoor?.join(", "),
    { indent }
  );
  renderField(
    "Condition",
    formatField(
      exteriorInfo.exteriorExteriorDoor.exteriorDoorStormDoorCondition,
      exteriorInfo.exteriorExteriorDoor.otherExteriorDoorStormDoorCondition
    ),
    { indent }
  );

  renderField(
    "Doorbell",
    formatField(
      exteriorInfo.exteriorExteriorDoor?.exteriorDoorDoorBell,
      exteriorInfo.exteriorExteriorDoor?.otherExteriorDoorDoorBell
    ),
    { indent }
  );

  renderField(
    "Type",
    formatField(
      exteriorInfo.exteriorExteriorDoor?.exteriorDoorDoorBellType,
      exteriorInfo.exteriorExteriorDoor?.otherExteriorDoorDoorBellType
    ),
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("exteriorDoorImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  checkSpace(50);
  // EXTERIOR SIDE DOORS Section
  renderField(
    "Side Door",
    formatField(
      exteriorInfo.exteriorSideDoor.exteriorSideDoors,
      exteriorInfo.exteriorSideDoor.otherExteriorSideDoors
    ),
    { indent }
  );
  renderField(
    "Door Condition",
    formatField(
      exteriorInfo.exteriorSideDoor.exteriorSideDoorsDoorCondition,
      exteriorInfo.exteriorSideDoor.otherExteriorSideDoorsDoorCondition
    ),
    { indent }
  );
  renderField(
    "Weather Stripping",
    formatField(
      exteriorInfo.exteriorSideDoor.exteriorSideDoorsWeatherStripping,
      exteriorInfo.exteriorSideDoor.otherExteriorSideDoorsWeatherStripping
    ),
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("exteriorSideDoorImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  checkSpace(50);
  // EXTERIOR PATIO DOORS Section
  renderField(
    "Patio Door",
    formatField(
      exteriorInfo.exteriorPatioDoor.exteriorPatioDoors,
      exteriorInfo.exteriorPatioDoor.otherExteriorPatioDoors
    ),
    { indent }
  );
  renderField(
    "Door Condition",
    formatField(
      exteriorInfo.exteriorPatioDoor.exteriorPatioDoorsCondition,
      exteriorInfo.exteriorPatioDoor.otherExteriorPatioDoorsCondition
    ),
    { indent }
  );
  renderField(
    "Comments",
    formatField(
      exteriorInfo.exteriorPatioDoor.exteriorPatioDoorsComments,
      exteriorInfo.exteriorPatioDoor.otherExteriorPatioDoorsComments
    ),
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("exteriorPatioDoorImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  checkSpace(50);
  // EXTERIOR PATIO SCREEN DOORS Section
  renderField(
    "Patio Screen Door",
    formatField(
      exteriorInfo.exteriorPatioScreenDoor.exteriorPatioScreensDoors,
      exteriorInfo.exteriorPatioScreenDoor.otherExteriorPatioScreensDoors
    ),
    { indent }
  );
  renderField(
    "Condition",
    formatField(
      exteriorInfo.exteriorPatioScreenDoor.exteriorPatioDoorScreensCondition,
      exteriorInfo.exteriorPatioScreenDoor
        .otherExteriorPatioDoorScreensCondition
    ),
    { indent }
  );
  renderField(
    "Comments",
    formatField(
      exteriorInfo.exteriorPatioScreenDoor.exteriorPatioDoorScreensComments,
      exteriorInfo.exteriorPatioScreenDoor.otherExteriorPatioDoorScreensComments
    ),
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("exteriorPatioScreenDoorImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  checkSpace(50);
  // GUTTERS AND DOWNSPOUTS Section
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("GUTTERS / DOWNSPOUTS / ROOF DRAINAGE", defaultX);
  doc.moveDown(0.5);

  renderField(
    "Material",
    formatField(
      exteriorInfo.gutter.guttersDownspoutsRoofDrainageMaterial,
      exteriorInfo.gutter.otherGuttersDownspoutsRoofDrainageMaterial
    ),
    { indent }
  );
  renderField(
    "Condition",
    formatField(
      exteriorInfo.gutter.guttersDownspoutsRoofDrainageCondition,
      exteriorInfo.gutter.otherGuttersDownspoutsRoofDrainageCondition
    ),
    { indent }
  );
  renderField(
    "Leaking",
    formatField(
      exteriorInfo.gutter.guttersDownspoutsRoofDrainageLeaking,
      exteriorInfo.gutter.otherGuttersDownspoutsRoofDrainageLeaking
    ),
    { indent }
  );
  renderField(
    "Attachment",
    formatField(
      exteriorInfo.gutter.guttersDownspoutsRoofDrainageAttachment,
      exteriorInfo.gutter.otherGuttersDownspoutsRoofDrainageAttachment
    ),
    { indent }
  );

  renderField(
    "Extension Needed",
    formatField(
      exteriorInfo.gutter?.guttersDownspoutsRoofDrainageExtensionNeeded,
      exteriorInfo.gutter?.otherGuttersDownspoutsRoofDrainageExtensionNeeded
    ),
    { indent }
  );

  renderField(
    "Comments",
    formatField(
      exteriorInfo.gutter?.guttersDownspoutsRoofDrainageComments,
      exteriorInfo.gutter?.otherGuttersDownspoutsRoofDrainageComments
    ),
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("exteriorGuttersRoofsRoofDrainageImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  checkSpace(50);
  // WINDOWS Section
  doc.font("Helvetica-Bold").fontSize(12).text("WINDOWS", defaultX);
  doc.moveDown(0.5);
  renderField(
    "Approximate Age",
    formatField(
      exteriorInfo.window?.windowsApproximateAge,
      exteriorInfo.window?.otherWindowsApproximateAge
    ),
    { indent }
  );

  renderField(
    "Material & Type",
    formatField(
      exteriorInfo.window?.windowsMaterialAndType,
      exteriorInfo.window?.otherWindowsMaterialAndType
    ),
    { indent }
  );

  renderField(
    "Condition",
    formatField(
      exteriorInfo.window?.windowsCondition,
      exteriorInfo.window?.otherWindowsCondition
    ),
    { indent }
  );

  renderField(
    "Comments",
    formatField(
      exteriorInfo.window?.windowsComments,
      exteriorInfo.window?.otherWindowsComments
    ),
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("exteriorWindowsMaterialImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  // WINDOW SCREENS
  checkSpace(50);
  renderField("Window Screens", exteriorInfo.window?.windowScreens, { indent });

  renderField(
    "Condition",
    formatField(
      exteriorInfo.window?.windowScreensCondition,
      exteriorInfo.window?.otherWindowScreensCondition
    ),
    { indent }
  );

  renderField(
    "Comments",
    formatField(
      exteriorInfo.window?.windowScreensComments,
      exteriorInfo.window?.otherWindowScreensComments
    ),
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("exteriorWindowScreensImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  // BASEMENT WINDOWS
  checkSpace(50);
  renderField("Exists", exteriorInfo.window?.basementWindows, { indent });

  renderField(
    "Approximate Age",
    exteriorInfo.window?.basementWindowsApproximateAge,
    { indent }
  );

  renderField(
    "Material",
    formatField(
      exteriorInfo.window?.basementWindowsMaterial,
      exteriorInfo.window?.otherBasementWindowsMaterial
    ),
    { indent }
  );

  renderField(
    "Condition",
    formatField(
      exteriorInfo.window?.basementWindowsCondition,
      exteriorInfo.window?.otherBasementWindowsCondition
    ),
    { indent }
  );

  renderField(
    "Comments",
    formatField(
      exteriorInfo.window?.basementWindowsComments,
      exteriorInfo.window?.otherBasementWindowsComments
    ),
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("exteriorBasementWindowsImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  checkSpace(50);
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "Recommendation: All windows will need periodic caulking on both inside and outside of the window and door system.",
      { indent }
    );

  doc.moveDown(1);

  // GAS METER Section
  checkSpace(50);
  let gasMeterIndex = 0; // Track index for unique images
  let isFirstGasMeter = true;

  for (const gasMeter of exteriorInfo.gasMeter) {
    doc.font("Helvetica-Bold").fontSize(12).text("GAS METER", defaultX);
    doc.moveDown(0.5);

    checkSpace(50);
    if (isFirstGasMeter) {
      doc
        .font("Helvetica-BoldOblique")
        .fontSize(12)
        .text("HOMEOWNER TIP:", { indent });
      doc
        .font("Helvetica-BoldOblique")
        .fontSize(12)
        .text(
          "Please keep the area around the gas meter clear of materials and vegetation for accessibility.",
          { indent }
        );
      doc
        .font("Helvetica-BoldOblique")
        .fontSize(12)
        .text("Protect meter from impact damage.", { indent });

      doc.moveDown(1);
      isFirstGasMeter = false;
    }

    const gasMeterType = formatField(
      gasMeter.gasMeterType,
      gasMeter.otherGasMeterType
    );
    renderField("Type", gasMeterType, { indent });

    const gasMeterCondition = formatField(
      gasMeter.gasMeterCondition,
      gasMeter.otherGasMeterCondition
    );
    renderField("Condition", gasMeterCondition, { indent });

    renderField("Comments", gasMeter.gasMeterComments, { indent });

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage2(["exteriorGasMeterImage"], gasMeterIndex)) {
      doc.moveDown(1);
    }
    gasMeterIndex++;
  }

  // ELECTRICITY Section
  checkSpace(50);
  doc.font("Helvetica-Bold").fontSize(12).text("ELECTRICAL", defaultX);
  doc.moveDown(0.5);
  renderField(
    "Exterior outlets and lights",
    formatField(
      exteriorInfo.electricity.exteriorOutletsAndLights,
      exteriorInfo.electricity.otherExteriorOutletsAndLights
    ),
    { indent }
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("exteriorOutletsAndLightsImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  // EXTERIOR HOUSE BIBS
  checkSpace(50);
  if (
    exteriorInfo.exteriorHouseBibs &&
    exteriorInfo.exteriorHouseBibs.length > 0
  ) {
    doc.font("Helvetica-Bold").fontSize(12).text("EXTERIOR HOUSE BIBS");
    doc.moveDown(1);

    exteriorInfo.exteriorHouseBibs.forEach((bib) => {
      renderField(
        "Type",
        formatField(bib.exteriorHouseBibsType, bib.otherExteriorHouseBibsType),
        { indent }
      );
      renderField(
        "Condition",
        formatField(
          bib.exteriorHouseBibsCondition,
          bib.otherExteriorHouseBibsCondition
        ),
        { indent }
      );
      renderField(
        "Comments",
        formatField(
          bib.exteriorHouseBibsComments,
          bib.otherExteriorHouseBibsComments
        ),
        { indent }
      );
      doc.moveDown(0.5);
    });
  }

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("exteriorHouseBibsImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  checkSpace(50);
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "Always recommend shutting off exterior hoses in garage and yard FROM THE INTERIOR and BLEEDING THE LINES to reduce freezing damage during winter months.",
      { indent }
    );

  doc.moveDown(1);

  // AIR CONDITIONING Section
  checkSpace(50);
  let airConditionIndex = 0; // Track index for unique images
  isFirstAirConditioning = true;

  for (const acUnit of exteriorInfo.airCondition) {
    doc.font("Helvetica-Bold").fontSize(12).text("AIR CONDITIONING", defaultX);

    if (isFirstAirConditioning) {
      doc
        .font("Helvetica-BoldOblique")
        .fontSize(12)
        .text("HOMEOWNER TIP:", { indent });
      doc
        .font("Helvetica-BoldOblique")
        .fontSize(12)
        .text(
          "Please keep the area around the air condition unit clear of materials and vegetation for accessibility.",
          { indent }
        );
      doc
        .font("Helvetica-BoldOblique")
        .fontSize(12)
        .text("Protect AC unit from impact damage.", { indent });

      doc.moveDown(1);
      isFirstAirConditioning = false;
    }

    renderField("Manufacturer", acUnit.airConditionsManufacturer, { indent });
    renderField("Approximate Age", acUnit.airConditionsApproximateAge, {
      indent,
    });

    const airConditionAreaServed = formatField(
      acUnit.airConditionsAreaServed,
      acUnit.otherAirConditionsAreaServed
    );
    renderField("Area Served", airConditionAreaServed, { indent });

    const airConditionFuelType = formatField(
      acUnit.airConditionsFuelType,
      acUnit.otherAirConditionsFuelType
    );
    renderField("Fuel Type", airConditionFuelType, { indent });

    const airConditionCondition = formatField(
      acUnit.airConditionsCondition,
      acUnit.otherAirConditionsCondition
    );
    renderField("Condition", airConditionCondition, { indent });

    const airConditionCondenserFins = formatField(
      acUnit.airConditionsCondenserFins,
      acUnit.otherAirConditionsCondenserFins
    );
    renderField("Condenser Fins", airConditionCondenserFins, { indent });

    const airConditionCabinetHousing = formatField(
      acUnit.airConditionsCabinetHousing,
      acUnit.otherAirConditionsCabinetHousing
    );
    renderField("Cabinet Housing", airConditionCabinetHousing, { indent });

    const airConditionRefrigerantLineInsulation = formatField(
      acUnit.airConditionsRefrigerantLineInsulation,
      acUnit.otherAirConditionsRefrigerantLineInsulation
    );
    renderField(
      "Refrigerant Line Insulation",
      airConditionRefrigerantLineInsulation,
      { indent }
    );

    renderField("A/C System Operation", acUnit.airConditionsACSystemOperation, {
      indent,
    });

    renderField("Comments", acUnit.airConditionsComments, { indent });

    doc.moveDown(1);
    checkSpace(50);
    if (
      await insertImage2(["exteriorAirConditioningImage"], airConditionIndex)
    ) {
      doc.moveDown(1);
    }
    airConditionIndex++;
  }

  checkSpace(50);
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text("Recommendation:", { indent });
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "We recommend setting up a service contract with an AC maintenance company to ensure the equipment is properly serviced annually.",
      { indent }
    );

  doc.moveDown(0.5);

  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "The design life of the unit is 12-15 years (and up to 20-25 years if well maintained) This can be verified by an HVAC specialist. At the very least the A/C unit should be serviced annually.",
      { indent }
    );

  doc.moveDown(1);

  drawFooter(doc, currentPage);
  currentPage++;
  doc.addPage();

  return currentPage;
};

module.exports = generateExteriorInfo;
