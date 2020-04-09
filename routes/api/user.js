const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('config');

const { check, validationResult } = require('express-validator'); // import library for express validator

//let userlist = require('../../data/user.js'); // import userlist object from file
let User = require('../../models/User');

const router = express.Router(); // define router object

// Register User
router.post(
    '/register',
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('email', 'Please enter valid email').isEmail(),
      check('mobile', 'Please enter correct mobile').isLength({
        min: 10
      }),
      check('password', 'please enter password with 8 or more').isLength({
        min: 8
      }),
      check('password1', 'please enter password with 8 or more').isLength({
        min: 8
      }),
      check('is_admin', 'Unable to process request..please contact support').not()
      .isEmpty()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array(), result : 0 });
      }
  
      try {
        //check if user email is already in the database
        let user1 = await User.findOne({ email: req.body.email });
        if (user1) {
          return res.status(400).json({ error: [{ msg: 'user already exits' }], result : 0 });
        }
  
        //create a user
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          is_admin : req.body.is_admin
        });
  
        //hash the password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(req.body.password, salt);
        //save the user
        await newUser.save();
  
        // //generate token
        // const payload = {
        //   user: {
        //     id: newUser.id,
        //     name: newUser.name
        //   }
        // };
  
        // jwt.sign(
        //   payload,
        //   config.get('jwtsecret'),
        //   { expiresIn: 360000 },
        //   (err, token) => {
        //     if (err) throw err;
        //     res.json({ token });
        //   }
        // );
        res.send({'msg':'Login Successful', result : 1});
      } catch (err) {
        res.status(500).send(err.message);
      }
    }
  );


  router.post(
    '/',
    [
      check('email', 'Please include valid email').isEmail(),
      check('password', 'Password is required').exists()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
      try {
        //see if user exists
        let user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'invalid credentials' }] });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'invalid credentials' }] });
        }
        //get user info for payload from mongo
        const payload = {
          user: {
            id: user.id,
            name: user.name
          }
        };
  
        jwt.sign(
          payload,
          config.get('jwtsecret'),
          { expiresIn: 36000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );



// get all users
router.get('/', async(req,res) => {
    try{
        const UserDb = await User.find();
        res.send(UserDb);
    }catch{
        res.status(500).send('Server error');
    }
});



//update user by id
router.get('/login', [
    // check for validations
    check('email', 'Please enter correct email').isEmail(),
    check('password', 'Password longer than 8 chars').isLength({
        min:8
    }),
], async(req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()});
        }

        const salt = bcrypt.genSaltSync();
         
        const get_user = await User.findOne({ email: req.body.email, password : req.body.password});
        console.log(get_user)
        if(!get_user){
            return res.status(404).send('User not found');
        }
        res.send({'msg':'Login Successful'});
            
    }catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
          }
    
  });


//get user by id
router.get('/:id', async(req, res) =>{
    try{
        //const user = userlist.find(u => u.id == req.params.id);
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).send('User not found');

        }
        res.send(user);
    }catch{
        res.status(500).send('Server error');
    }
});


// insert new user
// insert new user

  







//update user by id
router.put('/', [
    // check for validations
    check('email', 'Please enter correct email').isEmail(),
    check('password', 'Password longer than 8 chars').isLength({
        min:8
    }),
    check('name', 'Name is required').not().isEmpty()
], async(req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()});
        }
        const updateUser = await User.findById(req.body.id);
            updateUser.email = req.body.email;
            updateUser.password = req.body.password;
            updateUser.name = req.body.name;
            await updateUser.save();
            res.send('User  updated');

        
            
    }catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
          }
    
  });


//delete user by id
router.delete('/', async(req, res) => {
    try {
      // find the element
      await User.findByIdAndRemove({_id:req.body.id});
      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;