const express = require('express');
const { check, validationResult } = require('express-validator');

let Inventory = require('../../models/Inventory');

const router = express.Router();

//route Get api/inventories
//desc Get all inventories
//access public
router.get('/', async (req,res) => {
    try{
        const InventoryDB = await Inventory.find();
        res.json(InventoryDB);
    }catch(err){
        res.status(500).send('Server error');
    }
});

//route Get api/inventories/:id
//desc Get all inventories by id
//access public 
router.get('/:id', async (req,res) => {
    try{
        const inventory = await Inventory.findById(req.params.id);
        if(!inventory){
            return res.status(404).send('inventory not found');
        }
        res.json(inventory);
    }catch(err){
        res.status(500).send('Server error');
    }
});


//route post api/inventories
//desc insert inventories
//access public 
router.post('/', [
    check('product', 'Product is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('quantity', 'Quantity is required').not().isEmpty()
], async (req,res) => {
    console.log(req.body);
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const newInventory = new Inventory(
            {
                product: req.body.product,
                description: req.body.description,
                quantity: req.body.quantity,
                buyingPrice: req.body.buyingPrice  
            }
        );
        
        const nInventory = await newInventory.save();
        res.send(nInventory);
    }catch(err){
        res.status(500).send('Server error');
    }
});


//route update api/inventories/:id
//desc update all inventories by id
//access public 
router.put('/update/:id', async (req,res) => {
    
    const inventoryUpdate = await Inventory.findById(req.params.id);
    
    inventoryUpdate.product = req.body.product;
    inventoryUpdate.description = req.body.description;
    inventoryUpdate.quantity = req.body.quantity;
    inventoryUpdate.buyingPrice = req.body.buyingPrice;
    
    await inventoryUpdate.save();
    res.send("inventory updated");
        
});


//route delete api/inventories/:id
//desc delete all inventorie by id
//access public 
router.delete('/:id', async (req,res) => {
    try {
        // find the element
        await Inventory.findByIdAndRemove({_id:req.params.id});    
        res.json({ status:0 ,msg: 'Inventory deleted' });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    
});


module.exports = router;