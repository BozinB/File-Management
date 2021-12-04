require('dotenv').config()
const User = require('./models/users');
const path = require('path'); //definiranje na patot
const fs = require('fs');
const mongoServer = process.env.MONGO_DB;
const tajna = process.env.SECRET
const csrf = require('csurf');
const flash = require('connect-flash')


const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');


const department = require('./routes/department')
const vlezUser = require('./routes/login_signup')
const session = require('express-session');
const { request } = require('http');
const MOngoDBStroe = require('connect-mongodb-session')(session);
const port = process.env.PORT

const snimiDokument = multer.diskStorage ({
  destination: (req, file, cb) => {
    cb(null, "./public/dokumenti")
  },
  filename: (req, file, cb) => {
    let doklink = "public/dokumenti/" + file.originalname;
    console.log(fs.existsSync(doklink));
    if (fs.existsSync(doklink)) {
       cb(null, Date.now() + '-' + file.originalname)
  } else { 
    cb(null, file.originalname)
  } 
      
  }
})

const csrfProtection = csrf()

const app = express();

const store = new MOngoDBStroe({
  uri: mongoServer,
  collection: 'sessions'
});

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(multer({ storage: snimiDokument }).single('dokument'))
app.use(
  session({secret: tajna, resave: false, saveUninitialized: false, store: store})
);
app.use(csrfProtection);
app.use(flash())


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});


app.set('view engine', 'ejs');
app.set('views', 'view');


//definirenje na staticni folderi
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/sliki', express.static(path.join(__dirname, 'sliki')));

app.use(vlezUser);

app.use(department);





// 404 nepostocecka strana
app.use('/',(req, res, next) => { 
    res.status(404).send('<h1>Stranata ne postoi</h1>');
});


mongoose
  .connect(
    mongoServer, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
  )
  .then(result => {
    app.listen(port);
  })
  .catch(err => {
    console.log(err);
  })