const sql = require("./db");

const Book = function (book, author) {
    this.book_title = book.title;
    this.book_stock = 20;
    this.fk_author_id = author.id;

}

Book.create = (newBook, result) => {
    sql.query("INSERT INTO book SET ?", newBook, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created newBook: ", {id: res.insertId, ...newBook});
        result(null, {id: res.insertId, ...newBook});
    });
}

Book.findById = (bookId, result) => {
    sql.query(`SELECT * FROM book JOIN author ON book.fk_author_id = author.author_id WHERE book_id = ${bookId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found book: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Book with the id
        result({ kind: "not_found" }, null);
    });
};

Book.findByTitle = (bookTitle, result) => {
    sql.query(`SELECT * FROM book JOIN author ON book.fk_author_id = author.author_id WHERE book_title = '${bookTitle}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found book: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Book with the id
        result({ kind: "not_found" }, null);
    });
};

Book.getAll = result => {
    sql.query("SELECT * FROM book JOIN author ON book.fk_author_id = author.author_id ", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("books: ", res);
        result(null, res);
    });
};

Book.updateById = (id, book, result) => {
    sql.query(
        "UPDATE book SET book_stock = ? WHERE book_id = ?",
        [book.book_stock, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found book with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated book: ", { id: id, ...book });
            result(null, { id: id, ...book });
        }
    );
};

module.exports = Book;