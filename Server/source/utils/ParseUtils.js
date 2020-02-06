var urlParser = require('url');

var parseQuery = function(url) {
    var request = urlParser.parse(url, true);
    var queryData = request.query;

    if(queryData.type) {
        return queryData.type;
    }

    return null;
}

module.exports = parseQuery;