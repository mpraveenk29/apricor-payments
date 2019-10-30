const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    }
});



const User = mongoose.model('User', userSchema);

const userRegister = (req, res, next) => {
    try {
        const user = new User(req.body);
        user.save(() => {
            res.status(201).send(user);
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

const userLogin = (req, res, next) => {
    //Login a registered user
    try {
        const { email, password } = req.body;
        User.find({email, password}, (err, user) => {
            if (!user || user.length === 0) {
                return res.status(401).send({error: 'Login failed! Check authentication credentials'})
            } else {
                // need to create token here
                res.send({
                    name: user[0].name,
                    token: jwt.sign({
                        userId: user[0]._id
                    }, 'apricorsecret', { expiresIn: 60 * 60 })
                });
            }
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

const userAuth = (req, res, next) => {
    try {
        if (req.body && req.body.token) {
            decoded = jwt.verify(token, 'apricorsecret');
            req.body.user = decoded.userId;
            next();
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports = {
    userRegister: userRegister,
    userLogin: userLogin,
    userAuth: userAuth
}
