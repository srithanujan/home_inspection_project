// const GroundsData = require('../../models/lotsAndGround/lotsAndGroundsModel');

// exports.addGroundsData = async (req, res) => {
//     try {
//         const groundsDetails = new GroundsData(req.body);

//         await groundsDetails.save();
//         res.status(201).send({ message: 'Grounds data added successfully' });
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// };



const GroundsData = require('../../models/lotsAndGround/lotsAndGroundsModel');
const Inspection = require('../../models/main/mainModel');

exports.addGroundsDataToInspection = async (req, res) => {
  try {
    const ground = new GroundsData({
      driveway: req.body.driveway,
      porch: req.body.porch,
      stepsHandrails: req.body.stepsHandrails,
      deckPatio: req.body.deckPatio,
      fence: req.body.fence,
      landscaping: req.body.landscaping
    });

    const savedGroundsDetails = await ground.save();

    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.groundsInfo = savedGroundsDetails._id;
    await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getGroundsDataAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    const groundsDetails = await GroundsData.findById(inspection.groundsInfo);
    if (!groundsDetails) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      message: 200,
      inspection,
      groundsDetails
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
