const {
    Book_Service
} = require("../services/books-service")

class Books_Controller {
    constructor() {
        this.booksService = new Book_Service()
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
            this.booksService.addBook(book)
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