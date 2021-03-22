var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page book management. */
router.get(`/books`, function (req, res, next) {
    let books = [];
    axios.get('http://127.0.0.1:3001/stockService/books').then((response) => {
        books = response.data;
        res.render('books', {title: 'Book List', bookList: books})
    });


});
/* GET add book view. */
router.get('/addBook', function (req, res, next) {
    res.render('addBook', {title: 'Add Book'});
});

/* POST add new book */
router.post(`/book`, function (req, res, next) {
    let books = [];
    axios.post('http://127.0.0.1:3001/stockService/book', {
        title: req.body.title,
        author: req.body.author
    }, null).then((response) => {
        console.log("data from post = " + response.data);
        books = response.data;
        res.render('books', {title: 'Book List', bookList: books})
    }).catch((error) => {
        console.log(error);
    })
});

module.exports = router;