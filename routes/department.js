const path = require('path');
const newDepartment = require('../controlers/department')
const publicDepartment = require('../controlers/public_department')
const browser = require('../midleware/ie');
const avtorizirano = require('../midleware/avtorizirano');

const express = require('express');
const router = express.Router();


router.get('/', browser, publicDepartment.Pocetna);
router.get('/d/:tip', browser, publicDepartment.glavenDepartment);

router.get('/department', avtorizirano, browser, newDepartment.renderDepartments);
router.post('/department', avtorizirano, browser, newDepartment.dodajDepartment);
router.delete('/department/',  avtorizirano, browser, newDepartment.deleteDepartment);

router.get('/new_file/:tip', avtorizirano, browser, newDepartment.newFile);
router.post('/new_file/:tip', browser, newDepartment.saveFile);

router.get('/edit_file/:tip', avtorizirano, browser, newDepartment.editFilePage);
router.post('/edit_file/:tip', avtorizirano, browser, newDepartment.editFile);

router.delete('/brisi_file', avtorizirano, browser, newDepartment.brisiDokument);

module.exports = router;