

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var axios = require('axios');
const kafkaHelper = require("../services/kafkaHelper");



/*
GET Kafka test
 */
router.get('/kafka/test', async function (req, res, next) {
    kafkaHelper.run().catch(e => console.error(`test producer ${e.message}`, e))
    res.send().status(200);
});

/* GET home page */
router.get('/', function (req, res, next) {
    res.redirect('orderService/bookmanagement/books');
})


module.exports = router;
