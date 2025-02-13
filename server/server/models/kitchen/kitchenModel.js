const mongoose = require('mongoose');

const kitchenCountertopsSchema = new mongoose.Schema({
    kitchenCountertopsCondition: { type: [String] },
    otherKitchenCountertopsCondition: { type: String },
    countertopsComments: { type: [String] },
    otherCountertopsComments: { type: String }
});

const kitchenCabinetsSchema = new mongoose.Schema({
    kitchenCabinetsCondition: { type: [String] },
    otherKitchenCabinetsCondition: { type: String },
    kitchenCabinetsComments: { type: [String] },
    otherKitchenCabinetsComments: { type: String }
});

const kitchenPlumbingsSchema = new mongoose.Schema({
    kitchenPlumbingsCondition: { type: [String] },
    otherKitchenPlumbingsCondition: { type: String },
    kitchenPlumbingsFaucet: { type: [String] },
    otherKitchenPlumbingsFaucet: { type: String },
    kitchenPlumbingsFunctionalDrainage: { type: [String] },
    otherKitchenPlumbingsFunctionalDrainage: { type: String }
});

const kitchenFloorsSchema = new mongoose.Schema({
    kitchenFloorMaterial: { type: [String] },
    otherKitchenFloorMaterial: { type: String },
    kitchenFloorCondition: { type: [String] },
    otherKitchenFloorCondition: { type: String },
    kitchenFloorComments: { type: [String] },
    otherKitchenFloorComments: { type: String }
});

const kitchenWallsSchema = new mongoose.Schema({
    kitchenWallsCondition: { type: [String] },
    otherKitchenWallsCondition: { type: String }
});

const kitchenCeilingsSchema = new mongoose.Schema({
    kitchenCeilingsCondition: { type: [String] },
    otherKitchenCeilingsCondition: { type: String }
});

const kitchenElectricalsSchema = new mongoose.Schema({
    kitchenElectricalsCondition: { type: [String] },
    otherKitchenElectricalsCondition: { type: String }
});

const kitchenAppliancesSchema = new mongoose.Schema({
    kitchenAppliancesRange: { type: [String] },
    otherKitchenAppliancesRange: { type: String },
    kitchenAppliancesRangeCondition: { type: [String] },
    otherKitchenAppliancesCondition: { type: String }
});

const kitchenDishwashersSchema = new mongoose.Schema({
    kitchenDishwasher: { type: [String] },
    otherKitchenDishwasher: { type: String },
    kitchenDishwashersCondition: { type: [String] },
    otherKitchenDishwashersCondition: { type: String }
});

const kitchenRangeHoodFansSchema = new mongoose.Schema({
    kitchenRangeHoodFan: { type: [String] },
    otherKitchenRangeHoodFan: { type: String }
});

const kitchenRefrigeratorsSchema = new mongoose.Schema({
    kitchenRefrigerator: { type: [String] },
    otherKitchenRefrigerator: { type: String },
    kitchenRefrigeratorCondition: { type: [String] },
    otherKitchenRefrigeratorCondition: { type: String }
});

const kitchenMicrowavesSchema = new mongoose.Schema({
    kitchenMicrowave: { type: [String] },
    otherKitchenMicrowave: { type: String }
});

const kitchenSchema = new mongoose.Schema({
    name: { type: String },
    kitchenCountertops: kitchenCountertopsSchema,
    kitchenCabinets: kitchenCabinetsSchema,
    kitchenPlumbings: kitchenPlumbingsSchema,
    kitchenFloors: kitchenFloorsSchema,
    kitchenWalls: kitchenWallsSchema,
    kitchenCeilings: kitchenCeilingsSchema,
    kitchenElectricals: kitchenElectricalsSchema,
    kitchenAppliances: kitchenAppliancesSchema,
    kitchenDishwashers: kitchenDishwashersSchema,
    kitchenRangeHoodFans: kitchenRangeHoodFansSchema,
    kitchenRefrigerators: kitchenRefrigeratorsSchema,
    kitchenMicrowaves: kitchenMicrowavesSchema,
    kitchenOpenGroundReversePolarity: { type: [String] }
});

const kitchenDataSchema = new mongoose.Schema({
    kitchens: [kitchenSchema]
});

const KitchenData = mongoose.model('kitchen', kitchenDataSchema);
module.exports = KitchenData;