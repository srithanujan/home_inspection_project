const { fetchImageFromDB, fetchImage } = require("../utils/imageUtils");
const drawFooter = require("./footer");

const generateBuildingInfo = async (
  doc,
  buildingInfo,
  pageNumber,
  inspectionId
) => {
  const defaultX = 50; 

  // Helper function to format fields
  const formatField = (field, otherField) => {
    const filteredValues = (field || []).filter(
      (value) => value && value !== "Other"
    );
    if (otherField) {
      filteredValues.push(otherField);
    }
    return filteredValues.join(", ") || "N/A"; // Prevent empty output
  };

  // Helper function to render fields properly
  const renderField = (label, value) => {
    if (value && value !== "N/A") {
      doc.font("Helvetica-Bold").text(`${label}: `, { continued: true });
      doc.font("Helvetica").text(value);
      doc.moveDown(0.5);
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

        if (
          doc.y + imageHeight + padding >
          doc.page.height - doc.page.margins.bottom
        ) {
          doc.addPage();
        }

        doc.image(imageBuffer, centerX, doc.y, {
          width: imageWidth,
          height: imageHeight,
        });
        doc.y += imageHeight + padding;
      }
    }
  };

  // Building Section Title
  doc.fontSize(20).font("Helvetica-Bold").text("BUILDING DATA", defaultX);
  doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.1);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1);

  doc.fontSize(12);

  // Render fields using the helper functions
  renderField("Estimated Age", buildingInfo.estimatedAge);
  renderField(
    "Building Type",
    formatField(buildingInfo.buildingType, buildingInfo.otherBuildingType)
  );
  renderField(
    "State of Occupancy",
    formatField(buildingInfo.occupancyState, buildingInfo.otherOccupancyState)
  );
  renderField(
    "Garage",
    formatField(buildingInfo.garage, buildingInfo.otherGarage)
  );
  renderField(
    "Exterior",
    formatField(buildingInfo.exterior, buildingInfo.otherExterior)
  );
  renderField(
    "Electricity ON",
    formatField(buildingInfo.electricityOn, buildingInfo.otherElectricityOn)
  );
  renderField(
    "Gas/Oil ON",
    formatField(buildingInfo.gasOilOn, buildingInfo.otherGasOilOn)
  );
  renderField(
    "Water ON",
    formatField(buildingInfo.waterOn, buildingInfo.otherWaterOn)
  );
  renderField(
    "Weather Condition",
    formatField(
      buildingInfo.weatherCondition,
      buildingInfo.otherWeatherCondition
    )
  );
  renderField(
    "Recent Rain",
    (buildingInfo.recentRain || []).join(", ") || "N/A"
  );
  renderField(
    "Soil Condition",
    formatField(buildingInfo.soilCondition, buildingInfo.otherSoilCondition)
  );

  // Outdoor Temperature
  if (buildingInfo.outdoorTemperature) {
    renderField("Outdoor Temperature", `${buildingInfo.outdoorTemperature} °C`);
  }

  // Inspection Date
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };
  renderField("Inspection Date", formatDate(buildingInfo.inspectionDate));

  // Start Time & End Time
  if (buildingInfo.startTime || buildingInfo.endTime) {
    doc.font("Helvetica-Bold").text("Start Time: ", { continued: true });
    doc
      .font("Helvetica")
      .text(buildingInfo.startTime || "N/A", { continued: true });

    doc.text("   "); // Add spacing between Start and End Time

    doc.font("Helvetica-Bold").text("End Time: ", { continued: true });
    doc.font("Helvetica").text(buildingInfo.endTime || "N/A");
    doc.moveDown(1);
  }
  await insertImage("building");

  // Add Footer
  drawFooter(doc, pageNumber);
  pageNumber++;
  doc.addPage();
  return pageNumber;
};

module.exports = generateBuildingInfo;
