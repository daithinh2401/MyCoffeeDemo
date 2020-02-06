var express = require('express');
var parseQuery = require('../utils/ParseUtils')
var { getCollection } = require('../database/DbHelper')

const router = express.Router();
router.get('/', (request, response) => {
    var queryType = parseQuery(request.url);

    if(queryType) {
        getCollection(
            queryType,
            (data) => {
                response.status(200).send(data);
            },
            (error) => {
                response.status(404).send(error);
            }
        );
    } else {
        response.status(404).send('Not found !');
    }
});

module.exports = router;