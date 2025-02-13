// const BathroomData = require('../../models/bathroom/bathroomModel');

// exports.addBathroomData = async (req, res) => {
//     try {
//         const bathroomDetails = new BathroomData({
//             bathrooms: req.body.bathrooms
//         });

//         await bathroomDetails.save();
//         res.status(201).send({ message: 'Bathroom data added successfully' });
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// };



const BathroomData = require('../../models/bathroom/bathroomModel');
const Inspection = require('../../models/main/mainModel');

exports.addBathroomDataToInspection = async (req, res) => {
  try {
    const bathroom = new BathroomData({
      bathrooms: req.body.bathrooms
    });

    const savedBathroomDetails = await bathroom.save();

    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.bathroomInfo = savedBathroomDetails._id;
    await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getBathroomDataAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    const bathroomDetails = await BathroomData.findById(inspection.bathroomInfo);
    if (!bathroomDetails) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      message: 200,
      inspection,
      bathroomDetails
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

