const generateGeneralInfo = (doc, generalInfo, pageNumber) => {
  const drawFooter = require("./footer");
  // GENERAL INFORMATION Section Title

  const defaultX = 50; // Default left margin for section titles

  // LOTS AND GROUNDS Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("GENERAL INFORMATION", defaultX);
  doc.lineWidth(0.5);

  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  // CLIENT INFORMATION Section Title
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("CLIENT INFORMATION", { paragraphGap: 10 });

  // Client Information Details
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Property Address: `, { continued: true })
    .font("Helvetica")
    .text(`${generalInfo.clientInformation.clientAddress}`, {
      paragraphGap: 5,
    });

  doc
    .font("Helvetica-Bold")
    .text(`Contact name: `, { continued: true })
    .font("Helvetica")
    .text(`${generalInfo.clientInformation.contactName}`, { paragraphGap: 5 });

  doc
    .font("Helvetica-Bold")
    .text(`Phone No: `, { continued: true })
    .font("Helvetica")
    .text(`${generalInfo.clientInformation.phoneNumber}`, { paragraphGap: 5 });

  doc
    .font("Helvetica-Bold")
    .text(`Email: `, { continued: true })
    .font("Helvetica")
    .text(`${generalInfo.clientInformation.email}`, { paragraphGap: 30 });

  // INSPECTION COMPANY Section Title
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("INSPECTION COMPANY", { paragraphGap: 10 });

  // Inspection Company Details (Labels bold, Answers regular)
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Inspector name: `, { continued: true })
    .font("Helvetica")
    .text(`${generalInfo.inspectionCompany.inspectorName}`, {
      paragraphGap: 5,
    });

  doc
    .font("Helvetica-Bold")
    .text(`Company name: `, { continued: true })
    .font("Helvetica")
    .text(`${generalInfo.inspectionCompany.inspectionAddress}`, {
      paragraphGap: 5,
    });

  doc
    .font("Helvetica-Bold")
    .text(`Phone No: `, { continued: true })
    .font("Helvetica")
    .text(`${generalInfo.inspectionCompany.phoneNumber}`, { paragraphGap: 5 });

  doc
    .font("Helvetica-Bold")
    .text(`Email: `, { continued: true })
    .font("Helvetica")
    .text(`${generalInfo.inspectionCompany.email}`, { paragraphGap: 30 });

  // DEFINITIONS Section Title
  doc.moveTo(72, doc.y).lineTo(540, doc.y).stroke(); // Line above
  doc.moveDown(1); // Add some space

  // Center the "DEFINITIONS" Title
  const title = "DEFINITIONS";
  const titleWidth = doc.widthOfString(title, {
    font: "Helvetica-Bold",
    size: 15,
  });
  const centerX = (doc.page.width - titleWidth) / 2;
  doc
    .font("Helvetica-Bold")
    .fontSize(15)
    .text(title, centerX, doc.y, { paragraphGap: 10 });

  doc.moveTo(72, doc.y).lineTo(540, doc.y).stroke(); // Line below
  doc.moveDown(1); // Add some space

  // NOTE Section

  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      `NOTE: All definitions listed below refer to the property or item listed as inspected on this report at the time of inspection.`,
      50, // Start at the left margin (72 is the default margin in PDFKit)
      doc.y, // Use the current y position
      {
        align: "left", // Ensure left alignment
        width: 490, // Limit the width of the text block (540 page width - 72 margin on each side)
        paragraphGap: 10,
      }
    )
    .moveDown(1); // Add space below the NOTE section

  // Definitions in Properly Aligned Columns
  const definitions = [
    {
      label: "Acceptable",
      description: "Item is fully functional with no obvious signs of defects",
    },
    {
      label: "Marginal",
      description: "Item is functional but requires repair or servicing",
    },
    {
      label: "Defective",
      description:
        "Item is not functional and needs immediate repair or replacement. It is unable to perform its intended function.",
    },
    { label: "Not present", description: "Item not present or not found" },
    {
      label: "Not inspected",
      description:
        "Item was unable to be inspected for safety reasons or due to lack of power, inaccessible or disconnected.",
    },
  ];

  // Define column positions and line height
  const labelColumnX = 50; // X position for the label
  const descriptionColumnX = 150; // X position for the description
  const lineHeight = 20; // Fixed line height for rows

  // Render each definition
  definitions.forEach((def) => {
    const startY = doc.y; // Current y position

    // Render label
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(def.label, labelColumnX, startY, {
        align: "left",
        continued: false,
      });

    // Render description
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(def.description, descriptionColumnX, startY, {
        width: 380, 
        align: "left",
      });

  });

  drawFooter(doc, pageNumber);
  pageNumber++;
  // Add a new page after the general information section
  doc.addPage();
  return pageNumber;
};

module.exports = generateGeneralInfo;
