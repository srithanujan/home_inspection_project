const drawFooter = require("./footer");
const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");

const generateRoomInfo = async (doc, roomInfo, pageNumber, inspectionId) => {
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

  // Room Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("ROOM");
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

  let roomIndex = 0; // Track index for unique images

  // Iterate through all rooms
  for (const room of roomInfo.rooms) {
    // Room Title
    // doc.font("Helvetica-Bold").fontSize(12).text("BEDROOM");
    // doc.moveDown(0.5);

    // Room Name
    renderField("Name", room.name, { indent: 20 });
    doc.moveDown(1);

    // Bedroom Walls Section
    checkSpace(50);
    renderField(
      "Walls",
      formatField(
        room.bedroomwall.bedroomsWalls,
        room.bedroomwall.otherBedroomsWalls
      ),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        room.bedroomwall.bedroomsWallsCondition,
        room.bedroomwall.otherBedroomsWallsCondition
      ),
      indentOptions
    );
    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["roomsWallsImage"], roomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Ceiling Section
    checkSpace(50);
    renderField(
      "Ceiling",
      formatField(
        room.ceiling.bedroomsCeilings,
        room.ceiling.otherBedroomsCeilings
      ),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        room.ceiling.bedroomsCeilingsCondition,
        room.ceiling.otherBedroomsCeilingsCondition
      ),
      indentOptions
    );
    
    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["roomsCeilingImage"], roomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Floor Section
    checkSpace(50);
    renderField(
      "Floor",
      formatField(room.floor.bedroomsFloors, room.floor.otherBedroomsFloors),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        room.floor.bedroomsFloorsCondition,
        room.floor.otherBedroomsFloorsCondition
      ),
      indentOptions
    );

     doc.moveDown(1);
     checkSpace(50);
     if (await insertImage(["roomsFloorsImage"], roomIndex)) {
       doc.moveDown(1);
       doc.moveDown(1);
     }

    // Closet Section
    checkSpace(50);
    renderField(
      "Closet",
      formatField(
        room.closet.bedroomsClosets,
        room.closet.otherBedroomsClosets
      ),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        room.closet.bedroomsClosetsCondition,
        room.closet.otherBedroomsClosetsCondition
      ),
      indentOptions
    );

    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["roomsClosetImage"], roomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Door Section
    checkSpace(50);
    renderField(
      "Door",
      formatField(room.door.bedroomsDoors, room.door.otherBedroomsDoors),
      indentOptions
    );

    renderField(
      "Condition",
      formatField(
        room.door.bedroomsDoorsCondition,
        room.door.otherBedroomsDoorsCondition
      ),
      indentOptions
    );
    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["roomsDoorImage"], roomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Window Section
    checkSpace(50);
    renderField(
      "Windows",
      formatField(
        room.window.bedroomsWindows,
        room.window.otherBedroomsWindows
      ),
      indentOptions
    );
    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["roomsWindowsImage"], roomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Electrical Section
    checkSpace(50);
    renderField(
      "Electrical",
      formatField(
        room.electrical.bedroomsElectricals,
        room.electrical.otherBedroomsElectricals
      ),
      indentOptions
    );
    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["roomsElectricalImage"], roomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }
    
    // Heat Source Section
    checkSpace(50);
    renderField(
      "Heat Source",
      formatField(
        room.heatSource.bedroomsHeatSource,
        room.heatSource.otherBedroomsHeatSource
      ),
      indentOptions
    );
    doc.moveDown(1);
    checkSpace(50);
    if (await insertImage(["roomsHeatSourceImage"], roomIndex)) {
      doc.moveDown(1);
      doc.moveDown(1);
    }

    // Moisture Stains Section
    checkSpace(50);
    renderField(
      "Moisture Stains",
      formatField(
        room.moistureStains.bedroomsMoistureStains,
        room.moistureStains.otherBedroomsMoistureStains
      ),
      indentOptions
    );
    doc.moveDown(1);

    // Comments Section
    checkSpace(50);
    if (room.bedroomsComments) {
      renderField("Comments", room.bedroomsComments, indentOptions);
    }
    roomIndex++; // Increment index for the next room
  }

  drawFooter(doc, currentPage);
  currentPage++;
  doc.addPage();

  return currentPage;
};

module.exports = generateRoomInfo;
