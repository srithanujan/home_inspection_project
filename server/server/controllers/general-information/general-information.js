// const General  = require('../../models/general-information/generalInformationModel');

// exports.addGeneral = async (req, res) => {
//     try {
//       const general = new General({
//         clientInformation: {
//           contactName: req.body.clientInformation.contactName,
//           clientAddress: req.body.clientInformation.clientAddress,
//           phoneNumber: req.body.clientInformation.phoneNumber,
//           email: req.body.clientInformation.email,
//         },
//         inspectionCompany: {
//           inspectorName: req.body.inspectionCompany.inspectorName,
//           inspectionAddress: req.body.inspectionCompany.inspectionAddress,
//           phoneNumber: req.body.inspectionCompany.phoneNumber,
//           email: req.body.inspectionCompany.email,
//         }

//       });
  
//       await general.save();
//       res.status(201).send({ message: 200 });
  
//     } catch (error) {
//       res.status(400).send(error.message);
//     }
//   };


const General = require('../../models/general-information/generalInformationModel');
const Inspection = require('../../models/main/mainModel');

exports.addGeneralToInspection = async (req, res) => {
  try {

    const general = new General({
      clientInformation: {
        contactName: req.body.clientInformation.contactName,
        clientAddress: req.body.clientInformation.clientAddress,
        phoneNumber: req.body.clientInformation.phoneNumber,
        email: req.body.clientInformation.email,
      },
      inspectionCompany: {
        inspectorName: req.body.inspectionCompany.inspectorName,
        inspectionAddress: req.body.inspectionCompany.inspectionAddress,
        phoneNumber: req.body.inspectionCompany.phoneNumber,
        email: req.body.inspectionCompany.email,
      }
    });


    const savedGeneral = await general.save();


    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

  
    inspection.generalInfo = savedGeneral._id;
    await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};



exports.getGeneralAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ code: 404 });
    }

    const general = await General.findById(inspection.generalInfo);
    if (!general) {
      return res.status(404).json({ code: 404 });
    }

    res.status(200).json({
      code: 200,
      data: {
        general: {
          inspectionId: inspection._id,
          data: general
        }
      }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
