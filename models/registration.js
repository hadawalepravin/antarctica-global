const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registrationSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', registrationSchema);
