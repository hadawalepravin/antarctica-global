const _ = require('underscore');
const uniqid = require('uniqid');
const User = require('../../models/user');
const { transformRegistration } = require('./merge');
const Organization = require('../../models/organization');
const Registration = require('../../models/registration');

module.exports = {

  // GET all registrations
  registrations: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      const registrations = await Registration.find();
      return registrations.map(registration => {
        return transformRegistration(registration);
      });
    } catch (err) {
      throw err;
    }
  },

  // Filter registrations
  filterRegistrations: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    // Search filters
    const firstName = args.filterInput.firstName || '';
    const lastName = args.filterInput.lastName || '';
    const employeeId = args.filterInput.employeeId || '';

    // Sort filters
    const sortInput = args.filterInput.sortInput;
    const sortField = sortInput ? sortInput.field : '';
    const sortOrder = sortInput ? sortInput.order : '';

    // Pagination filters
    const paginationInput = args.filterInput.paginationInput;
    const pageSize = paginationInput ? +paginationInput.size : '10';
    const pageIndex = paginationInput ? +paginationInput.index : '1';

    // employeeId filter
    let registrationFilter = {};
    if (employeeId) {
      registrationFilter['employeeId'] = employeeId;
    }

    try {

      // Get all registrations that matches registration filters
      let registrations = await Registration.find(registrationFilter);

      // Enrich registrations with user and organization details
      let enrichRegistrations = [];
      for (let i = 0; i < registrations.length; i++) {
        const registration = registrations[i];
        const fetchedUser = await User.findOne({ _id: registration.user });
        const fetchedOrganization = await Organization.findOne({ _id: registration.organization });
        const reg = {};
        reg.id = registration._id.toString();
        reg.firstName = fetchedUser.firstName.toString();
        reg.lastName = fetchedUser.lastName.toString();
        reg.email = fetchedUser.email.toString();
        reg.employeeId = registration.employeeId.toString();
        reg.organizationName = fetchedOrganization.name.toString();
        enrichRegistrations.push(reg);
      }

      // firstName and lastName filters
      let filteredRegistrations = [];
      for (let i = 0; i < enrichRegistrations.length; i++) {
        let registration = enrichRegistrations[i];
        if (
          (firstName === '' || registration.firstName.includes(firstName)) &&
          (lastName === '' || registration.lastName.includes(lastName))
        ) {
          filteredRegistrations.push(registration);
        }
      }

      // Sort registrations by either firstName, lastName, email, employeeId or organizationName
      filteredRegistrations = _.sortBy(filteredRegistrations, reg => {
        if (sortField === 'firstName') { return reg.firstName; }
        if (sortField === 'lastName') { return reg.lastName; }
        if (sortField === 'email') { return reg.email; }
        if (sortField === 'employeeId') { return reg.employeeId; }
        if (sortField === 'organizationName') { return reg.organizationName; }
      });

      // Handle descending order
      if (sortOrder === -1) {
        filteredRegistrations = filteredRegistrations.reverse();
      }

      // Filter out unwanted registrations
      const temporaryList = [];
      filteredRegistrations.forEach(filteredRegistration => {
        const registration = _.filter(registrations, registration => {
          return registration._id.toString() === filteredRegistration.id.toString();
        })[0];
        temporaryList.push(registration);
      });

      // Apply paginations
      let result = [];
      if (pageSize > 0 && pageIndex > 0) {
        const startingIndex = (pageIndex - 1) * pageSize;
        let i = 0, j = 0, chunk = pageSize;
        for (i = startingIndex, j = temporaryList.length; i < j; i += chunk) {
          result = temporaryList.slice(i, i + chunk);
          break;
        }
      }

      return result.map(registration => {
        return transformRegistration(registration);
      });
    } catch (err) {
      throw err;
    }
  },

  register: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    const fetchedUser = await User.findOne({ _id: args.registrationInput.userId });
    const fetchedOrganization = await Organization.findOne({ _id: args.registrationInput.organizationId });

    const registration = new Registration({
      user: fetchedUser,
      organization: fetchedOrganization,
      employeeId: uniqid.time()
    });

    const result = await registration.save();
    return transformRegistration(result);
  },
};
