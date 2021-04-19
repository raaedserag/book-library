// Modules
const fs = require('fs'),
    path = require("path"),
    booksFilePath = path.join(__dirname, './books.json'),
    debug = require("debug")("services:entities")
// Models
const {
    Book
} = require("../models/book-model")

class Book_Service {
    constructor() {
        // books list stored as JSON object {bookId: book}
        this.loadAll() // load persistant books on initilization
        debug(`Service initialized with ${this.booksCount} books`)

        // uncomment this lines to persist library on exit or termination events
        /* process.on("exit", () => this.persistAll)
            .on("SIGINT", () => this.persistAll)
            .on("SIGTERM", () => this.persistAll) */
    }

    // define getter for books count
    get booksCount() {
        return Object.keys(this.booksList).length
    }


    // find certain book using id, null to get all
    findById(id = null) {
        return id ? this.booksList[id] : this.booksList
    }

    // search for books which attributes values contains the searching keyword
    search(keyWords) {
        let results = []
        for (let bookId in this.booksList) {
            let book = this.booksList[bookId]
            if (keyWords.some(k => book.title.includes(k))) results.push(book)
            else if (keyWords.some(k => book.author.includes(k))) results.push(book)
            else if (keyWords.some(k => book.description.includes(k))) results.push(book)
        }
        return results;
    }

    // insert new book with generated id dependent on booksList length
    addBook(bookObject = {
        title,
        author,
        description
    }) {
        bookObject.id = this.booksCount + 1
        this.booksList[bookObject.id] = new Book(bookObject)
    }

    persistAll() {
        fs.writeFileSync(booksFilePath, JSON.stringify(this.booksList, null, 2))
    }

    loadAll() {
        // Load all books from books file, on error load empty object
        try {
            this.booksList = require(booksFilePath) // requiring instead of reading to handle json file object
        } catch (error) {
            debug(`Can't load books file ${error}`)
            this.booksList = {}
        }
    }
}

module.exports = {
    Book_Service
}