const sql = require("./db.js");

const Author = function (author) {
    this.author_name = author;
}

Author.create = (newAuthor, result) => {
    sql.query("INSERT INTO author SET ?", newAuthor, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created newAuthor: ", {id: res.insertId, ...newAuthor});
        result(null, {id: res.insertId, ...newAuthor});
    });
}

Author.findById = (authorId, result) => {
    sql.query(`SELECT * FROM author WHERE author_id = ${authorId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found author: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Author with the id
        result({ kind: "not_found" }, null);
    });
};

Author.findByName = (authorName, result) => {
    console.log("author name in query = " + authorName);
    sql.query(`SELECT * FROM author WHERE author_name = '${authorName}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found author: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Author with the id
        result({ kind: "not_found" }, null);
    });
};

Author.getAll = result => {
    sql.query("SELECT * FROM author", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("authors: ", res);
        result(null, res);
    });
};

Author.updateById = (id, author, result) => {
    sql.query(
        "UPDATE author SET author_name = ? WHERE author_id = ?",
        [author.name, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Author with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated author: ", { id: id, ...author });
            result(null, { id: id, ...author });
        }
    );
};

module.exports = Author;