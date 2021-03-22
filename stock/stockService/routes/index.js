var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const basePath = "/stockService";
const Book = require('../persistence/book.model');
const Author = require('../persistence/author.model');

const ip = require('ip');

const host = ip.address();
console.log(`Set host to ${host}`);

const {Kafka} = require('kafkajs');

const kafka = new Kafka({
    clientId: 'webservice',
    brokers: [`${host}:9092`]
});

/*
GET Kafka message
 */

const consumer = kafka.consumer({groupId: 'test-group'});

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({topic: 'topic-test', fromBeginning: true});
    await consumer.run({
            autoCommitThreshold: 1,
            eachMessage: async ({topic, partition, message}) => {
                console.log(`Kafka received message : ${message.value.toString()}`)
                let event = message.key.toString();
                let ids = JSON.parse(message.value.toString());
                console.log(typeof ids);
                console.log("JSON parsed ids = " + ids);
                if (event === "VALIDATE") {
                    for (let id of ids) {
                        console.log("Book id to retrieve = " + id);
                        let book;
                        Book.findById(id, (err, result) => {
                            if (err) {
                                console.log(`Error while finding book in DB = ${err}`);
                            } else {
                                book = result;
                                console.log("Result Stringify = " + JSON.stringify(result))
                            }
                            if (result = !undefined) {
                                console.log(`Book stock before update = ${book.book_stock}`)
                                console.log(`result bookStock = ${result.bookStock}`);
                                book.book_stock--;
                                console.log(`Book stock after update = ${book.book_stock}`)
                                Book.updateById(id, book, (err, updated) => {
                                    if (err)
                                        console.log(`Error while updating db = ${err}`);
                                });
                            }
                        });
                    }
                }
            }
        }
    )
}
run().catch(e => console.error(`test consumer ${e.message}`, e));

/* GET books. */
router.get(`${basePath}/books`, function (req, res, next) {
    Book.getAll((err, data) => {
        let books = [];
        for (let i = 0; i < data.length; i++) {
            let book = mapBDDToDto(data[i]);
            books.push(book);
        }
        res.responseType = 'json';
        res.json(books);

    });
});
/* POST a new book */
router.post(`${basePath}/book`, function (req, res, next) {
    let newBook = req.body;
    Author.findByName(newBook.author, (err, data) => {
        let author = new Author(req.body.author);
        if (err) {
            if (err.kind === "not_found") {
                Author.create(author, (error, authorCreateData) => {
                    author.id = authorCreateData.author_id;
                })
            } else {
                res.status(500).send;
            }
        }
        author.id = data.author_id;
        Book.findByTitle(req.body.title, (bookTitleErr, bookTitleResult) => {
            if (bookTitleErr) {
                if (bookTitleErr.kind === "not_found") {
                    let book = new Book(newBook, author);
                    Book.create(book, (err, result) => {
                        if (err) {
                            res.status(500).send;
                        }
                    });

                }
            } else {
                res.status(500).send;
            }
        });
    });
    Book.getAll((err, data) => {
        let books = [];
        for (let i = 0; i < data.length; i++) {
            book = new Object();
            book.authorName = data[i].author_name;
            book.authorId = data[i].author_id;
            book.bookId = data[i].book_id;
            book.bookTitle = data[i].book_title;
            book.bookStock = data[i].book_stock;
            books.push(book);
        }
        res.status(201).json(books);
    });
});

/* GET a book from id */
router.get(`${basePath}/book/:id`, function (req, res, next) {
    let bookId = req.params.id;
    let book = mapBDDToDto(Book.findById(bookId));
    res.responseType = 'json';
    res.json(book);
})


function mapBDDToDto(bookFromBD) {
    let book = {};
    book.authorName = bookFromBD.author_name;
    book.authorId = bookFromBD.author_id;
    book.bookId = bookFromBD.book_id;
    console.log(`id book = ${bookFromBD.book_id}`);
    book.bookTitle = bookFromBD.book_title;
    book.bookStock = bookFromBD.book_stock;
    return book;
}

module.exports = router;
