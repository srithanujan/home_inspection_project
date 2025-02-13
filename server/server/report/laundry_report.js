const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");
const drawFooter = require("./footer");

const generateLaundryInfo = async (
  doc,
  laundryInfo,
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

  // Laundry Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("LAUNDRY AREA");
  doc.lineWidth(0.5);
  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  doc.fontSize(12);

  // Iterate through all laundry areas
  laundryInfo.laundrys.forEach((laundry) => {
    // Laundry Name
    renderField("Name", laundry.name.join(", "), { indent: 20 });
    doc.moveDown(1);

    // Laundry Ceiling Section
    renderField(
      "Ceiling",
      formatField(laundry.laundryCeiling, laundry.otherLaundryCeiling),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Walls Section
    checkSpace(50);
    renderField(
      "Walls",
      formatField(laundry.laundryWalls, laundry.otherLaundryWalls),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Floor Section
    checkSpace(50);
    renderField(
      "Floor",
      formatField(laundry.laundryFloor, laundry.otherLaundryFloor),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Washer Section
    checkSpace(50);
    renderField(
      "Washer",
      formatField(laundry.laundryWasher, laundry.otherLaundryWasher),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Dryer Section
    checkSpace(50);
    renderField(
      "Dryer",
      formatField(laundry.laundryDryer, laundry.otherLaundryDryer),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Pipes Leak Section
    checkSpace(50);
    renderField(
      "Pipes Leak",
      formatField(laundry.laundryPipesLeak, laundry.otherLaundryPipesLeak),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Washer Drain Section
    checkSpace(50);
    renderField(
      "Washer Drain",
      formatField(laundry.laundryWasherDrain, laundry.otherLaundryWasherDrain),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Sink Section
    checkSpace(50);
    renderField(
      "Sink",
      formatField(laundry.laundrySink, laundry.otherLaundrySink),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Faucet Section
    checkSpace(50);
    renderField(
      "Faucet",
      formatField(laundry.laundryFaucet, laundry.otherLaundryFaucet),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Heat Source Section
    checkSpace(50);
    renderField(
      "Heat Source",
      formatField(laundry.laundryHeatSource, laundry.otherLaundryHeatSource),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Electrical Section
    checkSpace(50);
    renderField(
      "Electrical",
      formatField(laundry.laundryElectrical, laundry.otherLaundryElectrical),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Room Vented Section
    checkSpace(50);
    renderField(
      "Room Vented",
      formatField(laundry.laundryRoomVented, laundry.otherLaundryRoomVented),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Dryer Vent Section
    checkSpace(50);
    renderField(
      "Dryer Vent",
      formatField(laundry.laundryDryerVent, laundry.otherLaundryDryerVent),
      indentOptions
    );

    doc.moveDown(1);

    // Laundry Comments Section
    checkSpace(50);
    if (laundry.laundryComments) {
      renderField(
        "Comments",
        laundry.laundryComments.join(", "),
        indentOptions
      );
    }
  });

  checkSpace(50);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(
      "Always use smooth walled (not corrugated) metal exhaust ducts to vent clothes dryers outdoors. Keep the runs as short and straight as possible."
    );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage(["laundryImage"])) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  drawFooter(doc, currentPage);
  currentPage++;
  doc.addPage();

  return currentPage;
};

module.exports = generateLaundryInfo;
