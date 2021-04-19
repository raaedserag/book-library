class Book {
    constructor(book = {
        id,
        title,
        author,
        description
    }) {
        // validate book before create
        if (!this.validate(book)) throw new Error('Error in book schema')
        Object.assign(this, book)
    }
    validate(book) {
        return Number.isInteger(book.id) &&
            typeof book.title == "string" &&
            typeof book.author == "string" &&
            typeof book.description == "string"

    }
}
module.exports = {
    Book
}