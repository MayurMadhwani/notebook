const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser')
//Route 1 create user using post : "/api/auth/createuser". No login required

const JWT_SECRET = "Mayurisagoodprogrammer";

router.post('/createuser',[
    
    body('name', 'Enter a valid name').isLength({min:3}),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atleat 5 characters').isLength({min:5}),

],  async(req, res)=>{
    //If there are errors, return the bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Check whether the user with this email exists already
    
    try {
        
        let user = await User.findOne({email:req.body.email});

        if(user){
            return res.status(400).json({error: "Sorry this user already exists"})
        }
        //password encryption
        const salt = await bcrypt.genSalt(10);
        const secPas = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            password: secPas,
            email: req.body.email,
        })

        const data = {
            user:{
                id: user.id,
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        
        // res.json(user);
        res.json(authToken); 

    }catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

//Route 2 authenticate a user using post : "/api/auth/login". No login required

router.post('/login',[
    
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),

],  async(req, res)=>{

    //If there are errors, return the bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    
    try {
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({error: "Please try to login with correct Credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if(!passwordCompare){
            return res.status(400).json({error: "Please try to login with correct Credentials"});
        }

        const data = {
            user:{
                id: user.id,
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json(authToken);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

//Route 3 Get loggedin User Details post : "/api/auth/getUser" Login Required
router.post('/getUser', fetchUser, async(req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router