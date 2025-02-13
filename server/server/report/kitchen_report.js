const drawFooter = require("./footer");
const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");

const generateKitchenInfo = async (
  doc,
  kitchenInfo,
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

  //insert image
  const insertImage = async (baseNames, index) => {
    for (const baseName of baseNames) {
      const imageName = `${baseName}${index}`;
      const imageUrl = await fetchImageFromDB(inspectionId, imageName);
      if (!imageUrl) {
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

  // Kitchen Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("KITCHEN AREA");
  doc.lineWidth(0.5);
  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);
  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  // Reset font size for normal text
  doc.fontSize(12);

  // Introductory Paragraph
  doc
    .font("Helvetica-BoldOblique")
    .text(
      "Kitchen appliances are checked for power where possible. Appliances are NOT run through full cycles and functionality as part of a home inspection.",
      indentOptions
    );
  doc.moveDown(1);

  let kitchenIndex = 0; // Track index for unique images

  for (const kitchen of kitchenInfo.kitchens) {

    renderField("Name", kitchen.name, { indent: 20 });
    doc.moveDown(1);

    // Countertops Section
    renderField(
      "Countertops Condition",
      formatField(
        kitchen.kitchenCountertops.kitchenCountertopsCondition,
        kitchen.kitchenCountertops.otherKitchenCountertopsCondition
      ),
      indentOptions
    );
    renderField(
      "Comments",
      formatField(
        kitchen.kitchenCountertops.countertopsComments,
        kitchen.kitchenCountertops.otherCountertopsComments
      ),
      indentOptions
    );
    checkSpace(50);
    if (await insertImage(["kitchenCountertopsImage"], kitchenIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Cabinets Section
    renderField(
      "Cabinets Condition",
      formatField(
        kitchen.kitchenCabinets.kitchenCabinetsCondition,
        kitchen.kitchenCabinets.otherKitchenCabinetsCondition
      ),
      indentOptions
    );
    renderField(
      "Comments",
      formatField(
        kitchen.kitchenCabinets.kitchenCabinetsComments,
        kitchen.kitchenCabinets.otherKitchenCabinetsComments
      ),
      indentOptions
    );
    doc.moveDown(1);

    checkSpace(50);
    if (await insertImage(["kitchenCabinetsImage"], kitchenIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    checkSpace(50);
    // Plumbing Section
    renderField(
      "Plumbing Condition",
      formatField(
        kitchen.kitchenPlumbings.kitchenPlumbingsCondition,
        kitchen.kitchenPlumbings.otherKitchenPlumbingsCondition
      ),
      indentOptions
    );
    renderField(
      "Faucet",
      formatField(
        kitchen.kitchenPlumbings.kitchenPlumbingsFaucet,
        kitchen.kitchenPlumbings.otherKitchenPlumbingsFaucet
      ),
      indentOptions
    );
    renderField(
      "Functional Drainage",
      formatField(
        kitchen.kitchenPlumbings.kitchenPlumbingsFunctionalDrainage,
        kitchen.kitchenPlumbings.otherKitchenPlumbingsFunctionalDrainage
      ),
      indentOptions
    );
     doc.moveDown(1);
     checkSpace(50);
     if (await insertImage(["kitchenPlumbingImage"], kitchenIndex)) {
       doc.moveDown(1);
       doc.moveDown(1);
     }
    
    // Floor Section
    checkSpace(50);
    renderField(
      "Floor",
      formatField(
        kitchen.kitchenFloors.kitchenFloorMaterial,
        kitchen.kitchenFloors.otherKitchenFloorMaterial
      ),
      indentOptions
    );
    renderField(
      "Condition",
      formatField(
        kitchen.kitchenFloors.kitchenFloorCondition,
        kitchen.kitchenFloors.otherKitchenFloorCondition
      ),
      indentOptions
    );
    renderField(
      "Comments",
      formatField(
        kitchen.kitchenFloors.kitchenFloorComments,
        kitchen.kitchenFloors.otherKitchenFloorComments
      ),
      indentOptions
    );
     doc.moveDown(1);
     checkSpace(50);
     if (await insertImage(["kitchenFloorImage"], kitchenIndex)) {
       doc.moveDown(1);
       doc.moveDown(1);
     }

    checkSpace(50);
    // Walls Section
    renderField(
      "Walls",
      formatField(
        kitchen.kitchenWalls.kitchenWallsCondition,
        kitchen.kitchenWalls.otherKitchenWallsCondition
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["kitchenWallImage"], kitchenIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    checkSpace(50);
    // Ceilings Section
    renderField(
      "Ceilings",
      formatField(
        kitchen.kitchenCeilings.kitchenCeilingsCondition,
        kitchen.kitchenCeilings.otherKitchenCeilingsCondition
      ),
      indentOptions
    );

    doc.moveDown(1);
      checkSpace(50);
      if (await insertImage(["kitchenCeilingsImage"], kitchenIndex)) {
        doc.moveDown(1);
        doc.moveDown(1);
      }

    // Electricals Section
    checkSpace(50);
    renderField(
      "Electrical outlets and lights",
      formatField(
        kitchen.kitchenElectricals.kitchenElectricalsCondition,
        kitchen.kitchenElectricals.otherKitchenElectricalsCondition
      ),
      indentOptions
    );
    doc.moveDown(1);

     checkSpace(50);
     if (
       await insertImage(
         ["kitchenElectricalOutletsAndLightsImage"],
         kitchenIndex
       )
     ) {
       doc.moveDown(1);
       doc.moveDown(1);
     }

    // Appliances Section
    checkSpace(50);
    renderField(
      "Appliances Range",
      formatField(
        kitchen.kitchenAppliances.kitchenAppliancesRange,
        kitchen.kitchenAppliances.otherKitchenAppliancesRange
      ),
      indentOptions
    );
    renderField(
      "Condition",
      formatField(
        kitchen.kitchenAppliances.kitchenAppliancesRangeCondition,
        kitchen.kitchenAppliances.otherKitchenAppliancesCondition
      ),
      indentOptions
    );
    doc.moveDown(1);

      checkSpace(50);
      if (await insertImage(["kitchenAppliancesImage"], kitchenIndex)) {
        doc.moveDown(1);
        doc.moveDown(1);
      }

    // Dishwasher Section
    checkSpace(50);
    renderField(
      "Dishwasher",
      formatField(
        kitchen.kitchenDishwashers.kitchenDishwasher,
        kitchen.kitchenDishwashers.otherKitchenDishwasher
      ),
      indentOptions
    );
    renderField(
      "Condition",
      formatField(
        kitchen.kitchenDishwashers.kitchenDishwashersCondition,
        kitchen.kitchenDishwashers.otherKitchenDishwashersCondition
      ),
      indentOptions
    );
    doc.moveDown(1);

    checkSpace(50);
    if (await insertImage(["kitchenDishwasherImage"], kitchenIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Range Hood Fan Section
    checkSpace(50);
    renderField(
      "Range Hood Fan",
      formatField(
        kitchen.kitchenRangeHoodFans.kitchenRangeHoodFan,
        kitchen.kitchenRangeHoodFans.otherKitchenRangeHoodFan
      ),
      indentOptions
    );
     doc.moveDown(1);

     checkSpace(50);
     if (await insertImage(["kitchenRangehoodFanImage"], kitchenIndex)) {
       doc.moveDown(1);
       doc.moveDown(1);
     }

    doc.font("Helvetica-BoldOblique").text("Recommendation:", indentOptions);

    doc
      .font("Helvetica-BoldOblique")
      .text(
        "Always keep the range hood filter clean to maintain efficiency, reduce energy costs and minimize the risk of grease fire.",
        indentOptions
      );
    doc.moveDown(1);

    // Refrigerator Section
    checkSpace(50);
    renderField(
      "Refrigerator",
      formatField(
        kitchen.kitchenRefrigerators.kitchenRefrigerator,
        kitchen.kitchenRefrigerators.otherKitchenRefrigerator
      ),
      indentOptions
    );
    renderField(
      "Condition",
      formatField(
        kitchen.kitchenRefrigerators.kitchenRefrigeratorCondition,
        kitchen.kitchenRefrigerators.otherKitchenRefrigeratorCondition
      ),
      indentOptions
    );
    checkSpace(50);
    if (await insertImage(["kitchenRefrigeratorsImage"], kitchenIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Microwave Section
    checkSpace(50);
    renderField(
      "Microwave",
      formatField(
        kitchen.kitchenMicrowaves.kitchenMicrowave,
        kitchen.kitchenMicrowaves.otherKitchenMicrowave
      ),
      indentOptions
    );
    doc.moveDown(1);

    checkSpace(50);
    if (await insertImage(["kitchenMicrowaveImage"], kitchenIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Open Ground / Reverse Polarity Section
    checkSpace(50);
    renderField(
      "Open Ground / Reverse Polarity",
      kitchen.kitchenOpenGroundReversePolarity.join(", "),
      indentOptions
    );
    doc.moveDown(1);

    checkSpace(50);
    if (await insertImage(["kitchenOpenGroundImage"], kitchenIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }
    kitchenIndex++; // Increment index for the next kitchen
  }

  drawFooter(doc, currentPage);
  currentPage++;
  doc.addPage();

  return currentPage;
};

module.exports = generateKitchenInfo;
