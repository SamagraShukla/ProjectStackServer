const express = require('express');
const { check, validationResult } = require('express-validator');

let TechnicalQuery = require('../../models/Technicalqueries');

const router = express.Router();

//route Get api/technicalqueries
//desc Get all technicalqueries
//access public
router.get('/', async (req,res) => {
    try{
        const QueryDB = await TechnicalQuery.find();
        res.json(QueryDB);
     
    }catch(err){
        res.status(500).send('Server error');
    }
});

//route Get api/technicalqueries/:id
//desc Get all technicalqueries by id
//access public 
router.get('/:id', async (req,res) => {
    try{
        const query = await TechnicalQuery.findById(req.body.id);
        if(!query){
            return res.status(404).send('TechnicalQuery not found');
        }
        res.json(query);
    }catch(err){
        res.status(500).send('Server error');
    }
});


//route post api/technicalqueries
//desc insert technicalquery
//access public 
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('query', 'Query is required').not().isEmpty()
], async (req,res) => {
    console.log(req.body);
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array(),success:0 });
        }
        const newQuery = new TechnicalQuery(
            {
                name: req.body.name,
                email: req.body.email,
                query: req.body.query
            }
        );
        
        const nQuery = await newQuery.save();
        res.send(nQuery);
    }catch(err){
        res.status(500).send('Server error');
    }
});


//route update api/technicalqueries/:id
//desc update all technicalqueries by id
//access public 
router.put('/update/:id', async (req,res) => {
    
    const queryUpdate = await TechnicalQuery.findById(req.body.id);
    
    queryUpdate.name = req.body.name;
    queryUpdate.email = req.body.email;
    queryUpdate.query = req.body.query;
    
    await queryUpdate.save();
    res.send("Query updated");
        
});


//route delete api/technicalqueries/:id
//desc delete technicalquery by id
//access public 
router.delete('/:id', async (req,res) => {
    try {
        // find the element
        await TechnicalQuery.findByIdAndRemove({_id:req.body.id});    
        res.json({ msg: 'Query deleted' });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    
});


module.exports = router;