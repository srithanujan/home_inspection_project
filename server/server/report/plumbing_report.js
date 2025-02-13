const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");
const drawFooter = require("./footer");

const generatePlumbingInfo = async (
  doc,
  plumbingInfo,
  pageNumber,
  inspectionId
) => {
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

  // Plumbing Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("PLUMBING SYSTEM");
  doc.lineWidth(0.5);
  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);
  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  renderField(
    "Main Shut-off (Water meter) Location",
    formatField(
      plumbingInfo.regular.plumbingMainShutoffLocation,
      plumbingInfo.regular.otherPlumbingMainShutoffLocation
    ),
    indentOptions
  );

  renderField(
    "Water Entry Piping",
    formatField(
      plumbingInfo.regular.plumbingWaterEntryPiping,
      plumbingInfo.regular.otherPlumbingWaterEntryPiping
    ),
    indentOptions
  );

  renderField(
    "Lead Other Than Solder Joist",
    formatField(
      plumbingInfo.regular.plumbingLeadOtherThanSolderJoist,
      plumbingInfo.regular.otherPlumbingLeadOtherThanSolderJoist
    ),
    indentOptions
  );

  renderField(
    "Visible Water Distribution Piping",
    formatField(
      plumbingInfo.regular.plumbingVisibleWaterDistributionPiping,
      plumbingInfo.regular.otherPlumbingVisibleWaterDistributionPiping
    ),
    indentOptions
  );

  renderField(
    "Condition",
    formatField(
      plumbingInfo.regular.plumbingCondition,
      plumbingInfo.regular.otherPlumbingCondition
    ),
    indentOptions
  );

  renderField(
    "Functional Flow",
    formatField(
      plumbingInfo.regular.plumbingFunctionalFlow,
      plumbingInfo.regular.otherPlumbingFunctionalFlow
    ),
    indentOptions
  );

  renderField(
    "Drain, Waste & Vent Pipe",
    formatField(
      plumbingInfo.regular.plumbingDrainWasteAndVentPipe,
      plumbingInfo.regular.otherPlumbingDrainWasteAndVentPipe
    ),
    indentOptions
  );

  if (plumbingInfo.regular.plumbingComments) {
    renderField(
      "Comments",
      plumbingInfo.regular.plumbingComments,
      indentOptions
    );
  }

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("plumbingWaterMeterImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  renderField(
    "Water Heater Type",
    formatField(
      plumbingInfo.waterHeater.plumbingWaterHeaterType,
      plumbingInfo.waterHeater.otherPlumbingWaterHeaterType
    ),
    indentOptions
  );

  renderField(
    "Approximate Age",
    plumbingInfo.waterHeater.waterHeaterApproximateAge,
    indentOptions
  );

  renderField(
    "Energy Source",
    formatField(
      plumbingInfo.waterHeater.waterHeaterEnergySource,
      plumbingInfo.waterHeater.otherWaterHeaterEnergySource
    ),
    indentOptions
  );

  renderField(
    "Capacity",
    formatField(
      plumbingInfo.waterHeater.waterHeaterCapacity,
      plumbingInfo.waterHeater.otherWaterHeaterCapacity
    ),
    indentOptions
  );

  renderField(
    "Operation",
    formatField(
      plumbingInfo.waterHeater.waterHeaterOperation,
      plumbingInfo.waterHeater.otherWaterHeaterOperation
    ),
    indentOptions
  );

  renderField(
    "Condition",
    formatField(
      plumbingInfo.waterHeater.waterHeaterCondition,
      plumbingInfo.waterHeater.otherWaterHeaterCondition
    ),
    indentOptions
  );

  if (plumbingInfo.waterHeater.waterHeaterComments) {
    renderField(
      "Comments",
      plumbingInfo.waterHeater.waterHeaterComments,
      indentOptions
    );
  }

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("plumbingWaterHeaterImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  // Add Footer
  drawFooter(doc, currentPage);
  currentPage++;
  doc.addPage();

  return currentPage;
};

module.exports = generatePlumbingInfo;
