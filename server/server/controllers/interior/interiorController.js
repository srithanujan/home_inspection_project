const Interior = require('../../models/interior/interiorModel');
const Inspection = require('../../models/main/mainModel');


exports.addInteriorDataToInspection = async (req, res) => {
  try {
    const interior = new Interior(req.body);
    const savedInteriorDetails = await interior.save();
    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.interiorInfo = savedInteriorDetails._id;
    await inspection.save();
    res.status(200).json({ message: 200, inspection });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getInteriorDataAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }
    
    const interiorDetails = await Interior.findById(inspection.interiorInfo);
    
    if (!interiorDetails) {
      return res.status(404).json({ message: 404 });
    }
    
    res.status(200).json({
      message: 200,
      inspection,
      interiorDetails
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};


