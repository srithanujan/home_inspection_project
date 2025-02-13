// const BasementData = require('../../models/basement/basementModel');

// exports.addBasementData = async (req, res) => {
//     try {
//         const basementDetails = new BasementData({
//             basements: req.body.basements
//         });

//         await basementDetails.save();
//         res.status(201).send({ message: 'Building data added successfully' });
//     } catch (error) {
//         console.log(error.message)
//         res.status(400).send(error.message);
//     }
// };


const BasementData = require('../../models/basement/basementModel');
const Inspection = require('../../models/main/mainModel');

exports.addBasementDataToInspection = async (req, res) => {
  try {
    const basement = new BasementData({
      basements: req.body.basements
    });

    const savedBasementDetails = await basement.save();

    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.basementInfo = savedBasementDetails._id;
    await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getBasementDataAndInspection = async (req, res) => {
    try {
      const inspectionId = req.params.inspectionId;
      const inspection = await Inspection.findById(inspectionId);
      if (!inspection) {
        return res.status(404).json({ message: 404 });
      }
  
      const basementDetails = await BasementData.findById(inspection.basementInfo);
      if (!basementDetails) {
        return res.status(404).json({ message: 404 });
      }
  
      res.status(200).json({
        message: 200,
        inspection,
        basementDetails
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  };


