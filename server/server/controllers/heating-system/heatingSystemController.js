// const HeatingSystemData = require('../../models/heating-system/heatingSystemModel');

// exports.addHeatingSystemData = async (req, res) => {
//     try {
//         const heatingSystemDetails = new HeatingSystemData(req.body);

//         await heatingSystemDetails.save();
//         res.status(201).send({ message: 'Heating system data added successfully' });
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// };


const HeatingSystemData = require('../../models/heating-system/heatingSystemModel');
const Inspection = require('../../models/main/mainModel');

exports.addHeatingSystemDataToInspection = async (req, res) => {
  try {
    const heatingSystem = new HeatingSystemData(req.body);

    const savedHeatingSystemDetails = await heatingSystem.save();

    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.heatingSystemInfo = savedHeatingSystemDetails._id;
    await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getHeatingSystemDataAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    const heatingSystemDetails = await HeatingSystemData.findById(inspection.heatingSystemInfo);
    if (!heatingSystemDetails) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      message: 200,
      inspection,
      heatingSystemDetails
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};



// addHeatingSystemDataToInspection
// getHeatingSystemDataAndInspection

