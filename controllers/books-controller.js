// Modules
const path = require("path")
const {
    Entities_Service
} = require("../services/entity-service")

// Models
const {
    Book
} = require("../models/book-model")

class Books_Controller {
    constructor() {
        this.booksService = new Entities_Service('book', Book, path.join(__dirname, '../books.json'))
    }

    getAllBooks() {
        let books = this.booksService.findById()
        if (!books) console.log("No books exists")
        return books
    }

    getBookById(id) {
        let book = this.booksService.findById(id)
        if (!book) console.log("Invalid book id")
        return book
    }

    searchByKeyWords(keywordsString) {
        let books = this.booksService.search(keywordsString.split(" "))
        if (books.length) return books
        else {
            console.log("No books exist with entered keywords")
            return null
        }
    }

    addNewBook(book) {
        try {
            this.booksService.create(book)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    updateBook(book, bookUpdates) {
        try {
            for (let key in bookUpdates) {
                if (bookUpdates[key].trim() != "") book[key] = bookUpdates[key]
            }
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
    saveAll() {
        try {
            this.booksService.persistAll()
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
}

module.exports = {
    Books_Controller
}