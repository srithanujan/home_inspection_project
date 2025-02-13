// const LaundryData = require('../../models/laundry/laundryModel');

// exports.addLaundryData = async (req, res) => {
//     try {
//         const laundryDetails = new LaundryData({
//             laundrys: req.body.laundrys
//         });

//         await laundryDetails.save();
//         res.status(201).send({ message: 'Laundry data added successfully' });
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// };



const LaundryData = require('../../models/laundry/laundryModel');
const Inspection = require('../../models/main/mainModel');

exports.addLaundryDataToInspection = async (req, res) => {
  try {
    const laundry = new LaundryData({
      laundrys: req.body.laundrys
    });

    const savedLaundryDetails = await laundry.save();

    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.laundryInfo = savedLaundryDetails._id;
    await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getLaundryDataAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    const laundryDetails = await LaundryData.findById(inspection.laundryInfo);
    if (!laundryDetails) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      message: 200,
      inspection,
      laundryDetails
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};