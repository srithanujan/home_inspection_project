const generatestaticHomeSetup = (doc, pageNumber) => {
  const drawFooter = require("./footer");

  // Title for Home Set-up and Maintenance section
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(20)
    .text("HOME SET-UP AND MAINTENANCE", { paragraphGap: 20 });

  // Home Set-up content
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(18)
    .text("Home Set-up", { paragraphGap: 10 });
  doc
    .font("Helvetica")
    .fontSize(12)
    .text(
      "When moving into a resale home, there are some things that you will want to take care of. This list focuses on things related to the house, rather than all of the administrative issues. The Home Set-up section deals with things that are done just once. The Home Maintenance Program deals with regular activities.",
      { paragraphGap: 12 }
    );

  // List of items with bold labels and descriptions on the same line
  const items = [
    {
      label: "Smoke and Carbon monoxide detectors",
      description:
        "Install or replace as needed. (Must have one on every floor level near sleeping area.). The detectors should be replaced every 10 years, and it is difficult to know how old the existing smoke detectors are. We recommend replacing them all.",
    },
    {
      label: "Locks",
      description:
        "Change the locks on all the doors. Deadbolts improve security",
    },
    {
      label: "Heating and air-conditioning systems",
      description:
        "Have these inspected and serviced. We recommend setting up a service contract to ensure the equipment is properly maintained. It makes sense to protect your investment in these expensive systems. ",
    },
    {
      label: "Main shut offs",
      description:
        "Find and mark the main shutoff for the heating, electrical and plumbing systems.You need to be able to shut things off fast in the event of an emergency.",
    },
    {
      label: "Electrical circuits",
      description:
        "Label the circuits in the electrical panel, so you can shut off the right fuse or breaker quickly.",
    },
    {
      label: "Wood burning appliances",
      description: "Have the chimney inspected and swept as needed.",
    },
    {
      label: "Outdoor air-conditioning unit",
      description:
        "Make sure there is at least 3 feet clear around the air conditioner. Cut back trees and shrubs as needed.",
    },
    {
      label: "Clothes dryers",
      description:
        "Use smooth walled (not corrugated) metal exhaust ducts to vent clothes dryers outdoors. Keep the runs as short and straight as possible. ",
    },
    {
      label: "Fire extinguishers",
      description:
        "Provide at least one on every floor. The fire extinguisher near the kitchen should be suitable for grease fires.",
    },
    {
      label: "Fire escape routes",
      description:
        "Plan fire escape routes from the upper stories. Obtain rope ladders if necessary.",
    },
    {
      label: "Safety improvements",
      description:
        "If your home inspector has recommended any safety improvements, these should be taken care of immediately. This often includes electrical issues and trip or fall hazards.",
    },
  ];

  // Iterate through each item to format the text
  items.forEach((item) => {
    doc
      .font("Helvetica-Bold") // Bold for the label
      .text(item.label, { continued: true });

    doc
      .font("Helvetica") // Regular for the description
      .text(" – " + item.description, { paragraphGap: 12 });
  });

  drawFooter(doc, pageNumber);
  pageNumber++;
  // Add a new page after the general information section
  doc.addPage();

  // Home Maintenance content
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(18)
    .text("Home Maintenance", { paragraphGap: 10 });

  doc.font("Helvetica").fontSize(12).text(
    "Good maintenance protects your investment, enhances comfort, extends life expectancies and reduces your costs. It makes great sense. Some homeowners do the maintenance themselves, and others get help with it.",

    { width: 500, align: "left", paragraphGap: 12 }
  );

  // Monthly maintenance items
  doc.font("Helvetica-Bold").fontSize(14).text("Monthly", { paragraphGap: 10 });

  const monthlyItems = [
    {
      label: "Smoke detectors",
      description: "Test to make sure they work in the event of a fire.",
    },
    {
      label: "Carbon monoxide detectors",
      description:
        "Test to make sure they work in the event of CO in the house.",
    },
    {
      label: "Ground fault circuit interrupters",
      description:
        "Test to make sure they work if there is an electrical problem.",
    },
    {
      label: "Filters/air cleaners on heating and air-conditioning system",
      description:
        "Clean or Replace to reduce heating costs, improve comfort and protect the equipment.",
    },
    {
      label: "Automatic reverse mechanism on garage door openers",
      description:
        "Test to make sure no one will be injured by the door as it closes.",
    },
    {
      label: "Range hood filters",
      description:
        "Clean to maintain efficiency, reduce energy costs and minimize the risk of grease fires.",
    },
    {
      label: "Central vacuum system",
      description:
        "Empty canister and clean filter (if applicable) so system will work effectively (in some homes, this has to be done more frequently than monthly).",
    },
  ];

  monthlyItems.forEach((item) => {
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(item.label, { continued: true });
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(" – " + item.description);
  });
  doc.moveDown(1);
  // Quarterly maintenance items
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Quarterly", { paragraphGap: 10 });

  const quarterlyItems = [
    {
      label: "Sliding doors and windows",
      description:
        "Clean tracks and make sure drain holes are open to reduce the risk of water damage in the home.",
    },
    {
      label: "Floor drains",
      description:
        "Check that there is water in traps to prevent sewer odors getting into the home.",
    },
    {
      label: "Heat recovery ventilator",
      description:
        "Clean or replace the filter (every two months is ideal) to ensure proper and cost-effective operation.",
    },
    {
      label: "Bathroom exhaust fan",
      description: "Clean grill to ensure good air flow.",
    },
  ];

  quarterlyItems.forEach((item) => {
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(item.label, { continued: true });
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(" – " + item.description);
  });
  doc.moveDown(1);
  // Spring maintenance items
  doc.font("Helvetica-Bold").fontSize(14).text("Spring", { paragraphGap: 10 });

  const springItems = [
    {
      label: "Gutters",
      description:
        "Clean to extend the life of the gutters and keep the basement/crawlspace dry.",
    },
    {
      label: "Air-conditioning system",
      description:
        "Have it serviced before turning it on – to protect the equipment.",
    },
    {
      label: "Humidifier attached to furnace",
      description:
        "Turn off and shut off the water so we don’t get more humidity than we want in the summer.",
    },
    {
      label: "Well water",
      description:
        "Have tested by laboratory to ensure the water is safe to drink (More frequent testing may be appropriate).",
    },
    {
      label: "Sump pump",
      description:
        "Test to make sure it will operate when needed, to avoid flooding.",
    },
    {
      label: "Chimneys for fireplaces and other wood-burning appliances",
      description:
        "Have inspected and swept as necessary – to reduce the risk of a chimney fire.",
    },
  ];

  springItems.forEach((item) => {
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(item.label, { continued: true });
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(" – " + item.description);
  });

  drawFooter(doc, pageNumber);
  pageNumber++;
  // Add a new page after the general information section
  doc.addPage();

  doc
    .font("Helvetica-BoldOblique")
    .fontSize(18)
    .text("Home Maintenance", { paragraphGap: 10 });

  // Fall maintenance items
  doc.font("Helvetica-Bold").fontSize(14).text("Fall", { paragraphGap: 10 });

  const fallItems = [
    {
      label: "Gutters",
      description:
        "Clean to extend the life of the gutters and keep the basement/crawlspace dry.",
    },
    {
      label: "Heating system",
      description: "Service before turning on to protect the equipment.",
    },
    {
      label: "Gas fireplace",
      description:
        "Service with other gas appliances; include fireplace in service plan.",
    },
    {
      label: "Outdoor hose bibs",
      description:
        "Shut off unless they are frost free to prevent freezing damage to pipes.",
    },
    {
      label: "Hot water heating systems",
      description:
        "Bleed radiators to remove air so the radiators will keep the house warm. Lubricate the circulating pump as needed to extend its life.",
    },
    {
      label: "Humidifier connected to furnace",
      description:
        "Turn on and open the water supply so that the humidifier will work in the heating season.",
    },
    {
      label: "Electric baseboard heaters",
      description:
        "Vacuum to remove dust to increase the efficiency and reduce the risk of fire.",
    },
    {
      label: "Well water",
      description:
        "Have tested by laboratory to ensure the water is safe to drink (More frequent testing may be appropriate).",
    },
    {
      label: "Sump pump",
      description:
        "Test to make sure it will operate when needed, to avoid flooding.",
    },
    {
      label: "Catch basins",
      description:
        "Test and clean out debris if needed – to make sure they will carry water away.",
    },
    {
      label: "Exterior vents",
      description:
        "Ensure vent flaps close properly to reduce heat loss and prevent pest entry.",
    },
  ];

  fallItems.forEach((item) => {
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(item.label, { continued: true });
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(" – " + item.description);
  });
  doc.moveDown(1);

  // Annually maintenance items
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Annually", { paragraphGap: 10 });

  const annuallyItems = [
    {
      label: "Trees and shrubs",
      description:
        "Trim back at least 3 feet from air-conditioning to allow the air-conditioning to work properly. Trim back from walls and roofs to prevent damage caused by branches rubbing against the building and to reduce the risk of pests getting into the home.",
    },
    {
      label: "Vines",
      description: "Trim away from wood building components.",
    },
    {
      label: "Roofing",
      description:
        "Perform annual inspection and tune-up. This helps maximize the life of roofs. (Must be performed by professional roofer).",
    },
    {
      label: "Bathtub and shower enclosures",
      description:
        "Check caulking and grout to prevent concealed water damage.",
    },
    {
      label: "Attic",
      description:
        "Check for evidence of pests and roof leaks to prevent infestations and water damage.",
    },
    {
      label: "Building exterior",
      description:
        "Inspect for weather tightness at siding, trim, doors, windows, wall penetrations, etc. to prevent concealed water damage.",
    },
    {
      label: "Exterior paint and stain",
      description:
        "Check and improve as needed to prevent rot in exterior wood. Pay particular attention to wood close to the ground. Wood in contact with soil is prone to rot.",
    },
    {
      label: "Exterior grade",
      description:
        "Check that it slopes down away from the building to drain water away from, rather than toward, the foundation. This helps prevent wet basement and crawlspace problems.",
    },
    {
      label: "Garage door operator",
      description:
        "Lubricate to ensure the operator works freely and minimize the load on the electric motor.",
    },
  ];

  annuallyItems.forEach((item) => {
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(item.label, { continued: true });
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(" – " + item.description);
  });
  doc.moveDown(1);

  // Semi-Annually maintenance items
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Semi-Annually", { paragraphGap: 10 });

  const semiAnnuallyItems = [
    {
      label: "Exterior air intakes",
      description:
        "Clean to ensure that it is clear from debris that can block air from entering any mechanical equipment.",
    },
  ];

  semiAnnuallyItems.forEach((item) => {
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(item.label, { continued: true });
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(" – " + item.description);
  });
  doc.moveDown(1);
  drawFooter(doc, pageNumber);
  pageNumber++;
  // Add a new page after the general information section
  doc.addPage();

  // Home Maintenance content
  doc
    .font("Helvetica-BoldOblique")
    .fontSize(18)
    .text("Home Maintenance", { paragraphGap: 10 });

  // Ongoing maintenance items
  doc.font("Helvetica-Bold").fontSize(14).text("Ongoing", { paragraphGap: 10 });

  const ongoingItems = [
    {
      label: "Septic systems",
      description:
        "Set up a program for regular maintenance and inspection with a local service provider. Tanks are typically pumped out every three years.",
    },
  ];

  ongoingItems.forEach((item) => {
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(item.label, { continued: true });
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(" – " + item.description);
  });

  drawFooter(doc, pageNumber);
  pageNumber++;
  // Add a new page after the general information section
  doc.addPage();
  return pageNumber;
};

module.exports = generatestaticHomeSetup;
