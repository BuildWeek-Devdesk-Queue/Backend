const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../data/db-config.js');
const {generateToken} = require('./token.js');

router.post('/register', async (req, res) => {
    try{
        const {username, password, helper, student, email, cohort} = req.body;
        const [id] = await db('users')
            .insert({username,
                    password: bcrypt.hashSync(password, 12),
                    helper,
                    student,
                    email,
                    cohort
            }, 'id');
        const user = await db('users').select('id', 'username').where({id}).first();
        res.status(201).json({id :user.id, username: user.username});
    }catch(err){
        res.status(500).json({message: 'Server could not add user'});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    if(username && password){
        const user = await db('users').where({username}).first();
        if(user && bcrypt.compareSync(password, user.password)){
            const token = generateToken(user);
            res.status(200).json({message: `Welcome ${username}`, token});
        }else{
            res.status(403).json({message: 'Invalid username or password'});
        }
    }else{
        res.status(400).json({message: 'Please provide a username and password'});
    }
});

module.exports = router;