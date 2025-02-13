const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");
const drawFooter = require("./footer");

const generateHeatingSystemInfo = async (
  doc,
  heatingInfo,
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

  // Heating System Section Title
  doc.font("Helvetica-Bold").fontSize(20).text("HEATING SYSTEM");
  doc.lineWidth(0.5);
  const lineStartX = 50;
  const lineEndX = 550;

  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(0.1);
  doc.moveTo(lineStartX, doc.y).lineTo(lineEndX, doc.y).stroke();
  doc.moveDown(1);

  renderField(
    "Location",
    formatField(
      heatingInfo.heatingSystemFurnaceLocation,
      heatingInfo.otherHeatingSystemFurnaceLocation
    ),
    indentOptions
  );

  renderField(
    "Manufacturer",
    heatingInfo.heatingSystemManufacturer,
    indentOptions
  );
  renderField(
    "Approximate Age",
    heatingInfo.heatingSystemApproximateAge,
    indentOptions
  );

  const energySource = formatField(
    heatingInfo.heatingSystemEnergySource,
    heatingInfo.otherHeatingSystemEnergySource,
    indentOptions
  );
  renderField("Energy Source", energySource, indentOptions);

  const heatingType = formatField(
    heatingInfo.heatingSystemType,
    heatingInfo.otherHeatingSystemType
  );
  renderField("Type", heatingType, indentOptions);

  const areaServed = formatField(
    heatingInfo.heatingSystemAreaServed,
    heatingInfo.otherHeatingSystemAreaServed
  );
  renderField("Area Served", areaServed, indentOptions);

  const thermostats = formatField(
    heatingInfo.heatingSystemThermostats,
    heatingInfo.otherHeatingSystemThermostats
  );
  renderField("Thermostats", thermostats, indentOptions);

  const distribution = formatField(
    heatingInfo.heatingSystemDistribution,
    heatingInfo.otherHeatingSystemDistribution
  );
  renderField("Distribution", distribution, indentOptions);

  doc.moveDown(0.5);

  const fuelStorage = formatField(
    heatingInfo.heatingSystemInteriorFuelStorage,
    heatingInfo.otherHeatingSystemInteriorFuelStorage
  );
  renderField("Interior Fuel Storage", fuelStorage, indentOptions);

  const gasServiceLines = formatField(
    heatingInfo.heatingSystemGasServiceLines,
    heatingInfo.otherHeatingSystemGasServiceLines
  );
  renderField("Gas Service Lines", gasServiceLines, indentOptions);

  const blowerFan = formatField(
    heatingInfo.heatingSystemBlowerFan,
    heatingInfo.otherHeatingSystemBlowerFan
  );
  renderField("Blower Fan", blowerFan, indentOptions);

  const filter = formatField(
    heatingInfo.heatingSystemFilter,
    heatingInfo.otherHeatingSystemFilter
  );
  renderField("Filter", filter, indentOptions);

  const suspectedAsbestos = formatField(
    heatingInfo.heatingSystemSuspectedAsbestos,
    heatingInfo.otherHeatingSystemSuspectedAsbestos
  );

  doc.moveDown(1);
  checkSpace(50);
  if (await insertImage("heatingSystemFilterImage")) {
    doc.moveDown(1);
    doc.moveDown(1);
  }

  renderField("Suspected Asbestos", suspectedAsbestos, indentOptions);

  const operation = formatField(
    heatingInfo.heatingSystemOperation,
    heatingInfo.otherHeatingSystemOperation
  );
  renderField("Heating System Operation", operation, indentOptions);

  const condition = formatField(
    heatingInfo.heatingSystemCondition,
    heatingInfo.otherHeatingSystemCondition
  );

   doc.moveDown(1);
   checkSpace(50);
   if (await insertImage("heatingSystemOperationImage")) {
     doc.moveDown(1);
     doc.moveDown(1);
   }

  renderField("Condition", condition, indentOptions);

  if (heatingInfo.heatingSystemComments) {
    renderField("Comments", heatingInfo.heatingSystemComments, indentOptions);
  }

  doc.moveDown(1);

  // Hardcoded paragraph
  checkSpace(50);
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "Recommend duct cleaning. Duct cleaning can remove dust from your HVAC’s ductwork, resulting in cleaner air and improve efficiency and lifespan of your system."
    );

  doc.moveDown(0.5);
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "Filter needs to be changed every few months depends on the quality of filter. This will Improve system efficiency , lower energy bill and adequate air quality"
    );

  doc.moveDown(0.5);

  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "We recommend setting up a service contract with furnace maintenance company to ensure the equipment is properly serviced annually."
    );

  doc.moveDown(0.5);

  doc
    .font("Helvetica-BoldOblique")
    .fontSize(12)
    .text(
      "The design life of the unit 12 - 15 years (and up to 20 – 25years if well maintained) This can be verified by an HVAC specialist. At the very least the furnace unit should be serviced annually."
    );

  // Add Footer
   drawFooter(doc, currentPage);
   currentPage++;
   doc.addPage();

   return currentPage;
};

module.exports = generateHeatingSystemInfo;
