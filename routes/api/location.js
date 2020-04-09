const express = require('express');
const uuidv4 = require('uuid/v4');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

let Location = require('../../models/Location');

const router = express.Router();

router.post(
    '/', auth, 
    [
      check('curr_latitude', 'Location not sent')
        .not()
        .isEmpty(),
      check('curr_longitude', 'Location not sent')
        .not()
        .isEmpty(),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        console.log(req.body);
        const LocationDb = await Location.find();
        res.send(LocationDb);
      } catch (err) {
        res.status(500).send('Server error');
      }
    }
  );


  module.exports = router;