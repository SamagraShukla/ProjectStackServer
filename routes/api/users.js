const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

let User = require('../../models/User');

//new user
//route post api/tasks
//desc insert task
//access public
router.post(
    '/',
    [
      check('email', 'Please enter valid email').isEmail(),
      check('password', 'please enter password with 3 or more').isLength({
        min: 3
      }),
      check('full_name', 'Name is required').not().isEmpty(),
      check('phone','Please Enter valid Phone Number').not().isEmpty().isMobilePhone()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
  
      try {
        //check if user email is already in the database
        let user1 = await User.findOne({ email: req.body.email });
        if (user1) {
          return res.status(400).json({ error: [{ msg: 'user already exits' }] });
        }
  
        //create a user
        const newUser = new User({
          full_name: req.body.full_name,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone
        });
  
        //hash the password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(req.body.password, salt);
        //save the user
        await newUser.save();
  
        //generate token
        const payload = {
          user: {
            id: newUser.id,
            email: newUser.email
          }
        };
  
        jwt.sign(
          payload,
          config.get('jwtsecret'),
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        res.status(500).send(err.message);
      }
    }
  );

//user login
router.post(
    '/login',
    [
      check('email', 'Please enter valid email').isEmail(),
      check('password', 'please enter password with 3 or more').isLength({
        min: 3
      })
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
  
      try {
        //check if user email is already in the database
        let user1 = await User.findOne({ email: req.body.email });
        if(user1){
          const match = await bcrypt.compare(req.body.password, user1.password);
  
        if (!match) {
          return res.status(400).json({ error: [{ msg: 'Inavlid password' }] });
        }
  
        //generate token
        const payload = {
          user: {
            email: user1.email,
            password: user1.password
          }
        };
  
        jwt.sign(
          payload,
          config.get('jwtsecret'),
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
        }
        else{
          return res.status(400).json({ error: [{ msg: 'Inavlid Login details' }] });
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
    }
  );

module.exports = router;