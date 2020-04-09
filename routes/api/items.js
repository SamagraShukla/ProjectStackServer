const express = require('express');
const uuidv4 = require('uuid/v4');

const { check, validationResult } = require('express-validator');

let itemlist = require('../../models/Item');

const router = express.Router();

//route Get api/items
//desc Get all task
//access public
router.get('/', async (req, res) => {
  try {
      const ItemDb = await itemlist.find();
    res.send(ItemDb);
  } catch (err) {
      console.log(err.message);
    res.status(500).send('Server error');
  }
});

//route Get api/items/:id
//desc Get task by id
//access public
router.get('/:id', async (req, res) => {
  try {
    const item = await itemlist.findById(req.params.id);
    if (!item) {
      return res.status(404).send('item not found');
    }
    res.send(item);
  } catch (err) {
      console.log(err.message);
    res.status(500).send('Server error');
  }
});


//route post api/items
//desc insert item
//access public
router.post('/', [
    check('name').not().isEmpty(),
    check('unit_price').not().isEmpty(),
    check('unit_price').isDecimal(),
    check('category').not().isEmpty()
]
,async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    console.log(req.body);
    const newItem = new itemlist({
      id: uuidv4(),
      name: req.body.name,
      unit_price: req.body.unit_price,
      category: req.body.category,
      description: req.body.description
    });
    const nItem = await newItem.save();
    res.send(nItem);
  } catch (err) {
      console.log(err.message);
    res.status(500).send('Server error');
  }
});

//route delete api/items/:id
//desc delete item by id
//access public
router.delete('/',async(req, res) => {
  try {
      console.log(req.body);
    await itemlist.findByIdAndRemove(req.body.id);
    res.send('Item Deleted');
  } catch (err) {
      console.log(err.message);
    res.status(500).send('Server error');
  }
});

//route update items/:id
//desc update task by id
//access public
router.put('/',async (req, res) => {
    try {
        console.log(req.body);
      const itemup = await itemlist.findByIdAndUpdate(req.body);
      itemup.name = req.body.name;
      itemup.unit_price = req.body.unit_price;
      itemup.category = req.body.category;
      itemup.description = req.body.description;
      await itemup.save();
  
      res.send('item updated');
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;