var mongoose = require('mongoose');

const UserInfo = mongoose.Schema({
    uid: String,
    displayName: String,
    phoneNumber: String,
    email: String,
    photoURL: String,
    bean: Number,
    rank: String
})

module.exports = mongoose.model('UserInfo', UserInfo, 'UserInfo');