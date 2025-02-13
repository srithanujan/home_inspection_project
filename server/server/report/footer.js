// footer.js
const drawFooter = (doc, pageNumber) => {
  const footerY = doc.page.height - 80; // Footer Y position, 80 units from the bottom of the page
  const lineStartXF = 50;
  const lineEndXF = 550;

  doc.strokeColor(101 / 255, 67 / 255, 33 / 255); // Dark brown color
  doc.lineWidth(2); // Adjust this value to make the top line thicker

  // First line of footer
  doc.moveTo(lineStartXF, footerY).lineTo(lineEndXF, footerY).stroke();

  // Second line of footer (just below the first line)
  doc.lineWidth(1); // Adjust this value to make the second line thinner
  doc
    .moveTo(lineStartXF, footerY + 2)
    .lineTo(lineEndXF, footerY + 2)
    .stroke();

  // Add the page number to the left of the footer
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      `EYE TECH Home Inspections Inc.                                                                            Page ${pageNumber}`,
      50,
      footerY + 10
    );
};

module.exports = drawFooter;
