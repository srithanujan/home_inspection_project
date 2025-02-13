const generateStaticLastPageInfo = (doc, pageNumber) => {
  const drawFooter = require("./footer");
  // Fireplace inspection section
  doc.font("Helvetica-Bold").fontSize(14).text("Fireplace Inspection");

  doc
    .fontSize(12)
    .font("Helvetica-BoldOblique")
    .text(
      "Recommend to keep Checking glass door for cracks. \n" +
        "Be sure spark screen (metal screen) moves smoothly on its track. \n" +
        "Look for creosote buildup (tar-like natural byproduct of burning wood). \n" +
        "Check the integrity of the chimney structure. \n" +
        "Look for missing bricks and cracks in the chimney. \n" +
        "Be sure chimney cap is present and clear of debris. \n"
    );
  doc.moveDown(2);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(
      "Ideal temperature of hot water tank: 49°C (140°F) to discourage bacteria growth without causing skin damage. \n\n"
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("****************************************************** ", {
      paragraphGap: 10,
    });

  // Exterior wall issues section
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("EXTERIOR WALL ISSUES ", { paragraphGap: 10 });

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(
      "Motor deterioration. \n\n\n" +
        "Efflorescence – crystal deposit of salts that can form when water is present in/on brick, concrete, stone, stucco, or other building surfaces. \n" +
        "Look for white or greyish tint salt deposits left after water evaporates. \n" +
        "Check for spalling concrete wall and brick deterioration. \n\n"
    );
  doc.moveDown(2);
  // Insulation section
  doc.font("Helvetica-Bold").fontSize(14).text("INSULATION");

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("****************************************************** ", {
      paragraphGap: 10,
    });
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(
      "R-Value for insulation: \n\n\n" +
        "Current code R-50       (20 – 23 inches). \n" +
        "2010s     R-40     (16 – 18 inches). \n" +
        "1970s     R-20     (8 – 9 inches). \n\n\n" +
        "Fiberglass loose    R-value    R2.5 – R3.5. \n" +
        "Cellulose loose    R-value    R3.5 – R3.8. \n" +
        "Mineral wool    R-value    R3.0 – R3.3. \n\n"
    );

  // Plumbing pipes section
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Plumbing Pipes", { paragraphGap: 10 });

  doc
    .fontSize(12)
    .font("Helvetica")
    .text(
      "Poly B piping (grey or black pipes) was commonly used between 1978 – 1995. Marked as PB2. \n\n"
    );

  drawFooter(doc, pageNumber);
  pageNumber++;

  // Add a new page after the plumbing pipes section

  return pageNumber;
};

module.exports = generateStaticLastPageInfo;
