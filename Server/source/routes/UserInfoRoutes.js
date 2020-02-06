var express = require('express');

const dbHelper = require('../database/UserInfoDbHelper');

const router = express.Router();

// Create a new UserInfo
router.post('/create', dbHelper.create);

// Find user by UID
router.post('/find', dbHelper.findOne);

// Retrieve all UserInfo
router.post('/findAll', dbHelper.findAll);

// Update a Note with userInfoId
router.put('/:userInfoId', dbHelper.update);

// Delete a Note with userInfoId
router.delete('/:userInfoId', dbHelper.delete);

module.exports = router;