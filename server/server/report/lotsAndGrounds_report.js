const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");
const drawFooter = require("./footer");

const generateGroundsInfo = async (
  doc,
  groundsInfo,
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

  // LOTS AND GROUNDS Section Title
  checkSpace(50);
  doc.font("Helvetica-Bold").fontSize(20).text("LOTS AND GROUNDS");
  doc.lineWidth(0.5);
  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  checkSpace(50);
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "Unable to inspect areas that are hidden or are not visible. Unable to inspect areas that are considered not safe or health hazards.",
      { align: "left", paragraphGap: 10 }
    );
  doc.moveDown(1);

  // DRIVEWAY / PARKING Section
  checkSpace(50);
  doc.font("Helvetica-Bold").fontSize(12).text("DRIVEWAY / PARKING", defaultX);

  const drivewayMaterial = formatField(
    groundsInfo.driveway.material,
    groundsInfo.driveway.otherMaterial
  );
  renderField("Material", drivewayMaterial, { indent });

  const drivewayCondition = formatField(
    groundsInfo.driveway.condition,
    groundsInfo.driveway.otherCondition
  );
  renderField("Condition", drivewayCondition, { indent });

  renderField("Comments", groundsInfo.driveway.comments, { indent });
  doc.moveDown(1);

  checkSpace(50);
  if (await insertImage("lotsAndGroundsDrivewayImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  // PORCH Section
  checkSpace(50);
  doc.font("Helvetica-Bold").fontSize(12).text("PORCH", defaultX);

  const porchMaterial = formatField(
    groundsInfo.porch.material,
    groundsInfo.porch.otherMaterial
  );
  renderField("Material", porchMaterial, { indent });

  const porchCondition = formatField(
    groundsInfo.porch.condition,
    groundsInfo.porch.otherCondition
  );
  renderField("Condition", porchCondition, { indent });

  renderField("Comments", groundsInfo.porch.comments, { indent });

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("lotsAndGroundsPorchImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  // STEPS AND HANDRAILS Section
  const stepsMaterial = formatField(
    groundsInfo.stepsHandrails.material,
    groundsInfo.stepsHandrails.otherMaterial
  );
  renderField("Steps and Handrails", stepsMaterial, { indent });

  const stepsCondition = formatField(
    groundsInfo.stepsHandrails.condition,
    groundsInfo.stepsHandrails.otherCondition
  );
  renderField("Condition", stepsCondition, { indent });

  renderField("Comments", groundsInfo.stepsHandrails.comments, { indent });

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("lotsAndGroundsStepsAndHandrailsImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  // DECK / PATIO / BALCONY Section
  checkSpace(50);
  let deckPatioIndex = 0; // Track index for unique images
  for (const patio of groundsInfo.deckPatio) {
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("DECK / PATIO / BALCONY", defaultX);

    const patioMaterial = formatField(patio.material, patio.otherMaterial);
    renderField("Material", patioMaterial, { indent });

    const patioCondition = formatField(patio.condition, patio.otherCondition);
    renderField("Condition", patioCondition, { indent });

    renderField("Comments", patio.comments, { indent });

    doc.moveDown(1);
    checkSpace(50);
    if (
      await insertImage2(
        ["lotsAndGroundsDeckPatioBalconyImage"],
        deckPatioIndex
      )
    ) {
      doc.moveDown(1);
    }
    deckPatioIndex++;
  }

  // FENCE Section
  checkSpace(50);
  if (groundsInfo.fence.material || groundsInfo.fence.condition) {
    doc.font("Helvetica-Bold").fontSize(12).text("FENCE", defaultX);

    const fenceMaterial = formatField(
      groundsInfo.fence.material,
      groundsInfo.fence.otherMaterial
    );
    renderField("Material", fenceMaterial, { indent });

    const fenceCondition = formatField(
      groundsInfo.fence.condition,
      groundsInfo.fence.otherCondition
    );
    renderField("Condition", fenceCondition, { indent });

    renderField("Comments", groundsInfo.fence.comments, { indent });

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage("lotsAndGroundsFenceImage")) {
      doc.moveDown(1);
      doc.moveDown(1);
    }
  }

  // LANDSCAPING AFFECTING FOUNDATION Section
  checkSpace(50);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("LANDSCAPING AFFECTING FOUNDATION", defaultX);

  const landscapingRecommendations = formatField(
    groundsInfo.landscaping.recommendations,
    groundsInfo.landscaping.otherRecommendations
  );
  renderField("Recommendations", landscapingRecommendations, { indent });

  doc.moveDown(1);

  if (await insertImage("lotsAndGroundsLandscapingImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  drawFooter(doc, currentPage);
  currentPage++;
  doc.addPage();

  return currentPage;
};

module.exports = generateGroundsInfo;
