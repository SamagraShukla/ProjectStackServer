const express = require('express');
const { check, validationResult } = require('express-validator');

let TableBooking = require('../../models/Tablebooking');
const auth = require('../../middleware/auth');

const router = express.Router();

//route Get api/tablebookings
//desc Get all tablebookings
//access public
router.get('/', auth, async (req,res) => {
    try{
        const BookingDB = await TableBooking.find();
        res.json(BookingDB);
    }catch(err){
        res.status(500).send('Server error');
    }
});

//route Get api/tablebookings/:id
//desc Get all tablebookings by id
//access public 
router.get('/:id', auth, async (req,res) => {
    try{
        const booking = await TableBooking.findById(req.params.id);
        if(!booking){
            return res.status(404).send('TableBooking not found');
        }
        res.json(booking);
    }catch(err){
        res.status(500).send('Server error');
    }
});


//route post api/tablebookings
//desc insert technicalquery
//access public 
router.post('/', auth,[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('noOfPerson', 'Number Of Person is required').not().isEmpty()
], async (req,res) => {
    console.log(req.body);
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const newBooking = new TableBooking(
            {
                name: req.body.name,
                email: req.body.email,
                noOfPerson: req.body.noOfPerson,
                specialInstruction:req.body.specialInstruction
                
            }
        );
        
        const nBooking = await newBooking.save();
        res.send(nBooking);
    }catch(err){
        res.status(500).send('Server error');
    }
});


//route update api/tablebookings/:id
//desc update all tablebookings by id
//access public 
router.put('/update/:id', auth, async (req,res) => {
    
    const bookingUpdate = await TableBooking.findById(req.params.id);
    
    bookingUpdate.name = req.body.name;
    bookingUpdate.email = req.body.email;
    bookingUpdate.noOfPerson = req.body.noOfPerson;
    bookingUpdate.specialInstruction = req.body.specialInstruction;
    
    await bookingUpdate.save();
    res.send("Booking updated");
        
});


//route delete api/tablebookings/:id
//desc delete technicalquery by id
//access public 
router.delete('/:id', auth, async (req,res) => {
    try {
        // find the element
        await TableBooking.findByIdAndRemove({_id:req.params.id});    
        res.json({ status:0 , msg: 'Booking deleted' });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    
});


module.exports = router;
