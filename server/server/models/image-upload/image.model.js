const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  imageName: {
    type: String,
    required: true,
  },
  inspectionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
}, {
  timestamps: true,
});

const ImageModel = mongoose.model('image', imageSchema);

module.exports = ImageModel;