const UserInfo = require('../model/UserSchema');

getUserRankByBean = (bean) => {
    if(bean < 500) {
        return "Thành viên thường";
    }
    if(bean < 1000) {
        return "Thành viên bạc";
    }
    if(bean < 1500) {
        return "Thành viên vàng";
    }

    return "Thành viên kim cương";
}

//Create new UserInfo
exports.create = (req, res) => {
    // Request validation
    if(!req.body || !req.body.uid) {
        return res.status(400).send({
            message: "Body not valid !"
        });
    }

    // Create a UserInfo
    const userInfo = new UserInfo({
        uid: req.body.uid,
        displayName: req.body.displayName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        photoURL: req.body.photoURL,
        bean: 0,
        rank: getUserRankByBean(0),
    });

    // Save UserInfo in the database
    userInfo.save()
    .then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while creating the userInfo."
        });
    });
};

// Retrieve all UserInfo from the database.
exports.findAll = (req, res) => {
    // Request validation
    if(!req.body) {
        return res.status(400).send({
            message: "Body not valid !"
        });
    }

    let request_key = req.body.request_key;
    if(request_key != 'my_coffee_demo') {
        return res.status(400).send({
            message: "Key not valid !"
        });
    }

    UserInfo.find()
    .then(userInfo => {
        res.send(userInfo);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while retrieving UserInfo."
        });
    });
};

// Find a single UserInfo with a uid
exports.findOne = (req, res) => {
    let body = req.body;

    // Request validation
    if(!body || !body.uid) {
        return res.status(400).send({
            message: "UserInfo content can not be empty"
        });
    }

    let uid_find = body.uid;

    UserInfo.findOne({uid: uid_find})
    .then(userInfo => {
        if(!userInfo) {
            return res.status(404).send({
                message: "UserInfo not found with UID " + uid_find
            });            
        }
        res.send(userInfo);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "UserInfo not found with UID " + uid_find
            });                
        }
        return res.status(500).send({
            message: "Something wrong retrieving user with UID " + uid_find
        });
    });
};

// Update a UserInfo
exports.update = (req, res) => {
    // Validate Request
    if(!req.body || !req.body.uid) {
        return res.status(400).send({
            message: "Body not valid !"
        });
    }

    let {uid, displayName, phoneNumber, email, photoURL, bean} = req.body;
    let data = {};
    if(displayName) {
        data.displayName = displayName;
    }
    if(phoneNumber) {
        data.phoneNumber = phoneNumber;
    }
    if(email) {
        data.email = email;
    }
    if(photoURL) {
        data.photoURL = photoURL;
    }
    if(bean) {
        data.bean = bean;
        data.rank = getUserRankByBean(bean);
    }

    // Find and update product with the request body
    UserInfo.findOneAndUpdate(uid, data,
    {upsert: true})
    .then(userInfo => {
        if(!userInfo) {
            return res.status(404).send({
                message: "UserInfo not found with id " + uid
            });
        }
        res.status(200).send({ message: "Success !" });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "UserInfo not found with id " + uid
            });                
        }
        return res.status(500).send({
            message: err
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    UserInfo.findByIdAndRemove(req.params.uid)
    .then(userInfo => {
        if(!userInfo) {
            return res.status(404).send({
                message: "UserInfo not found with id " + req.params.uid
            });
        }
        res.send({message: "UserInfo deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "UserInfo not found with id " + req.params.uid
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.uid
        });
    });
};