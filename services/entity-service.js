// Modules
const fs = require('fs'),
    debug = require("debug")("services:entities")

class Entities_Service {
    constructor(modelName, Model, persistancePath) {
        this.modelName = modelName
        this.Model = Model
        this.persistancePath = persistancePath

        // entities list stored as JSON object {id: entity}
        this.loadAll() // load persistant entities on initilization
        debug(`Service initialized with ${this.count} ${this.modelName}s`)

        // uncomment this lines to persist library on exit or termination events
        /* process.on("exit", () => this.persistAll)
            .on("SIGINT", () => this.persistAll)
            .on("SIGTERM", () => this.persistAll) */
    }

    // define getter for entities count
    get count() {
        return Object.keys(this.entitiesList).length
    }


    // find certain entity using id, null to get all
    findById(id = null) {
        return id ? this.entitiesList[id] : this.entitiesList
    }

    // search for entities which attributes values contains the searching keyword
    search(keyWords) {
        let results = []
        for (let entityId in this.entitiesList) {
            if (Object.values(this.entitiesList[entityId])
                .some(value => keyWords
                    .some(word => value.toString()
                        .includes(word)))) {
                results.push(this.entitiesList[entityId])
            }
        }
        return results;
    }

    // insert new entity with generated id dependent on entities count
    create(entity) {
        entity.id = this.count + 1
        this.entitiesList[entity.id] = new this.Model(entity)
    }

    persistAll() {
        fs.writeFileSync(this.persistancePath, JSON.stringify(this.entitiesList, null, 2))
    }

    loadAll() {
        // Load all entities from persistant file, on error load empty object
        try {
            this.entitiesList = require(this.persistancePath) // requiring instead of reading to handle json file object
        } catch (error) {
            debug(`Can't load file ${error}`)
            this.entitiesList = {}
        }
    }
}

module.exports = {
    Entities_Service
}