const Department = require('../models/department');
const File = require('../models/files');
const path = require('path'); //definiranje na patot
const mongoose = require('mongoose');
const brisi = require('../util/brisi');
const files = require('../models/files');

//Норманизирање на текст
const prilagodi = (string) => {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
  
    return string.toString().toLowerCase()
      .replace(/\s+/g, '_') // Replace spaces with _
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

  const delFile = async (fileIdm) => {
      console.log('-------------- ', fileIdm)
      let brisidok = ""
      let dokument = await File.findOne(mongoose.Types.ObjectId(fileIdm))
      console.log('-------------- ', dokument)
      if (!dokument) {
          return 404
        }

        const direkcijaId = mongoose.Types.ObjectId(dokument.direkcija);
        let order
        //console.log('Order = ', order)
        //lio = "/admin/" + dokument.gdirekcija;
        brisidok = dokument.brisilink;
        console.log('-------------- ', brisidok)
    brisi.brisiDokument(brisidok);
    await File.findByIdAndRemove(fileIdm)
    let index = await Department.findOne({ _id: direkcijaId});
    let ii = index.files.length
    let order_index = index.files.findIndex(it => it['id'] == fileIdm.toString())
    order = index.files[order_index].order
    await Department.updateOne({ _id: direkcijaId}, { $pull: {files: {id: fileIdm}}});
    let new_order
    if (order < ii) {
        while (order < ii) {
            order++
            new_order = order - 1
            //console.log(order)
            await Department.updateOne({ _id: direkcijaId,'files.order': order}, { $set: { 'files.$.order': new_order}});
        }
    }
    return 202
  }

  const delDepartment = async (depId) => {
    let department = await Department.findById(mongoose.Types.ObjectId(depId))
    if (!department) {
       return 404
    }
    let brat = await Department.find({parrent: department.parrent})
    let i = department.pozicija
    let j =  brat.length
    let k
    if (i<j) {
        while (i < j) {
            k = i+1
            let novIndex =  await brat.filter(it => it.pozicija === k)
            let s = novIndex[0]._id
            await Department.findByIdAndUpdate(mongoose.Types.ObjectId(s), {pozicija: i})               
            i++
        }
    }
    if (department.parrent !== null) {
        let naslednici = department.successors
        naslednici.push(mongoose.Types.ObjectId(depId))
        let res = await Department.findByIdAndUpdate(mongoose.Types.ObjectId(department.parrent), { $pull: {children: mongoose.Types.ObjectId(depId), successors: {$in: naslednici}}}, {new: true});
        let req
        if (res.parrent !== null) {
            while (res.parrent !== null) {
                req = res.parrent
                res = await Department.findByIdAndUpdate(mongoose.Types.ObjectId(req), { $pull: {successors: {$in: naslednici}}}, {new: true});

            }

        }
        
    }
    if (department.files.length > 0 ) {
        let doc_arr_delete = department.files
        for (i in doc_arr_delete) {
            console.log('i = ', doc_arr_delete[i], ' i.id = ', doc_arr_delete[i].id)
            await delFile(mongoose.Types.ObjectId(doc_arr_delete[i].id))
        }
    }
    if (department.children.length > 0 ) {
        let dep_arr_delete = department.children
        for (i in dep_arr_delete) await delDepartment(mongoose.Types.ObjectId(dep_arr_delete[i]))
    }
    await Department.findByIdAndRemove(mongoose.Types.ObjectId(depId))
    return 202

  }


  const listajRekurzivno = async (niza) => {
    let isprati = []
  if (niza.length === 0) return []
  for (i in niza) {
      const Rekurzija = async (i) => {
          let prikaci = {}
              const Deps = await Department.findOne({_id: i})
              prikaci['imeKirilica'] = Deps.imeKirilica
              prikaci['imeLatinica'] = Deps.imeLatinica
              prikaci['_id'] = Deps._id
              prikaci['files'] = Deps.files
              if (Deps.children.length > 0) {
                  prikaci['children'] = await listajRekurzivno(Deps.children)
  
              } else {
                  prikaci['children'] = []
              }
                  isprati.push(prikaci)
          }
          await Rekurzija(niza[i])
  }
  return isprati
}

// Отворање на страна за главни категории
exports.renderDepartments = async (req, res, next) => {
    try {
            const Deps = await Department.find({parrent: null})
            let parrent_null = []
            let prikaci = {}
            for (d in Deps) {
                prikaci['_id'] = Deps[d]._id
                parrent_null.push(prikaci)
                prikaci = {}
            }
            let isprati = await listajRekurzivno(parrent_null)
            //console.log(isprati)
        const tip = (req.params.tip) ? req.params.tip : 'null'
        if (tip === 'null') {
            res.render('newDepartment', {   
                Logiran: req.session.Logiran, user: req.session.user, 
                Logiran_Emp: req.session.Logiran_Emp, employee: req.session.employee,
                naslov: 'Страница на администрирање',
                isprati: isprati,
                еrrorMessage: req.flash('error')
            })
        } 
    }   
    catch (e) {
        console.log(e)
        req.flash('error', 'Се појави грешка, ве молиме пријавете го проблемот')
        return res.redirect('/')
    }
};



// Отворање на страна за подкатегории
exports.newDepartment = async (req, res, next) => {
    try {
        const tip = req.params.tip;
        if (tip.length !== 24) {
            req.flash('error', 'Бараната страна не постои')
            return res.redirect('/')
        }
        const Deps = await Department.find({_id: tip})
        if (Deps.length > 0) {
            res.render('newDepartment', {   
                Logiran: req.session.Logiran, user: req.session.user, 
                Logiran_Emp: req.session.Logiran_Emp, employee: req.session.employee,
                naslov: `${Deps[0].imeKirilica} - Додај подкатегорија`,
                oddel: tip,
                еrrorMessage: req.flash('error')
            }) 
        } else {
            req.flash('error', 'Бараната страна не постои')
            return res.redirect('/')
        }

    }
    catch (e) {
        console.log(e)
        req.flash('error', 'Се појави грешка, ве молиме пријавете го проблемот')
        return res.redirect('/')
    }

  }; 

// Додавање на категории и подкатегории
exports.dodajDepartment = async (req, res, next) => {
    try {
        let edit = req.body.edit
        let Deps
        let dojdovenOddel = req.body.oddel
        let oddel = (req.body.oddel === 'null') ? null : req.body.oddel
        const imeKirilica = req.body.imeKirilica.replace(/\s+/g, ' ').trim()
        const imeLatinica = prilagodi(req.body.imeLatinica)
        if (imeKirilica ==='' || imeLatinica === '') {
            return res.status(400).json({
                imeKirilica: imeKirilica,
                imeLatinica: imeLatinica,
                edit: edit
            })
        }
        const Gone = await Department.find({_id: oddel})
        if (Gone.length === 0 && oddel !== null) {
            return res.status(410).json({
                eroor: 'Категоријата некој ја избришал'
            })
        }
        if (edit) {
            const tatko = await Department.findOne({_id: oddel})
            //console.log('+++ ', tatko.parrent)
             Deps = await Department.find({parrent:tatko.parrent})
            const n = await Deps.filter((it => it.imeLatinica === imeLatinica))
            //console.log('n = ', n, oddel)
            //if (n.length > 0) console.log('---', n[0]._id.toString() !== oddel, typeof(n[0]._id), typeof(mongoose.Types.ObjectId(oddel)), n[0]._id, mongoose.Types.ObjectId(oddel))
            if (n.length >0 && n[0]._id.toString() !== oddel) {
                return res.status(409).json({
                    imeKirilica: imeKirilica,
                    imeLatinica: imeLatinica,
                    edit: edit
                })
            }

        } else {
            //console.log('oddel = ', oddel)
            Deps = await Department.find({parrent: oddel})
            const n = await Deps.filter((it => it.imeLatinica === imeLatinica))
            if (n.length >0 && n[0].imeLatinica === imeLatinica) {
                return res.status(409).json({
                    imeKirilica: imeKirilica,
                    imeLatinica: imeLatinica,
                    edit: edit
                })
            }
        }
        if (!edit) {
            //console.log('+++++++++++++++++++ ', edit)
            const pozicija = Deps.length + 1
            const id = mongoose.Types.ObjectId();
            const department = await new Department ({
                _id: id,
                imeKirilica: imeKirilica,
                imeLatinica: imeLatinica,
                pozicija: pozicija,
                parrent: oddel
            }).save()
            if (oddel !== null) {
                let par = await Department.findOne({_id: oddel})
                par.children.push(id) 
                par.successors.push(id) 
                await par.save()
                if (par.parrent !== null) {
                    oddel = par.parrent
                    while (oddel !== null) {
                        par = await Department.findOne({_id: oddel})
                        par.successors.push(id) 
                        await par.save()
                        oddel = par.parrent                    
                    }
                } 
            }
            return res.status(200).json({
                _id: id,
                imeKirilica: imeKirilica,
                imeLatinica: imeLatinica,
                oddel: dojdovenOddel
            })
        } else {
            //console.log('+++++++++++++++++++------------- ', edit)
            let par = await Department.findOne({_id: mongoose.Types.ObjectId(oddel)})
            par.imeKirilica = imeKirilica 
            par.imeLatinica = imeLatinica    
            await par.save() 
            return res.status(201).json({
                imeKirilica: imeKirilica,
                imeLatinica: imeLatinica,
                oddel: dojdovenOddel
            })      

        }
    }
    catch (e) {
        console.log(e)
        req.flash('error', 'Се појави грешка, ве молиме пријавете го проблемот')
        return res.redirect('/')
    } 
}


// Страна за едитирање на податоци
exports.Update = async (req, res, next) => {
    try {
        const tip = req.params.tip;
        if (tip.length !== 24) {
            req.flash('error', 'Бараната страна не постои')
            return res.redirect('/')
        }
        const Deps = await Department.find({_id: tip})
        if (Deps.length > 0) {
            res.render('editDepartment', {   
                Logiran: req.session.Logiran, user: req.session.user, 
                Logiran_Emp: req.session.Logiran_Emp, employee: req.session.employee,
                naslov: `${Deps[0].imeKirilica} - Страница за промени`,
                imeLatinica: Deps[0].imeLatinica,
                imeKirilica: Deps[0].imeKirilica,
                oddel: tip,
                еrrorMessage: req.flash('error')
            }) 
        } else {
            req.flash('error', 'Бараната страна не постои')
            return res.redirect('/')
        }

    }
    catch (e) {
        console.log(e)
        req.flash('error', 'Се појави грешка, ве молиме пријавете го проблемот')
        return res.redirect('/')
    }

  }; 


  // Додавање на категории и подкатегории
exports.deleteDepartment = async (req, res, next) => {
    try {
        console.log(req.body)
        let department = req.body.tip
        let rezultat = await delDepartment(department)
        if (rezultat === 202) {
            return res.status(202).json({
                uspeh: 'Документот е избришан'
            })
        }
        if (rezultat === 404) {
            return res.status(404).json({
                error: 'Грешка'
            })
        }
     
    }
    catch (e) {
        console.log(e)
        req.flash('error', 'Се појави грешка, ве молиме пријавете го проблемот')
        return res.redirect('/')
    } 
}


// Додавање на нов документ
exports.newFile = async (req, res, next) => {
    try {
        const tip = req.params.tip;
        if (tip.length !== 24) {
            req.flash('error', 'Бараната страна не постои')
            return res.redirect('/')
        }
        const Deps = await Department.find({_id: tip})
        if (Deps.length > 0) {
            res.render('new_file_page', {   
                Logiran: req.session.Logiran, user: req.session.user, 
                Logiran_Emp: req.session.Logiran_Emp, employee: req.session.employee,
                naslov: `${Deps[0].imeKirilica} - Додај нов документ`,
                oddel: tip,
                еrrorMessage: req.flash('error')
            }) 
        } else {
            req.flash('error', 'Бараната страна не постои')
            return res.redirect('/')
        }

    }
    catch (e) {
        console.log(e)
        req.flash('error', 'Се појави грешка, ве молиме пријавете го проблемот')
        return res.redirect('/')
    }

  }; 

  // Додавање на нов документ
exports.saveFile = async (req, res, next) => {
    try {
        const title = req.body.title;
        const doc = req.file;
        const direkcija = req.body.oddel;  
        const link = path.join('/', doc.destination, doc.filename);
        const brisilink = path.join(doc.destination, doc.filename);
        const id = mongoose.Types.ObjectId();
        const file = await new File ( {
            _id: id,
            title: title, 
            link: link, 
            brisilink: brisilink,
            direkcija: direkcija    
        }).save()
        let par = await Department.findOne({_id: direkcija})
        const order = par.files.length + 1
        let dok = {id:id, link: link, title: title, order: order}
        par.files.push(dok)  
        await par.save()
        
        return res.redirect('/department')
    }
    catch (e) {
        console.log(e)
        req.flash('error', 'Се појави грешка, ве молиме пријавете го проблемот')
        return res.redirect('/')
    }
}

  // Страна за менување на документ
  exports.editFilePage= async (req, res, next) => {
    try {
        const tip = req.params.tip;
        if (tip.length !== 24) {
            req.flash('error', 'Бараната страна не постои')
            return res.redirect('/')
        }
        const Deps = await File.find({_id: tip})
        if (Deps.length > 0) {
            res.render('edit_file_page', {   
                Logiran: req.session.Logiran, user: req.session.user, 
                Logiran_Emp: req.session.Logiran_Emp, employee: req.session.employee,
                naslov: `Промена на документ`,
                title: Deps[0].title,
                oddel: tip,
                direkcija: Deps[0].direkcija,
                еrrorMessage: req.flash('error')
            }) 
        } else {
            req.flash('error', 'Бараната страна не постои')
            return res.redirect('/')
        }

    }
    catch (e) {
        console.log(e)
        req.flash('error', 'Се појави грешка, ве молиме пријавете го проблемот')
        return res.redirect('/')
    }
}

// Менување на документ
exports.editFile = async (req, res, next) => {
    try {
        const direkcijaId = req.body.direkcija;
        const fileId = req.body.oddel;
        const fileIdm = mongoose.Types.ObjectId(fileId)
        const title = req.body.title;
        const doc = req.file;
        let fileF = await File.findOne({_id: fileId})
        if (doc) {
            brisi.brisiDokument(fileF.brisilink)
            fileF.link = path.join('/', doc.destination, doc.filename);
            fileF.brisilink = path.join(doc.destination, doc.filename);
        }
        fileF.title = title
        await fileF.save()

        if (doc){
            await Department.updateOne({ _id: direkcijaId,'files.id': fileIdm}, { $set: { 'files.$.title': title, 'files.$.link': path.join('/', doc.destination, doc.filename)}});
        } else {
            await Department.updateOne({ _id: direkcijaId,'files.id': fileIdm}, { $set: { 'files.$.title': title}});
        }

            
        return res.redirect('/department')
    }
    catch (e) {
        console.log(e)
        req.flash('error', 'Се појави грешка, ве молиме пријавете го проблемот')
        return res.redirect('/')
    }
}

// funkcija za brisenje na dokumenti
exports.brisiDokument = async (req, res, next) => {
    try {
        ;
        const fileId = req.body.tip;
        //console.log(fileId)
        const fileIdm = mongoose.Types.ObjectId(fileId)
        let rezultat = await delFile(fileIdm)
        if (rezultat === 202) {
            return res.status(202).json({
                uspeh: 'Документот е избришан'
            })
        }
        if (rezultat === 404) {
            return res.status(404).json({
                error: 'Грешка'
            })
        }
    }
    catch (e) {
        console.log(e)
        req.flash('error', 'Се појави грешка, ве молиме пријавете го проблемот')
        return res.redirect('/')
    }
  }
