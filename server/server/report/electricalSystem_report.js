const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");
const drawFooter = require("./footer");

const generateElectricalSystemInfo = async (
  doc,
  electricalInfo,
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

  const indentOptions = { indent: 20 };

  // Electrical System Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("ELECTRICAL SYSTEM");
  doc.lineWidth(0.5);
  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);
  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  // Main Electrical Panel Section
  doc.font("Helvetica-Bold").fontSize(12).text("MAIN ELECTRICAL PANEL");
  doc.moveDown(0.5);

  const mainPanel = electricalInfo.mainElectricalPanel;
  if (mainPanel) {
    renderField(
      "Panel Location",
      formatField(
        mainPanel.electricalMainElectricalPanelLocation,
        mainPanel.otherElectricalMainElectricalPanelLocation
      ),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        mainPanel.electricalMainElectricalPanelCondition,
        mainPanel.otherElectricalMainElectricalPanelCondition
      ),
      indentOptions
    );

    renderField(
      "Adequate Clearance to Panel",
      formatField(
        mainPanel.electricalAdequateClearanceToPanel,
        mainPanel.otherElectricalAdequateClearanceToPanel
      ),
      indentOptions
    );

    renderField(
      "Main Breaker Size",
      formatField(
        mainPanel.electricalMainBreakerSize,
        mainPanel.otherElectricalMainBreakerSize
      ),
      indentOptions
    );

    renderField(
      "Service Size (Amps)",
      formatField(
        mainPanel.electricalServiceSizeAmps,
        mainPanel.otherElectricalServiceSizeAmps
      ),
      indentOptions
    );

    renderField(
      "Voltage",
      formatField(mainPanel.electricalVolts, mainPanel.otherElectricalVolts),
      indentOptions
    );

    renderField(
      "Appears Grounded",
      formatField(
        mainPanel.electricalAppearsGrounded,
        mainPanel.otherElectricalAppearsGrounded
      ),
      indentOptions
    );

    renderField(
      "Main Wiring",
      formatField(
        mainPanel.electricalMainWiring,
        mainPanel.otherElectricalMainWiring
      ),
      indentOptions
    );

    if (mainPanel.electricalMainElectricalPanelComments) {
      renderField(
        "Comments",
        formatField(
          mainPanel.electricalMainElectricalPanelComments,
          mainPanel.otherElectricalMainElectricalPanelComments
        ),
        indentOptions
      );
    }
  }

   doc.moveDown(1);
   checkSpace(50);
   if (await insertImage("electricalSystemMainElectricalPanelImage")) {
     doc.moveDown(1);
     doc.moveDown(1);
   }

  // Lighting and Outlets Section

  doc.font("Helvetica-Bold").fontSize(12).text("LIGHTINGS AND OUTLETS");
  doc.moveDown(0.5);

  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "Electrical outlets/Switches/Junction boxes are not open for inspection. Detailed inspection of these components is best left to an electrician.",
      indentOptions
    );
  doc.moveDown(0.5);

  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "All electrical light fixtures and outlets were tested and working at the time of inspection unless otherwise mentioned.",
      indentOptions
    );

  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "Always use an ESA (Electrical Safety Authority) certified electrician to perform any repairs.",
      indentOptions
    );

  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text("See www.esasafe.com for more information.");

  if (electricalInfo.lightingAndOutlets) {
    renderField(
      "Comments",
      electricalInfo.lightingAndOutlets.electricallightsAndOutletsComments,
      indentOptions
    );
  }

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("electricalSystemLightAndOutletsImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  // Add Footer
  drawFooter(doc, currentPage);
  currentPage++;
  doc.addPage();

  return currentPage;
};

module.exports = generateElectricalSystemInfo;
