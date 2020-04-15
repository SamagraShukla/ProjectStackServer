const express = require('express');
const uuidv4 = require('uuid/v4');
const { check, validationResult } = require('express-validator');
const sortByDistance = require('sort-by-distance')
const auth = require('../../middleware/auth');

let Location = require('../../models/Location');

const router = express.Router();

router.post(
    '/', 
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
        points = []
        LocationDb.forEach(function(value){
          object = {
            "longitude" : value["longitude"],
            "latitude" : value["latitude"],
            "franchise_name" : value["franchise_name"],
            "address" : value["address"]
          }
          points.push(object)
        }); 
      const opts = {
        yName: 'latitude',
        xName: 'longitude'
    }
    const origin = { longitude: req.body["curr_longitude"], latitude: req.body["curr_latitude"]}
    console.log(sortByDistance(origin, points, opts))

    res.send(sortByDistance(origin, points, opts)).slice(5)

      

        // res.send(LocationDb);
      } catch (err) {
        res.status(500).send('Server error');
      }
    }
  );


  module.exports = router;
