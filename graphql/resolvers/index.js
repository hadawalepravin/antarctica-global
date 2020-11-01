const authResolver = require('./auth');
const organizationResolver = require('./organization');
const registrationResolver = require('./registration');

const rootResolver = {
  ...authResolver,
  ...organizationResolver,
  ...registrationResolver
};

module.exports = rootResolver;
