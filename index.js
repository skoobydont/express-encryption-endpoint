const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
// CORS & Body Parser
const cors = require("cors");
const bodyParser = require("body-parser");
// Import express
const express = require("express");
// Instantiate application
const app = express();
// Set port
const PORT = process.env.PORT || 3000;
// Handle CORS
app.use(cors());
// Handle incoming payload types
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Encryption Helpers
const crypto = require('crypto');
const { encrypt, decrypt } = require('./crypto');
// Initialization Vectors
const ivs = {
  object: process.env.OBJECT_IV,
  attribute: process.env.ATTRIBUTE_IV,
  firstName: process.env.FIRST_NAME_IV,
  lastName: process.env.LAST_NAME_IV,
  // ssn
  // address: street1, street 2, city, state, zip
  // dob?
};
// Object Payload SK
const objSK = process.env.OBJECT_ENCRYPTION_KEY;
// Generic Attribute SK
const attrSK = process.env.ATTRIBUTE_ENCRYPTION_KEY;
// Specific Attribute SKs
const attrSKs = {
  firstName: process.env.FIRST_NAME_ENCRYPTION_KEY,
  lastName: process.env.LAST_NAME_ENCRYPTION_KEY,
};
// Encrypt Route
app.post('/v1/encrypt-user', (req, res) => {
  console.time('encrypt-user');
  // handle encrypted payload
  if (typeof req === 'object') {
    const objKeys = Object.keys(req.body);

    let objKIndex = 0;
    let encryptedObj = {};
    // iterate over object keys of request & update result object
    while (objKIndex < objKeys.length) {
      encryptedObj = {
        ...encryptedObj,
        [`${encrypt(attrSK, ivs.attribute, objKeys[objKIndex])}`]:
          encrypt(attrSKs[objKeys[objKIndex]], ivs[objKeys[objKIndex]], req.body[objKeys[objKIndex]]),
      };
      objKIndex += 1;
    }
  }
  // encrypt result
  const encryptedObjString = encrypt(objSK, ivs.object, JSON.stringify(encryptedObj));
  console.timeEnd('encrypt-user');
  // return 200 with result id
  return res.status(200).send({ route: 'Test Route', id: encryptedObjString });
});
// Decrypt Route
app.post('/v1/user', (req, res) => {
  console.time('decrypt-user');
  if (req.body.payload) {
    // decrypt payload with object encryption key
    const decryptedObj = decrypt(objSK, ivs.object, req.body.payload);
  
    let result = {};
    let decryptIndex = 0;
    // iterate over object keys of decrypted object and decrypt each attribute & value
    while (decryptIndex < (Object.keys(JSON.parse(decryptedObj)).length)) {
      const decryptedAttr = decrypt(attrSK, ivs.attribute, Object.keys(JSON.parse(decryptedObj))[decryptIndex]);
      // update result object
      result = {
        ...result,
        [`${decryptedAttr}`]: decrypt(
          attrSKs[decryptedAttr],
          ivs[decryptedAttr],
          JSON.parse(decryptedObj)[Object.keys(JSON.parse(decryptedObj))[decryptIndex]]
        ),
      }
      decryptIndex += 1;
    }
  }
  console.timeEnd('decrypt-user');
  // return 200; all is good
  return res.status(200).send('OK');
});
// Start application listening on defined port
app.listen(PORT, () => console.log(`port: ${PORT}`));
