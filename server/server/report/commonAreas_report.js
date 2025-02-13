const drawFooter = require("./footer");
const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");

const generateCommonAreaInfo = async (
  doc,
  commonAreaInfo,
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
        .text(`${label}:`, { continued: true, ...options })
        .font("Helvetica")
        .text(value, options);
    }
  };

  const insertImage = async (baseNames, index) => {
    for (const baseName of baseNames) {
      const imageName = `${baseName}${index}`;

      try {
        const imageUrl = await fetchImageFromDB(inspectionId, imageName);

        if (!imageUrl) {
          //console.warn(`No image found for: ${imageName}`);
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
      } catch (error) {
        //console.error(`Error processing image ${imageName}:`, error);
      }
    }
  };

  // Common Area Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("COMMON AREA");
  doc.lineWidth(0.5);
  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  // Introductory Paragraph
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(
      "Readily accessible and visible areas are inspected. Heavy furniture and stored belongings can limit access to certain areas.",
      { indentOptions }
    );
  doc.moveDown(1);

  // Iterate through all common areas
  let commonAreaIndex = 0; // Track index for unique images

  for (const commonArea of commonAreaInfo.commonAreas) {
    // Common Area Title
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("COMMON AREALIVING ROOM / FAMILY ROOM / DINING AREA / FOYER");
    doc.moveDown(0.5);

    // Common Area Name
    renderField("Name", commonArea.name, { indent: 20 });
    doc.moveDown(1);

    // Common Area Walls Section
    renderField(
      "Walls",
      formatField(
        commonArea.commonAreaswall.commonAreasWalls,
        commonArea.commonAreaswall.othercommonAreasWalls
      ),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        commonArea.commonAreaswall.commonAreasWallsCondition,
        commonArea.commonAreaswall.othercommonAreasWallsCondition
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["commonAreasWallsImage"], commonAreaIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Ceiling Section
    checkSpace(50);
    renderField(
      "Ceiling",
      formatField(
        commonArea.ceiling.commonAreasCeilings,
        commonArea.ceiling.othercommonAreasCeilings
      ),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        commonArea.ceiling.commonAreasCeilingsCondition,
        commonArea.ceiling.othercommonAreasCeilingsCondition
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["commonAreasCeilingImage"], commonAreaIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Floor Section
    checkSpace(50);
    renderField(
      "Floor",
      formatField(
        commonArea.floor.commonAreasFloors,
        commonArea.floor.othercommonAreasFloors
      ),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        commonArea.floor.commonAreasFloorsCondition,
        commonArea.floor.othercommonAreasFloorsCondition
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["commonAreasFloorsImage"], commonAreaIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Window Section
    checkSpace(50);
    renderField(
      "Windows",
      formatField(
        commonArea.window.commonAreasWindows,
        commonArea.window.othercommonAreasWindows
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["commonAreasWindowsImage"], commonAreaIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Electrical Section
    checkSpace(50);
    renderField(
      "Electrical",
      formatField(
        commonArea.electrical.commonAreasElectricals,
        commonArea.electrical.othercommonAreasElectricals
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["commonAreasElectricalImage"], commonAreaIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Heat Source Section
    checkSpace(50);
    renderField(
      "Heat Source",
      formatField(
        commonArea.heatSource.commonAreasHeatSource,
        commonArea.heatSource.othercommonAreasHeatSource
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["commonAreasHeatSourceImage"], commonAreaIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Comments Section
    checkSpace(50);
    if (commonArea.commonAreasComments) {
      renderField("Comments", commonArea.commonAreasComments, indentOptions);
    }
    doc.moveDown(1);
    commonAreaIndex++;
  }

  drawFooter(doc, currentPage);
  currentPage++;
  doc.addPage();

  return currentPage;
};

module.exports = generateCommonAreaInfo;
