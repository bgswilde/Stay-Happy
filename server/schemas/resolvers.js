const { AuthenticationError } = require('apollo-server-express');
const { User, Job } = require('../models');
const { signToken } = require('../utils/auth');
// const { createCheckoutSession } = require('../utils/stripe');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
    },

    user: async (parent, { phoneNumber }) => {
      return User.findOne({ phoneNumber })
        .select('-__v -password')
    }
    // checkoutSession: async (parent, args, context) => {
    //   const productName = 'testProduct';
    //   const unitAmount = 100;
    //   const quantity = 1;
    //   const successUrl = 'http://example.com/success';
    //   const cancelUrl = 'http://example.com/success';
    //   const session = await createCheckoutSession(productName, unitAmount, quantity, successUrl, cancelUrl);
    //   return session;
    // }
  },

  Mutation: {
    login: async (parent, { phoneNumber, password }) => {
      const user = await User.findOne({ phoneNumber });

      if(!user) {
        throw new AuthenticationError('No user associated with this phone number');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password')
      }

      return user;
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          { _id: args.userId },
          { args },
          {new: true }
        )
      }
    },
    removeUser: async (parent, args, context) => {
      if (context.user) {

        const user = await User.findByIdAndRemove(
          { _id: args.userId } 
        );

        return user
      }

      throw new AuthenticationError('You need to be logged in!')
    },
    addJob: async (parent, args, context) => {
      if (context.user) {
        const job = await Job.create(args);
        return job;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    updateJob: async (parent, args, context) => {
      if (context.user) {

        const job = await Job.findByIdAndUpdate(
          { _id: args._id }, // not sure about this
          { args }, // not sure about this
          { new: true }
        );

        return job;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    removeJob: async (parent, args, context) => {
      if (context.user) {
        
        const job = Job.findByIdAandRemove(args); // not sure about this

        return job;
      }

      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

module.exports = resolvers;