// const KitchenData = require('../../models/kitchen/kitchenModel');

// exports.addKitchenData = async (req, res) => {
//     try {
//         const kitchenDetails = new KitchenData({
//             kitchens: req.body.kitchens
//         });

//         await kitchenDetails.save();
//         res.status(201).send({ message: 'Kitchen data added successfully' });
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// };



const KitchenData = require('../../models/kitchen/kitchenModel');
const Inspection = require('../../models/main/mainModel');

exports.addKitchenDataToInspection = async (req, res) => {
  try {
    const kitchen = new KitchenData({
      kitchens: req.body.kitchens
    });

    const savedKitchenDetails = await kitchen.save();

    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.kitchenInfo = savedKitchenDetails._id;
    await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getKitchenDataAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    const kitchenDetails = await KitchenData.findById(inspection.kitchenInfo);
    if (!kitchenDetails) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      message: 200,
      inspection,
      kitchenDetails
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};


