const generateBasementInfo = (doc, basementInfo, pageNumber) => {
  const drawFooter = require("./footer");
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

  // Basement Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("BASEMENT");
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
      "Basement conditions can vary based on weather, temperature, rain events and time of year. The home inspection is a snapshot in time and does not guarantee future conditions or performance."
    );

  doc.moveDown(0.5);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(
      "Inspection does not cover any damage concealed by rugs, carpeting, wall paneling, furniture or by current occupant’s belongings"
    );
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(12).text("HOMEOWNER TIP:");

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(
      "Keep floor drain grills uncovered at all times, to allow water leakages to drain quickly. Drain inspection and maintenance should be done every few years by a qualified and licensed plumber as part of normal pro-active home maintenance."
    );

  doc.moveDown(1);

  // Iterate through all basements
  basementInfo.basements.forEach((basement) => {
    renderField("Name", basement.name);
    checkSpace(100);
    renderField(
      "Ceiling",
      formatField(
        basement.basementLaundryCeiling,
        basement.otherotherBasementLaundryCeilingBasementWalls
      )
    );

    renderField(
      "Walls",
      formatField(basement.basementWalls, basement.otherBasementWalls)
    );

    renderField(
      "Vapor Barrier",
      formatField(basement.basementVaporBarrier, basement.otherBasementBarrier)
    );

    renderField(
      "Insulation",
      formatField(basement.basementInsulation, basement.otherBasementInsulation)
    );

    renderField(
      "Doors",
      formatField(basement.basementDoors, basement.otherBasementDoors)
    );

    renderField(
      "Windows",
      formatField(basement.basementWindows, basement.otherBasementWindows)
    );

    renderField(
      "Electrical",
      formatField(basement.basementElectrical, basement.otherBasementElectrical)
    );

    doc.moveDown(1);

    doc.font("Helvetica-Bold").fontSize(12).text("FLOOR:");

    if (basement.basementFloor) {
      renderField(
        "Floor Material",
        formatField(
          basement.basementFloor.basementFloorMaterial,
          basement.basementFloor.otherBasementFloorMaterial
        ),
        indentOptions
      );
      renderField(
        "Floor Condition",
        formatField(
          basement.basementFloor.basementFloorCondition,
          basement.basementFloor.otherBasementFloorCondition
        ),
        indentOptions
      );
      renderField(
        "Floor Covered",
        formatField(
          basement.basementFloor.basementFloorCovered,
          basement.basementFloor.otherBasementFloorCovered
        ),
        indentOptions
      );
      doc.moveDown(1);
    }

    // Stairs
    checkSpace(50);
    doc.font("Helvetica-Bold").fontSize(12).text("STAIRS:");

    if (basement.basementStairs) {
      renderField(
        "Stairs Condition",
        formatField(
          basement.basementStairs.basementStairsConditon,
          basement.basementStairs.otherBasementStairsCondition
        ),
        indentOptions
      );
      renderField(
        "Handrail",
        formatField(
          basement.basementStairs.basementStairsHandrail,
          basement.basementStairs.otherBasementStairsHandrail
        ),
        indentOptions
      );
      renderField(
        "Headway over stairs",
        formatField(
          basement.basementStairs.basementStairsHeadway,
          basement.basementStairs.otherBasementStairsHeadway
        ),
        indentOptions
      );
      doc.moveDown(1);
    }
  });

  drawFooter(doc, pageNumber);
  pageNumber++;
  doc.addPage();
  return pageNumber;
};

module.exports = generateBasementInfo;
