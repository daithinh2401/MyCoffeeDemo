var mongoose = require('mongoose');
require('dotenv/config')
const { new_screen_1, new_screen_2, new_screen_3, stores_data, test_drinks_data } = require('../model/CoffeeSchema');

let collectionMap = new Map([
    ['new_screen_1', new_screen_1],
    ['new_screen_2', new_screen_2],
    ['new_screen_3', new_screen_3],
    ['stores_data', stores_data],
    ['test_drinks_data', test_drinks_data],
])

connectDatabase = () => {
    mongoose.connect(
        process.env.DB_CONNECTION,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        },
        (error, db) => {
            if(error) {
                console.log(error);
                return;
            }
            databaseClient = db;
            console.log('Database Connected !');
        }
    )
}

// Retrieve all UserInfo from the database.
getCollection = (type, success, failed) => {
    var model = collectionMap.get(type);

    if(model) {
        model.findOne()
        .then(userInfo => {
            if(userInfo) {
                success(userInfo.toJSON().data);
            } else {
                failed('Not found !');
            }
        }).catch(err => {
            failed(err.message);
        });
    }
};

module.exports = {
    connectDatabase,
    getCollection
}