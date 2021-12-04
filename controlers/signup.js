const User = require('../models/users');
const brisi = require('../util/brisi');
const path = require('path'); //definiranje na patot
const bcrypt = require('bcryptjs');


exports.User = (req, res, next) => {
    res.render('signup', {   
        Logiran: req.session.Logiran, user: req.session.user, 
        Logiran_Emp: req.session.Logiran_Emp, employee: req.session.employee,
        naslov: 'Форма за нов корисник',
        еrrorMessage: req.flash('error')
    });   
};

exports.loginUser = (req, res, next) => {
    res.render('login', {   
        Logiran: req.session.Logiran, user: req.session.user, 
        Logiran_Emp: req.session.Logiran_Emp, employee: req.session.employee,
        naslov: 'Ве молиме најавете се во системот'
    });   
};

exports.logoutUser = (req, res, next) => {      
        req.session.destroy(() => {
            res.redirect('/')
        });      
      
};

exports.dodajUser = (req, res, next) => {
    const ime = req.body.ime;
    const email = req.body.email;  
    const password = req.body.password;
    User.findOne({email: email})
    .then( ima => {
        if (ima) {
            let poraka = req.flash;
            req.flash('error', 'Постои регистриран корисник со оваа e-mail адреса')
            return res.redirect('/signup')
        }
        return bcrypt.hash(password, 12)
       .then(hashedPasword => {
            const user = new User ({
                ime: ime,
                email: email,
                password: hashedPasword
            });
            return user.save()
            .then( result => {
            res.redirect('/')
            });
        })
    })
    .catch( err => {
        console.log(err)
    })
    
    
}


exports.proveriUser = (req, res, next) => {
    const email = req.body.email;  
    const password = req.body.password;
    User.findOne({email: email})
    .then( user => {
        if (!user) {
           
            return res.redirect('/login')
        }              
        bcrypt.compare(password, user.password) 
       .then(ednakov => {
           if (ednakov) {
               req.session.Logiran = true;
               req.session.user = user;
               return res.redirect('/department');
           }
           return res.redirect('/login')         
        })
    })
    .catch( err => {
        console.log(err)
    })
    
    
}