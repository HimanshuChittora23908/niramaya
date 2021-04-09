const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { route } = require('./api');

require('dotenv').config();

const JWT_KEY = process.env.JWT_KEY;

router.post('/signup', (req, res) => {
    const { name, email, password, age, gender } = req.body;
    if( !name || !email || !password || !age || !gender ){
        return res.status(422).json({error: "Please add all the fields"});
    }
    User.findOne({email})
    .then(savedUser => {
        if(savedUser){
            return res.status(422).json({error: "User already exist with that email"});
        }
        bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user  = new User({
                name,
                email,
                password: hashedPassword,
                age,
                gender
            });

            user.save()
            .then(user => {
                res.json({message: "User saved successfully"});
            })
            .catch(err => {
                console.log(err);
            })
        })
    })
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body;
    if( !email || !password ){
        return res.status(422).json({error: "Please add both email and password"})
    }
    User.findOne({email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).json({error: "Invalid email or password"});
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch){
                const token = jwt.sign({_id: savedUser._id}, JWT_KEY)
                const {_id, name, email} = savedUser
                res.json({token: token, user:{_id, name, email}})
            } else {
                return res.status(422).json({error: "Invalid Email or Password"})
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
})

module.exports = router