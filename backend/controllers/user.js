const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//Register

exports.signup = (req, res, next) => {
//Hash le mdp avant de le stocker
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
//Crée un user avec mdp hashé
            const user = new User({
                email: req.body.email,
                password: hash
            });
//Enregistre l'user dans MongoDB
            user.save()
                .then(() => {
                    res.status(201).json({ message: "User created succesfully" })
                })
                .catch((error) => {
                    res.status(400).json({ error })
                })
        }) 
        .catch((error) => {
            res.status(500).json({ error })
        })
}

//Login

exports.login = (req, res, next) => {
//Recherche de l'user grace a l'email
    User.findOne({email: req.body.email})
    .then((user) => {
//Vérification de la présence de l'user dans MongoDB        
        if(!user) {
            return res.statut(401).json({ message: "Invalid email or password" })
        }
//Compare le mdp        
        bcrypt.compare(req.body.password, user.password)
        .then((valid) => {
//Vérification du mdp             
            if(!valid){
                return res.status(401).json({ message: "Invalid email or password" })
            }
//Génere le token         
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                )
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error });
        });
    })
    .catch((error) => {
        console.error(error);
        res.status(500).json({ error });
    });
}