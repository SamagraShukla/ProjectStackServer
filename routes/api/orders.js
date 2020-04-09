const express = require('express');
const uuidv4 = require('uuid/v4');

const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
let orderlist = require('../../models/Order');

const router = express.Router();

//route Get api/orders
//desc Get all orders
//access public
router.get('/',auth ,async (req, res) => {
    try {
        const OrderDb = await orderlist.find();
      res.send(OrderDb);
    } catch (err) {
        console.log(err.message);
      res.status(500).send('Server error');
    }
  });

  //route Get api/orders/:id
//desc Get order by id
//access public
router.get('/:id',auth, async (req, res) => {
    try {
      const order = await orderlist.findById(req.params.id);
      if (!order) {
        return res.status(404).send('order not found');
      }
      res.send(order);
    } catch (err) {
        console.log(err.message);
      res.status(500).send('Server error');
    }
  });

  //route post api/orders
//desc insert order
//access public
router.post('/', [
    check('order_items').not().isEmpty(),
    check('email').not().isEmpty(),
    check('phone').not().isEmpty(),
    check('Total').isDecimal()
]
,auth,async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    console.log(req.body);
    const newOrder = new orderlist({
      id: uuidv4(),
      order_items: req.body.order_items,
      email: req.body.email,
      phone: req.body.phone,
      Total: req.body.Total,
      special_instructions: req.body.special_instructions,
      status: req.body.status
    });
    const nOrder = await newOrder.save();
    res.send(nOrder);
  } catch (err) {
      console.log(err.message);
    res.status(500).send('Server error');
  }
});

//route delete api/orders/:id
//desc delete order by id
//access public
router.delete('/',auth,async(req, res) => {
    try {
        console.log(req.body);
      await orderlist.findByIdAndRemove(req.body.id);
      res.send('Order Deleted');
    } catch (err) {
        console.log(err.message);
      res.status(500).send('Server error');
    }
  });

//route update order/:id
//desc update order by id
//access public
router.put('/',auth,async (req, res) => {
    try {
        console.log(req.body);
      const orderup = await orderlist.findByIdAndUpdate(req.body);
      orderup.order_items = req.body.order_items;
      orderup.Total = req.body.Total;
      orderup.special_instructions = req.body.special_instructions;
      await orderup.save();
  
      res.send('order updated');
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
