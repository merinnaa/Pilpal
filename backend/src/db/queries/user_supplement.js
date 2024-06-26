const db = require('../connection');

// Get request query

/**
 * @param {{userId: Integer}} user id
 * @return {Promise<{}>} A promise for supplement.
 */

const getUserSupplements = (id) => {
  // const query = `
  //   SELECT supplements.name,
  //     TO_CHAR(supplement_usage.time_to_be_taken AT TIME ZONE 'UTC', 'YYYY-MM-DD HH12:MI AM') AS time,
  //     user_supplements.number_of_pills_taken AS intakeQuantity,
  //     supplement_usage.stocklevel AS stockQuantity,
  //     supplements.images AS image,
  //     supplements.type,
  //     supplements.id
  //   FROM supplements
  //   JOIN user_supplements ON supplements.id = user_supplements.supplementId
  //   JOIN supplement_usage ON supplement_usage.usersupplementid = user_supplements.id
  //   WHERE user_supplements.userId = $1;
  // `;

  const query = `
    SELECT supplements.name,
      TO_CHAR(supplement_usage.time_to_be_taken AT TIME ZONE 'UTC', 'YYYY-MM-DD HH12:MI AM') AS time,
      supplement_usage.intakefrequency,
      user_supplements.dosage_per_intake AS intakeQuantity,
      supplement_usage.stocklevel AS stockQuantity,
      supplements.images AS image,
      user_supplements.effectiveness,
      supplement_usage.refilllevel,
      supplement_lineitem.supplementtype AS dosageType,
      supplement_lineitem.startdate,
      supplement_lineitem.enddate,
      supplement_lineitem.price,
      supplement_lineitem.purchasedFrom,
      supplement_lineitem.quantity,
      user_supplements.additionalnotes,
      supplement_lineitem.type,
      supplement_lineitem.status,
      supplement_lineitem.status_reason,
      supplements.id,
      supplements.description,
      supplements.manufacturer
    FROM supplements 
    JOIN user_supplements ON supplements.id = user_supplements.supplementId
    JOIN supplement_usage ON supplement_usage.usersupplementid = user_supplements.id 
    JOIN supplement_lineitem ON supplement_lineitem.supplementId = supplements.id
    WHERE user_supplements.userid = $1;
  `;

  return db
    .query(query, [id])
    .then(result => {
      const userSupplements = result.rows;
      // console.log('userSupplements:', userSupplements);
      return userSupplements || []; // Return an empty array if no user supplements found
    })
    .catch(error => {
      console.error(error);
      throw new Error("Error fetching user supplements");
    });
};

// upgrade
// const getUserSupplements = (id) => {
//   const query = `
//     SELECT
//       supplements.name,
//       TO_CHAR(supplement_usage.time_to_be_taken AT TIME ZONE 'UTC', 'YYYY-MM-DD HH12:MI AM') AS time,
//       user_supplements.effectiveness AS effectiveness,
//       supplement_usage.reorderLevel AS reorderLevel,
//       supplements.dosageType AS dosageType,
//       supplement_usage.startDate AS startDate,
//       supplement_usage.endDate AS endDate,
//       supplements.cost AS price,
//       supplements.images AS image,
//       supplements.manufacturer AS purchasedFrom,
//       supplements.description AS additionalNotes,
//       user_supplements.number_of_pills_taken AS intakeQuantity,
//       supplement_usage.stocklevel AS stockQuantity,
//       supplements.id
//     FROM supplements
//     JOIN user_supplements ON supplements.id = user_supplements.supplementId
//     JOIN supplement_usage ON supplement_usage.usersupplementid = user_supplements.id
//     WHERE user_supplements.userId = $1;
//   `;

//   return db
//     .query(query, [id])
//     .then(result => {
//       const userSupplements = result.rows;
//       // console.log('userSupplements:', userSupplements);
//       return userSupplements || [];
//     })
//     .catch(error => {
//       console.error(error);
//       throw new Error("Error fetching user supplements");
//     });
// };


// ----------------------- getUserByUserId

// Post request query

/**
 * Add a new user to the database.
 * @param {{userId: Integer, supplementId: Integer}}
 * @return {Promise<{}>} A promise to the user.
 */
const addToUserSupplement = (userId, supplementId, newSupplement) => {
  
  const {
    dosagePerIntake,
    effectiveness,
    additionalNotes
  } = newSupplement;
  
  console.log({
    userId:userId,
    supplementId:supplementId,
    dosagePerIntake:dosagePerIntake,
    effectiveness:effectiveness,
    additionalNotes:additionalNotes
  });
  
  // Parse supplementId, quantitySum, and refillLevel to integers
  const parsedDosagePerIntake = parseInt(dosagePerIntake, 10);

  const query = `
    INSERT INTO user_supplements (userId, supplementId, dosage_per_intake, time_taken, effectiveness, additionalNotes)
    VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *
  `;

  const queryParam = [userId, supplementId, parsedDosagePerIntake, effectiveness, additionalNotes];

  return db
    .query(query, queryParam)
    .then(result => {
      const userSupplementsAdd = result.rows[0];
      return Promise.resolve(userSupplementsAdd);
    })
    .catch((err) => {
      console.error('Error adding newSupplement:', err.message);
      throw err; // Rethrow the error to be handled elsewhere
    });
};

/**
 * Add a new user to the database.
 * @param {{userId: Integer, supplementId: Integer}}
 * @return {Promise<{}>} A promise to the user.
 */
const editInUserSupplement = (userid, editedSupplementToBeUpdated) => {
  
  const {
    intakequantity,
    effectiveness,
    additionalnotes,
    id
  } = editedSupplementToBeUpdated;

  console.log({
    intakequantity,
    effectiveness,
    additionalnotes,
    id
  });

  const query = `
    UPDATE user_supplements 
    SET 
      dosage_per_intake = $1,
      effectiveness = $2,
      additionalnotes = $3
    WHERE userid = $4 AND supplementid = $5
    RETURNING *
  `;

  const queryParam = [intakequantity, effectiveness, additionalnotes, userid, id];

  return db
    .query(query, queryParam)
    .then(result => {
      const editedUserSupplement = result.rows[0];
      return Promise.resolve(editedUserSupplement);
    })
    .catch((err) => {
      console.error('Error editing user supplement:', err.message);
      throw err; // Rethrow the error to be handled elsewhere
    });
};


/**
 * Add a new user to the database.
 * @param {{userId: Integer, supplementId: Integer}}
 * @return {Promise<{}>} A promise to the user.
 */
const removeFromUserSupplement = (userId, supplementId) => {
  const query = `
    DELETE FROM user_supplements 
    WHERE userId = $1 AND supplementId = $2 
    RETURNING *
  `;
  
  const queryParam = [userId, supplementId];

  return db
    .query(query, queryParam)
    .then(result => {
      const removedUserSupplement = result.rows[0];
      return Promise.resolve(removedUserSupplement);
    })
    .catch((err) => {
      console.error('Error removing user supplement:', err.message);
      throw err; // Rethrow the error to be handled elsewhere
    });
};



// ----------------------- removeUserSupplement

module.exports = {
  getUserSupplements,
  removeFromUserSupplement,
  editInUserSupplement,
  addToUserSupplement
};