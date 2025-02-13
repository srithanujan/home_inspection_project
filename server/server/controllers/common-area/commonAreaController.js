// const CommonAreasData = require('../../models/common-area/commonAreaModel');

// exports.addCommonAreasData = async (req, res) => {
//     try {
//         const commonAreasDetails = new CommonAreasData({
//             commonAreas: req.body.commonAreas
//         });

//         await commonAreasDetails.save();
//         res.status(201).send({ message: 'Common areas data added successfully' });
//     } catch (error) {
//         console.log(error);
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// };


const CommonAreasData = require('../../models/common-area/commonAreaModel');
const Inspection = require('../../models/main/mainModel');

exports.addCommonAreasDataToInspection = async (req, res) => {
  try {
    const commonArea = new CommonAreasData({
      commonAreas: req.body.commonAreas
    });

    const savedCommonAreasDetails = await commonArea.save();

    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.commonAreasInfo = savedCommonAreasDetails._id;
    await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getCommonAreasDataAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    const commonAreasDetails = await CommonAreasData.findById(inspection.commonAreasInfo);
    if (!commonAreasDetails) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      message: 200,
      inspection,
      commonAreasDetails
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

