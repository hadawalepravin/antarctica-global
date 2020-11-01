const { transformOrganization } = require('./merge');
const Organization = require('../../models/organization');

module.exports = {

  // GET all organizations
  organizations: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      const organizations = await Organization.find();
      return organizations.map(organization => {
        return transformOrganization(organization);
      });
    } catch (err) {
      throw err;
    }
  },

  // POST new organization
  createOrganization: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {

      // Check if organization already exists with the input name
      const existingOrganization = await Organization.findOne({ name: args.organizationInput.name });
      if (existingOrganization) {
        throw new Error('Organization already exists!');
      }

      const organization = new Organization({
        name: args.organizationInput.name,
        location: args.organizationInput.location
      });

      const result = await organization.save();
      return { ...result._doc, _id: result.id };
    } catch (err) {
      throw err;
    }
  }
};
