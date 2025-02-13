const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");
const drawFooter = require("./footer");

const generateRoofInfo = async (doc, roofInfo, pageNumber, inspectionId) => {

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
        .fontSize(12)
        .text(`${label}: `, { continued: true, ...options });
      doc.font("Helvetica").text(value, options);
    }
  };

  const indentOptions = { indent: 20 };

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

  // Roof Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("ROOF");
  doc.lineWidth(0.5);
  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  // Hardcoded paragraph
  checkSpace(50);
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "I'm not a professional roofer. Feel free to hire a professional roofer prior to closing to find the exact condition of the roof. I will do my best to inspect the roof system within my limitations.",
      { align: "left", paragraphGap: 10 }
    );

  doc.moveDown(0.5);

  checkSpace(50);
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "It's virtually impossible to detect a leak except as it's occurring or by specific water tests which are beyond the scope of my inspection. Recommend Inspecting roofs annually to monitor the condition. Performance of roofing can be unpredictable, due to severe weather conditions and animal damage. A leak free lifespan is impossible to predict. Leakage is most likely to occur at joints where surface transition as well as roof penetrations (Chimneys, Pipes, Vents). It is pro-active and recommended to have the roof done when the covering is showing signs of deterioration and BEFORE leaks are showing. I recommend that you ask the seller for receipts for roofing work to find out its age and if there is any remaining warranty and that you include comprehensive roof coverage in your home insurance policy.",
      { align: "left", paragraphGap: 10 }
    );

  doc.moveDown(1);

  const style = formatField(
    roofInfo.roofDescription.style,
    roofInfo.roofDescription.otherStyle
  );
  renderField("Style of Roof", style);

  const pitch = formatField(
    roofInfo.roofDescription.pitch,
    roofInfo.roofDescription.otherPitch
  );
  renderField("Pitch", pitch);

  const visibility = formatField(
    roofInfo.roofDescription.visibility,
    roofInfo.roofDescription.otherVisibility
  );
  renderField("Visibility", visibility);

  const methodOfInspection = formatField(
    roofInfo.roofDescription.methodOfInspection,
    roofInfo.roofDescription.otherMethodOfInspection
  );
  renderField("Method of Inspection", methodOfInspection);

  const ventilationPresent = formatField(
    roofInfo.roofDescription.ventilationPresent,
    roofInfo.roofDescription.otherVentilationPresent
  );
  renderField("Ventilation Present", ventilationPresent);

  const ventilationType = formatField(
    roofInfo.roofDescription.ventilationType,
    roofInfo.roofDescription.otherVentilationType
  );
  renderField("Ventilation Type", ventilationType);
  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("plumbingConditionOfCoveringsImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  // Condition of Roof Coverings Section
  checkSpace(50);
  doc.font("Helvetica-Bold").fontSize(12).text("CONDITION OF ROOF COVERINGS");
  doc.moveDown(1);

  const material = formatField(
    roofInfo.conditionOfCoverings.material,
    roofInfo.conditionOfCoverings.otherMaterial
  );
  renderField("Material", material);

  const approximateAgeShingles =
    roofInfo.conditionOfCoverings.approximateAgeShingles;
  renderField("Approximate Age of Shingles", approximateAgeShingles);

  const condition = formatField(
    roofInfo.conditionOfCoverings.condition,
    roofInfo.conditionOfCoverings.otherCondition
  );
  renderField("Condition*", condition);

  if (roofInfo.conditionOfCoverings.comments) {
    renderField("Comments", roofInfo.conditionOfCoverings.comments);
  }

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("plumbingConditionOfCoveringsSecondImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  const bulletPoints = [
    "Unable to inspect the roof thoroughly due to height restrictions.",
    "The shingles typically last between 12-15 years depending on the roof slope and quality of shingles.",
    "Recommend a roof inspection by professional roofer before closing to get accurate information about roof condition.",
  ];

  checkSpace(50);
  doc.moveDown(1);
  doc.font("Helvetica").fontSize(12);

  bulletPoints.forEach((point) => {
    checkSpace(50);
    doc.text(`• ${point}`, { indent: 20 });
  });

  doc.moveDown(1);

  // Plumbing Vents Section
  checkSpace(50);
  doc.font("Helvetica-Bold").fontSize(12).text("PLUMBING VENTS");
  doc.moveDown(1);

  const plumbingOfVents = formatField(
    roofInfo.plumbingVents.plumbingOfVents,
    roofInfo.plumbingVents.otherPlumbingOfVents
  );
  renderField("Plumbing Vents", plumbingOfVents, indentOptions);

  const type = formatField(
    roofInfo.plumbingVents.type,
    roofInfo.plumbingVents.otherType
  );
  renderField("Type", type, indentOptions);

  const plumbingCondition = formatField(
    roofInfo.plumbingVents.condition,
    roofInfo.plumbingVents.otherCondition
  );
  renderField("Condition", plumbingCondition, indentOptions);

  if (roofInfo.plumbingVents.comments) {
    renderField("Comments", roofInfo.plumbingVents.comments, indentOptions);
  }

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("plumbingVentsImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  checkSpace(50);
  doc
    .font("Helvetica")
    .fontSize(12)
    .text("*Conditions reported above reflects visible portion only", {
      align: "left",
      paragraphGap: 10,
    });


  drawFooter(doc, currentPage);
  currentPage++;
  doc.addPage();

  return currentPage;
};

module.exports = generateRoofInfo;