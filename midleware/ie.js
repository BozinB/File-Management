const UAParser = require('ua-parser-js');
//const browser = window.navigator.userAgent;
 

module.exports = (req, res, next) => {
 var parser = new UAParser();
  var ua = req.headers['user-agent'];
  var browserName = parser.setUA(ua).getBrowser().name;
   
     if (browserName === 'IE') { 
         console.log(browserName)
         return res.send('<h1>Ве молиме префрлете се на Chrome, Firefox или Edge.</h1>');
    }
    next();


} 