const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');
const Organization = require('../../models/organization');

const singleUser = async userId => {
  try {
    const user = await User.findById(userId);
    return transformUser(user);
  } catch (err) {
    throw err;
  }
};

const singleOrganization = async organizationId => {
  try {
    const organization = await Organization.findById(organizationId);
    return transformOrganization(organization);
  } catch (err) {
    throw err;
  }
};

// Transformations
const transformUser = user => {
  return {
    ...user._doc,
    _id: user.id,
    password: null
  };
};

const transformOrganization = organization => {
  return {
    ...organization._doc,
    _id: organization.id
  };
};

const transformRegistration = registration => {
  return {
    ...registration._doc,
    _id: registration.id,
    user: singleUser.bind(this, registration._doc.user),
    organization: singleOrganization.bind(this, registration._doc.organization),
    createdAt: dateToString(registration._doc.createdAt),
    updatedAt: dateToString(registration._doc.updatedAt)
  };
};

exports.transformUser = transformUser;
exports.transformOrganization = transformOrganization;
exports.transformRegistration = transformRegistration;
