const path = require("path");

function formatDate(date) {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Determine the suffix for the day
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month}, ${year}`;
}

function generateCoverPage(doc,logoPath) {
  // Logo image
  doc.image(logoPath, 40, 20, { fit: [170, 170] });

  doc.font("Helvetica-BoldOblique").fontSize(33).text("EYE-TECH", 220, 60);

  doc
    .font("Helvetica-BoldOblique")
    .fontSize(32)
    .text("Home Inspections Inc.", 220, 100, { align: "left" });

  doc
    .fontSize(35)
    .font("Helvetica-Bold")
    .text("HOME INSPECTION REPORT", 50, 250, { align: "center" });

  doc
    .font("Helvetica")
    .fontSize(18)
    .text("51 L’AMOREAUX DR, SCARBOROUGH, ONTARIO", 50, 700, {
      align: "center",
    })

  doc
    .font("Helvetica")
    .fontSize(18)
    .text(formatDate(new Date()), { align: "center" });


  doc.addPage();
}

module.exports = generateCoverPage;
