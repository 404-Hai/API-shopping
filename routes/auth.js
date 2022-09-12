const express = require('express');
const router = express.Router();
const User = require("../models/User")
var CryptoJS = require("crypto-js");
const dotenv = require("dotenv")
var jwt = require('jsonwebtoken');

//Register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SEC).toString()
    })
    try {
        const saveUser = await newUser.save();
        res.status(201).json(saveUser);
    } catch (error) {
        res.status(500).json(error)
    }

})

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong credentials!")

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.SEC
        );
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        OriginalPassword !== req.body.password &&
            res.status(401).json("Wrong credentials!")

        const accessToken = jwt.sign(
            {
                id: user._id,
            isAdmin: user.isAdmin
            },
            process.env.JWT_SEC,
            {expiresIn: "3d"}
        )
        const {password, ...orther } = user._doc;
        res.status(200).json({...orther, accessToken});

    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router