const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const config = require('config');

let Coupon = require('../../models/Coupon');



//create a Coupon (admin portion) not in scope
router.post(
  '/',
  [
    check('amount', 'Please enter valid amount').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      let isExistDiscount = false
      do {
        let myDiscountCode = coupongenerator()
        let newDiscountCode = new DiscountCode({
          code: myDiscountCode,
          isPercent: false,
          amount: [{ CAD: 5 }],
          expireDate: '',
          isActive: true
        })
        newDiscountCode.save(function (err) {
          if (err) {if (err.name === 'MongoError' && err.code === 11000) {
            
            // Duplicate code detected
            isExistDiscount = true;
          }
        }
        res.send(newDiscountCode)
      })
    }
    while (isExistDiscount);

      //save the Coupon
      await myDiscountCode.save();

    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);



//find a Coupon to retieve details (used before applying a coupon to a cart)
router.get('/:code', async (req, res) => {
  try {
    //const task = tasklist.find(t => t.id == req.params.id);
    const coupon = await Coupon.findById(req.params.code);
    if (!coupon) {
      return res.status(404).send('coupon not found');
    }
    res.send(coupon);
  } catch (err) {
    console.log(err)
    res.status(500).send('Server error');
  }
});


//Delete the existing coupon (in case of one time usage/ or removal of coupons by admin)

router.delete('/', async (req, res) => {
  try {
    await Coupon.findByIdAndRemove({ _id: req.body.id });
    res.json({ msg: 'Coupon deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
