const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Organization', organizationSchema);
