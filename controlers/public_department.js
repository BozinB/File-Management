const Department = require('../models/department');
const File = require('../models/files');
const path = require('path'); //definiranje na patot
const mongoose = require('mongoose');
const { Console } = require('console');


// Отворање на Почетна страна за корисник
exports.Pocetna = async (req, res, next) => {
    try {
        const Deps = await Department.find({parrent: null})
        let isprati = []
        let prikaci = {}
        for (d in Deps) {
            prikaci['imeKirilica'] = Deps[d].imeKirilica
            prikaci['_id'] = Deps[d]._id
            isprati.push(prikaci)
            prikaci = {}
        }
        //console.log(isprati, isprati.length)
        return res.render('dPocetna', {   
            Logiran: req.session.Logiran, user: req.session.user, 
            Logiran_Emp: req.session.Logiran_Emp, employee: req.session.employee,
            naslov: `Tree structure with parent children relations`,
            isprati: isprati,
            еrrorMessage: req.flash('error'),
            izvestuvanje: req.flash('izvestuvanje')
        }) 
    }
    
    catch (e) {
        console.log(e)
        req.flash('error', 'Се појави грешка, ве молиме пријавете го проблемот')
        return res.redirect('/')
    }

  }; 

  const listajRekurzivno = async (niza) => {
      let isprati = []
    if (niza.length === 0) return []
    for (i in niza) {
        const Rekurzija = async (i) => {
            let prikaci = {}
                const Deps = await Department.findOne({_id: i})
                if (!Deps) {
                    prikaci['imeKirilica'] = ''
                    prikaci['_id'] = ''
                    prikaci['files'] = ''
                    prikaci['children'] = ''

                } else {
                    prikaci['imeKirilica'] = Deps.imeKirilica
                    prikaci['_id'] = Deps._id
                    prikaci['files'] = Deps.files

                    if (Deps.children.length > 0) {
                        prikaci['children'] = await listajRekurzivno(Deps.children)
        
                    } else {
                        prikaci['children'] = []
                    }
                }
                    isprati.push(prikaci)
            }
            await Rekurzija(niza[i])
    }
    return isprati
  }

  exports.glavenDepartment = async (req, res, next) => {
    try {
        const tip = req.params.tip
        const Deps = await Department.findOne({_id: tip})
        const naslov = Deps.imeKirilica;
        let isprati = await listajRekurzivno(Deps.children)
        
        return res.render('show_department', {   
            Logiran: req.session.Logiran, user: req.session.user, 
            Logiran_Emp: req.session.Logiran_Emp, employee: req.session.employee,
            naslov: naslov,
            isprati: isprati
            //еrrorMessage: req.flash('error'),
            //izvestuvanje: req.flash('izvestuvanje')
        }) 
    }
    
    catch (e) {
        console.log(e)
        req.flash('error', 'Се појави грешка, ве молиме пријавете го проблемот')
        return res.redirect('/')
    }

  }; 