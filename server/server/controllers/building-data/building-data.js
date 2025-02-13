// const BuildingData = require('../../models/building-data/buildingDataModel');

// exports.addBuildingData = async (req, res) => {
//   try {
//     const buildingDetails = new BuildingData({
//       estimatedAge: req.body.estimatedAge,
//       buildingType: req.body.buildingType,
//       otherBuildingType: req.body.otherBuildingType,
//       occupancyState: req.body.occupancyState,
//       otherOccupancyState: req.body.otherOccupancyState,
//       garage: req.body.garage,
//       otherGarage: req.body.otherGarage,
//       exterior: req.body.exterior,
//       otherExterior: req.body.otherExterior,
//       weatherCondition: req.body.weatherCondition,
//       otherWeatherCondition: req.body.otherWeatherCondition,
//       soilCondition: req.body.soilCondition,
//       OtherSoilCondition: req.body.OtherSoilCondition,
//       outdoorTemperature: req.body.outdoorTemperature,
//       inspectionDate: req.body.inspectionDate,
//       startTime: req.body.startTime,
//       endTime: req.body.endTime,
//       recentRain: req.body.recentRain,
//       electricityOn: req.body.electricityOn,
//       otherElectricityOn: req.body.otherElectricityOn,
//       gasOilOn: req.body.gasOilOn,
//       otherGasOilOn: req.body.otherGasOilOn,
//       waterOn: req.body.waterOn,
//       otherWaterOn: req.body.otherWaterOn
//     });
//     await buildingDetails.save();
//     res.status(201).send({ message: 200 });
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };


const BuildingData = require('../../models/building-data/buildingDataModel');
const Inspection = require('../../models/main/mainModel');

exports.addBuildingDataToInspection = async (req, res) => {
  try {
    const building = new BuildingData({
      estimatedAge: req.body.estimatedAge,
      buildingType: req.body.buildingType,
      otherBuildingType: req.body.otherBuildingType,
      occupancyState: req.body.occupancyState,
      otherOccupancyState: req.body.otherOccupancyState,
      garage: req.body.garage,
      otherGarage: req.body.otherGarage,
      exterior: req.body.exterior,
      otherExterior: req.body.otherExterior,
      weatherCondition: req.body.weatherCondition,
      otherWeatherCondition: req.body.otherWeatherCondition,
      soilCondition: req.body.soilCondition,
      OtherSoilCondition: req.body.OtherSoilCondition,
      outdoorTemperature: req.body.outdoorTemperature,
      inspectionDate: req.body.inspectionDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      recentRain: req.body.recentRain,
      electricityOn: req.body.electricityOn,
      otherElectricityOn: req.body.otherElectricityOn,
      gasOilOn: req.body.gasOilOn,
      otherGasOilOn: req.body.otherGasOilOn,
      waterOn: req.body.waterOn,
      otherWaterOn: req.body.otherWaterOn
    });

    const savedBuildingDetails = await building.save();

    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.buildingInfo = savedBuildingDetails._id;
    await inspection.save();

    // inspection.generalInfo = savedGeneral._id;
    // await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getBuildingDataAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    const buildingDetails = await BuildingData.findById(inspection.buildingInfo);
    if (!buildingDetails) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      message: 200,
      inspection,
      buildingDetails
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};