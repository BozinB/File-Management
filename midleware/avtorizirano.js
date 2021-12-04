module.exports = (req, res, next) => {
    if (!req.session.Logiran) { 
        console.log(req.session.Logiran);
        return res.redirect ('/login')
    }
    next();
}