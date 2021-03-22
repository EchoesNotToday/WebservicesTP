var express = require('express');
var router = express.Router();
var axios = require('axios');
const kafkaHelper = require("../services/kafkaHelper");

var cart = [];


/*GET cart */
router.get(`/cart/`, function(req, res, next) {
    res.send(cart);
});

/* POST add book from cart */
router.post(`/cart`, function (req, res, next) {
    console.log(req.body);
    let idBook = req.body.bookId;
    console.log(`IdBook to add to cart = ${idBook}`);
    cart.push(idBook);
    res.redirect('/')

});


/* PUT validate cart*/
router.put(`/cart/`, function(req, res, next) {
    kafkaHelper.sendEvent(cart, "VALIDATE").then(r => {
        res.send({message: 'Successfully validate cart !'});
        cart = [];
    });
});

module.exports = router;