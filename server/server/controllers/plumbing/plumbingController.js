// const PlumbingData = require('../../models/plumbing/plumbingModel');

// exports.addPlumbingData = async (req, res) => {
//     try {
//         const plumbingDetails = new PlumbingData({
//             regular: req.body.regular,
//             waterHeater: req.body.waterHeater
//         });

//         await plumbingDetails.save();
//         res.status(201).send({ message: 'Plumbing data added successfully' });
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// };


const PlumbingData = require('../../models/plumbing/plumbingModel');
const Inspection = require('../../models/main/mainModel');

exports.addPlumbingDataToInspection = async (req, res) => {
  try {
    const plumbing = new PlumbingData({
      regular: req.body.regular,
      waterHeater: req.body.waterHeater
    });

    const savedPlumbingDetails = await plumbing.save();

    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.plumbingInfo = savedPlumbingDetails._id;
    await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getPlumbingDataAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    const plumbingDetails = await PlumbingData.findById(inspection.plumbingInfo);
    if (!plumbingDetails) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      message: 200,
      inspection,
      plumbingDetails
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};


