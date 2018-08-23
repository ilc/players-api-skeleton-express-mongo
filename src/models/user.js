const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { jwtsecret } = require('config');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true},
  },
  {
    versionKey: false
  }
);

UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
};

UserSchema.methods.hashPassword = function () {
    const hash = bcrypt.hashSync(this.password, 8);
    this.password = hash;
    return true;
}

UserSchema.methods.passwordIsValid = function (password) {
   try {
       return bcrypt.compareSync(password, this.password);
   }
   catch (err) {
       throw err;
   }
};

UserSchema.methods.getToken = function () { return jwt.sign({ userId: this._id }, jwtsecret); }

UserSchema.methods.getCleanUser = function () {
    return {
	id: this._id,
	first_name: this.first_name,
	last_name: this.last_name,
	email: this.email
    };
}
	  

const User = mongoose.model('User', UserSchema);
module.exports = User;
