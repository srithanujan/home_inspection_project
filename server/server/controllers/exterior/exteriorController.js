// const ExteriorDetails = require('../../models/exterior/exteriorModel');

// exports.addExteriorDetails = async (req, res) => {
//     try {
//         const exteriorDetails = new ExteriorDetails(req.body);

//         await exteriorDetails.save();
//         res.status(201).send({ message: 'Exterior details added successfully' });
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// };


const ExteriorDetails = require('../../models/exterior/exteriorModel');
const Inspection = require('../../models/main/mainModel');

exports.addExteriorDetailsToInspection = async (req, res) => {
  try {
    const exterior = new ExteriorDetails({
      exteriorWall: req.body.exteriorWall,
      foundation: req.body.foundation,
      exteriorExteriorDoor: req.body.exteriorExteriorDoor,
      exteriorSideDoor: req.body.exteriorSideDoor,
      exteriorPatioDoor: req.body.exteriorPatioDoor,
      exteriorPatioScreenDoor: req.body.exteriorPatioScreenDoor,
      exteriorDoorComments: req.body.exteriorDoorComments,
      gutter: req.body.gutter,
      window: req.body.window,
      gasMeter: req.body.gasMeter,
      electricity: req.body.electricity,
      exteriorHouseBibs: req.body.exteriorHouseBibs,
      airCondition: req.body.airCondition
    });

    const savedExteriorDetails = await exterior.save();

    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.exteriorInfo = savedExteriorDetails._id;
    await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getExteriorDetailsAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    const exteriorDetails = await ExteriorDetails.findById(inspection.exteriorInfo);
    if (!exteriorDetails) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      message: 200,
      inspection,
      exteriorDetails
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};


