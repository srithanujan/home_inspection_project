const generateStaticLetter = (doc, generalInfo, pageNumber) => {
  const drawFooter = require("./footer");

  doc.font("Helvetica").fontSize(12);

  // Dynamically generate the current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const customerName = generalInfo.clientInformation.contactName;
  const propertyAddress = generalInfo.clientInformation.clientAddress;

  // Dynamic content for the letter
  doc.text(currentDate, { paragraphGap: 20 });

  doc.text(`Dear ${customerName},`, { paragraphGap: 10 });

  doc.font("Helvetica").text(`RE: ${propertyAddress}`, { paragraphGap: 20 });

  doc.font("Helvetica").text(
    "Thank you very much for choosing us to perform your home inspection. The inspection itself and the attached report comply with the requirements of the Standards of Practice of our national Association. This document defines the scope of a home inspection.",

    { width: 500, align: "left", paragraphGap: 12 }
  );

  doc.text(
    "Clients sometimes assume that a home inspection will include many things that are beyond scope. We encourage you to read the Standards of Practice so that you clearly understand what things are included in the home inspection and report.",

    { width: 500, align: "left", paragraphGap: 12 }
  );

  doc.text(
    "The report has been prepared for the exclusive use of our client. No use by third parties is intended. We will not be responsible to any party for the contents of the report, other than the party named herein.",

    { width: 500, align: "left", paragraphGap: 12 }
  );

  doc.text(
    "The report is effectively a snapshot of the house, recording the conditions on a given date and time. Home inspectors cannot predict future behavior, and as such, we cannot be responsible for things that occur after the inspection. If conditions change, we are available to revisit the property and update our report.",

    { width: 500, align: "left", paragraphGap: 12 }
  );

  doc.text(
    "The report itself is copyrighted and may not be used in whole or in part without our express written permission.",

    { width: 500, align: "left", paragraphGap: 12 }
  );

  doc.text(
    "Again, thanks very much for choosing us to perform your home inspection.",

    { width: 500, align: "left", paragraphGap: 20 }
  );

  doc.text("Sincerely,", { paragraphGap: 12 });

  doc
    .font("Helvetica")
    .text("Chanda (Chan) Gopal", { paragraphGap: 3 })
    .font("Helvetica")
    .text("on behalf of", { paragraphGap: 3 })
    .text("Eye-Tech Home Inspections Inc.", {
      paragraphGap: 5,
    })
    .text("Tel. 316-953-3677", { paragraphGap: 4 })
    .text("Email. eyetechinsp@gmail.com", {
      paragraphGap: 20,
    });

  drawFooter(doc, pageNumber);
  pageNumber++;
  // Add a new page after the general information section
  doc.addPage();
  return pageNumber;
};

module.exports = generateStaticLetter;
