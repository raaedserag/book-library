// Modules
const inquirer = require('inquirer');
const {
    Books_Controller
} = require("./books-controller")
const booksHandler = new Books_Controller()

async function viewMainMenu() {
    try {
        let {
            result
        } = await inquirer.prompt([{
            name: 'result',
            type: 'rawlist',
            message: '======= Books Manager =======',
            choices: ['View all books', 'Add a book', 'Edit a book', 'Search for a book', 'Save and exit']
        }])
        switch (result) {
            case 'View all books':
                viewAllBooks(viewBookById)
                break;

            case 'Add a book':
                addNewBook(backToMainMenu)
                break;
            case 'Edit a book':
                await viewAllBooks(editBook) // next is an empty function
                break;

            case 'Search for a book':
                searchForBook(viewBookById)
                break;

            case 'Save and exit':
                if (booksHandler.saveAll()) console.log("Library saved")
                break;

            default:
                throw new Error("unknown choice");
        }
    } catch (error) {
        console.error(error)
    }
}

async function backToMainMenu() {
    let {
        result
    } = await inquirer
        .prompt([{
            name: 'result',
            type: 'rawlist',
            message: 'return to main menu or exit?',
            choices: ['main menu', 'exit']
        }])
    if (result === 'main menu') return viewMainMenu();
    else process.exit(0)
}

async function viewAllBooks(next) {
    // If no books exist, return to main menu
    if (!booksHandler.booksService.count) {
        console.log("No books exist")
        viewMainMenu()
        return;
    }

    // View all books and prompt for input
    let books = booksHandler.getAllBooks()
    for (let bookId in books) {
        console.log(`[${bookId}] ${books[bookId].title}\n`)
    }
    next()
}

async function viewBookById(next = backToMainMenu) {
    let {
        result
    } = await inquirer.prompt([{
        name: 'result',
        type: 'input',
        message: 'enter book ID'
    }])

    // If no book selected, return to main menu
    if (!result) return backToMainMenu()

    let book = booksHandler.getBookById(result)
    if (!book) return backToMainMenu()

    // view book details
    console.log(`    ID: ${book.id}
    Title: ${book.title}
    Author: ${book.author}
    Description: ${book.description}`)

    next()
}

async function searchForBook(next) {
    console.log("==== Search ====")
    let {
        result
    } = await inquirer.prompt([{
        name: 'result',
        type: 'input',
        message: 'Type in one or more keywords to search for'
    }])
    if (!result) {
        console.log("No keyword entered")
        return backToMainMenu()
    }

    // View search results
    let books = booksHandler.searchByKeyWords(result)
    if (!books) return backToMainMenu()

    for (let book of books) {
        console.log(`[${book.id}] ${book.title}`)
    }
    next()
}

async function addNewBook(next) {
    console.log("==== Add a Book ====\n Please enter the following information:")
    let newBook = await inquirer.prompt([{
        name: 'title',
        type: 'input',
        message: 'Title: '
    }, {
        name: 'author',
        type: 'input',
        message: 'Author: '
    }, {
        name: 'description',
        type: 'input',
        message: 'Description: '
    }])

    newBook = booksHandler.addNewBook(newBook)
    if (newBook) console.log("Saved")

    next()
}

async function editBook(next = backToMainMenu) {
    console.log("==== Edit a Book ====")
    console.log("Enter the book ID of the book you want to edit; to return press <Enter>.")
    let {
        result
    } = await inquirer.prompt([{
        name: 'result',
        type: 'input',
        message: 'book ID: '
    }])

    // If no book selected, return to main menu
    if (!result) return backToMainMenu()

    let book = booksHandler.getBookById(result)
    if (!book) return backToMainMenu()

    // Update some book fields
    console.log("Input the following information. To leave a field unchanged, hit <Enter>")
    let bookUpdates = await inquirer.prompt([{
        name: 'title',
        type: 'input',
        message: `Title [${book.title}]: `
    }, {
        name: 'author',
        type: 'input',
        message: `Author [${book.author}]: `
    }, {
        name: 'description',
        type: 'input',
        message: `Description [${book.description}]: `
    }])

    // update only entered field
    if (booksHandler.updateBook(book, bookUpdates)) console.log("Book saved")

    next()
}



module.exports = {
    viewMainMenu
}