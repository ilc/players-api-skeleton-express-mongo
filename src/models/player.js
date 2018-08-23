const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema(
  {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      rating: { type: Number, required: true },
      handedness: {
	  type: String,
	  required: true,
	  match: /left|right/
      },
      created_by: { type: mongoose.Schema.Types.ObjectId, required: true }
  },
  {
    versionKey: false
  }
);

PlayerSchema.index({ first_name: 1, last_name: 1 }, { unique: true })

PlayerSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
};

const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;
