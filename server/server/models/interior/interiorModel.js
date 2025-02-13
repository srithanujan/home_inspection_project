const mongoose = require("mongoose");

// Define schema for stairs
const stairsSchema = new mongoose.Schema({
  interiorStairsMaterial: { type: [String] },
  otherInteriorStairsMaterial: { type: String },
  interiorStairsCondition: { type: [String] },
  otherInteriorStairsCondition: { type: String },
  interiorStairsComments: { type: [String] },
});

// Define schema for handrails
const handrailsSchema = new mongoose.Schema({
  interiorHandrailsMaterial: { type: [String] },
  otherInteriorHandrailsMaterial: { type: String },
  interiorHandrailsCondition: { type: [String] },
  otherInteriorHandrailsCondition: { type: String },
  interiorHandrailsComments: { type: [String] },
});

// Define schema for fireplaces
const fireplacesSchema = new mongoose.Schema({
  interiorFireplaceLocation: { type: [String] },
  otherInteriorFireplaceLocation: { type: String },
  interiorFireplaceType: { type: [String] },
  otherInteriorFireplaceType: { type: String },
  interiorFireplaceCondition: { type: [String] },
  otherInteriorFireplaceCondition: { type: String },
  interiorFireplaceComments: { type: [String] },
  otherInteriorFireplaceComments: { type: String },
});

// Define schema for smoke detectors
const smokeDetectorSchema = new mongoose.Schema({
  interiorSmokeDetectorComments: { type: [String] }, // Changed to array
  otherInteriorSmokeDetectorComments: { type: String },
});

// Define schema for skylight
const skylightSchema = new mongoose.Schema({
  interiorSkylightType: { type: [String] }, // Changed to array
  otherInteriorSkylightType: { type: String },
  interiorSkylightComments: { type: [String] }, // Changed to array
  otherInteriorSkylightComments: { type: String },
});

// Define schema for floor drain
const floorDrainSchema = new mongoose.Schema({
  interiorFloorDrainCondition: { type: [String] }, // Changed to array
  otherInteriorFloorDrainCondition: { type: String },
  interiorFloorDrainComments: { type: [String] }, // Changed to array
  otherInteriorFloorDrainComments: { type: String },
});

// Define schema for attic
const atticSchema = new mongoose.Schema({
  interiorAtticAccess: { type: [String] }, // Changed to array
  otherInteriorAtticAccess: { type: String },
  interiorAtticLocation: { type: [String] }, // Changed to array
  otherInteriorAtticLocation: { type: String },
  interiorAtticInspectionMethod: { type: [String] }, // Changed to array
  otherInteriorAtticInspectionMethod: { type: String },
  interiorAtticRoofFraming: { type: [String] }, // Changed to array
  otherInteriorAtticRoofFraming: { type: String },
  interiorAtticSheathing: { type: [String] }, // Changed to array
  otherInteriorAtticSheathing: { type: String },
  interiorAtticInsulationType: { type: [String] }, // Changed to array
  otherInteriorAtticInsulationType: { type: String },
  interiorAtticInsulationDepth: { type: [String] }, // Changed to array
  otherInteriorAtticInsulationDepth: { type: String },
  interiorAtticVaporBarrier: { type: [String] }, // Changed to array
  otherInteriorAtticVaporBarrier: { type: String },
  interiorAtticVentilation: { type: [String] }, // Changed to array
  otherInteriorAtticVentilation: { type: String },
  interiorAtticExhaustFan: { type: [String] }, // Changed to array
  otherInteriorAtticExhaustFan: { type: String },
  interiorAtticComments: { type: [String] }, // Changed to array
  otherInteriorAtticComments: { type: String },
});

// Define schema for sump pump
const sumpPumpSchema = new mongoose.Schema({
  interiorSumpPumpLocation: { type: [String] }, // Changed to array
  otherInteriorSumpPumpLocation: { type: String },
  interiorSumpPumpCondition: { type: [String] }, // Changed to array
  otherInteriorSumpPumpCondition: { type: String },
  interiorSumpPumpComments: { type: String },
  otherInteriorSumpPumpComments: { type: String },
});

// Define main interior schema
const interiorSchema = new mongoose.Schema({
  stair: [stairsSchema],
  handrail: [handrailsSchema],
  fireplace: [fireplacesSchema],
  smokeDetector: smokeDetectorSchema,
  skylight: skylightSchema,
  floorDrain: floorDrainSchema,
  attic: atticSchema,
  sumpPump: sumpPumpSchema,
});

const Interior = mongoose.model("interior", interiorSchema);

module.exports = Interior;
