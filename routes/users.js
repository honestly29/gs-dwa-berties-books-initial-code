// Create a new router
const express = require("express")
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;
    const saltRounds = 10;

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err);
        }
        // sql query to save new user to database
        const sqlInsertUser = "INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES (?,?,?,?,?)";

        // execute sql query
        const newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];

        db.query(sqlInsertUser, newrecord, (err, result) => {
            if (err) {
                return next(err);
            }
            else
                result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email;
                result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
                res.send(result);
        });
    });       
}); 


// List current users in the database
router.get('/list', function(req, res, next) {
    const sqlSelectAllUsers = "SELECT * FROM users"; // query database to get all the users
    db.query(sqlSelectAllUsers, (err, result) => {
        if (err) {
            next(err)
        }
        //console.log(result);
        res.render("listusers.ejs", {users : result});
    });
});

// Export the router object so index.js can access it
module.exports = router
