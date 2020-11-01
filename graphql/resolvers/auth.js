const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const { transformUser } = require('./merge');

module.exports = {

  // GET all users
  users: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      const users = await User.find();
      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },

  // POST new user
  createUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {

      // Check if user already exists with the input email
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User already exists!');
      }

      // Encrypt password
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        firstName: args.userInput.firstName,
        lastName: args.userInput.lastName,
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },

  // Login endpoint
  login: async ({ email, password }) => {

    // Check if user email exists
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }

    // Check if password matches
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email }, 'antarcticaglobalkey', { expiresIn: '1h' }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};
