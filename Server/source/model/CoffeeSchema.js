var mongoose = require('mongoose');

var new_screen_1        = mongoose.Schema({});
var new_screen_2        = mongoose.Schema({});
var new_screen_3        = mongoose.Schema({});
var stores_data         = mongoose.Schema({});
var test_drinks_data    = mongoose.Schema({});

module.exports =  {
    new_screen_1: mongoose.model('new_screen_1', new_screen_1, 'new_screen_1'),
    new_screen_2: mongoose.model('new_screen_2', new_screen_2, 'new_screen_2'),
    new_screen_3: mongoose.model('new_screen_3', new_screen_3, 'new_screen_3'),
    stores_data: mongoose.model('stores_data', stores_data, 'stores_data'),
    test_drinks_data: mongoose.model('test_drinks_data', test_drinks_data, 'test_drinks_data')
}