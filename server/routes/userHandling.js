var express = require('express');
const bcrypt = require('bcryptjs');

var router = express.Router();

const User = require("./../db/models/User.model");

const check = require("./../src/Checkers");

module.exports = router.post('/api/user-create', async (req, res) => {
    if (req.body.username == '' || (/\s/.test(req.body.username)))
        res.send({ username: 'ko' });
    if (req.body.email == '' && req.body.password == '')
        res.send({ email: 'ko', password: 'ko' });
    else if (req.body.email == '' && req.body.password != '')
        res.send({ email: 'ko', password: 'ok' });
    else if ((req.body.email == '' || check.ValidateEmail(req.body.email) == false) && req.body.password == '')
        res.send({ email: 'ko', password: 'ko' });
    else if ((req.body.email == '' || check.ValidateEmail(req.body.email) == false) && req.body.password != '')
        res.send({ email: 'ko', password: 'ok' });
    else if ((check.ValidateEmail(req.body.email) == true) && (req.body.password == '' || req.body.password.length <= 6))
        res.send({ email: 'ok', password: 'ko' });
    else {
        const userExists = await User.exists({ email: req.body.email });
        if (userExists)
            res.send({ email: 'exist', password: '' });
        else {
            let hashedPassword = bcrypt.hashSync(req.body.password, 10);
            const user = new User({ username:req.body.username, email: req.body.email, password: hashedPassword});
            user.save().then(() => console.log("User created"));
            res.send({ email: 'ok', password: 'ok' });
        }
    }
});

module.exports = router.post('/api/user-login', async (req, res) => {
    if (req.body.email == '' && req.body.password == '')
        res.send({ email: 'ko', password: 'ko' });
    else if (req.body.email == '' && req.body.password != '')
        res.send({ email: 'ko', password: 'ok' });
    else if ((req.body.email == '' || check.ValidateEmail(req.body.email) == false) && req.body.password == '')
        res.send({ email: 'ko', password: 'ko' });
    else if ((req.body.email == '' || check.ValidateEmail(req.body.email) == false) && req.body.password != '')
        res.send({ email: 'ko', password: 'ok' });
    else if ((check.ValidateEmail(req.body.email) == true) && req.body.password == '')
        res.send({ email: 'ok', password: 'ko' });
    else {
        const userExists = await User.exists({ email: req.body.email});
        const userLogged = await User.findOne({ email: req.body.email});
        if (userExists && bcrypt.compareSync(req.body.password, userLogged.password)) {
            res.send({ email: 'exist', password: 'exist', id: userLogged.id });
        } else {
            res.send({ email: 'no exist', password: 'no exist' });
        }
    }
});