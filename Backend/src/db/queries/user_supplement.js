const db = require('../connection');

// Get request query

/**
 * Get a all users from the database.
 * @return {Promise<{}>} A promise for supplement.
 */
const getUserSupplements = () => {
  return db
    .query('SELECT * FROM user_supplements;')
    .then(result => {
      let resolvedUserSupplements = null;
      const UserSupplements = result.rows;
      // console.log(UserSupplements);
      if (UserSupplements) {
        resolvedUserSupplements = UserSupplements;
      }
      return Promise.resolve(resolvedUserSupplements);
    });
};

// ----------------------- getUserByUserId

// Post request query

// ----------------------- addUserSupplement
// ----------------------- removeUserSupplement

module.exports = {
  getUserSupplements,
  // getUserByEmail,
  // getUserById,
  // addUser
};