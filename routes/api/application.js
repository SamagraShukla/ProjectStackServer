const express = require('express');

let application = require('../../models/application');
const router = express.Router();
const validatePhoneNumber = require('validate-phone-number-node-js');   //  npm i validate-phone-number-node-js
const { check, validationResult } = require('express-validator');

const config = require('config');


//route Get api/application
//desc Gets all applications
//access public,but will be usable only to admin later
router.get('/', async (req,res) =>{
    try{
        
        const appDb = await application.find();
        res.send(appDb);
        
    }catch(err){
        res.status(500).send('Server Error');
    }
});


//route Get api/application/:email
//desc Get job applications by email applied with
//access public
router.get('/:email', async (req, res) => {
    try {
      //const task = tasklist.find(t => t.id == req.params.id);
      const app = await application.findById(req.params.email);
      if (!app) {
        return res.status(404).send('application not found');
      }
      res.send(app);
    } catch (err) {
      console.log(err)
      res.status(500).send('Server error');
    }
  });


//route post api/application
//desc insert job application
//access public
router.post('/',[
  check('firstname','Name is required').not().isEmpty(),
  check('email','Please enter valid email').isEmail()
], async (req, res) => {
    
    //npm i validate-phone-number-node-js
    //const result = validatePhoneNumber.validate(req.body.phone);    //validate phone number

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
   /* if (!result) {
        return res.status(422).json({ errors: 'invalid phone number' });    //
      }
      */

    try {
      //check if user email is already in the database
      let app1 = await application.findOne({ email: req.body.email });
      if (app1) {
        return res.status(400).json({ error: [{ msg: 'application for this email id already exits' }] });
      }
      console.log(req.body);
       const newApp = application({

        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        position: req.body.position,
        resume: req.body.resume
        
      });
      const nApp = await newApp.save();
      res.send(nApp);


    } catch (err) {
      console.log(err)
      res.status(500).send('Server error');
    }
  });
  
  //route delete api/application/:email
  //desc delete application by email
  //access by admin
  router.delete('/', async (req, res) => {
    try {
      // find the element
      await User.findByIdAndRemove({ _email: req.body.email });
  
      res.json({ msg: 'application deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  
  module.exports = router;