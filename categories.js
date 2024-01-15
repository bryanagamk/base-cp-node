const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('./database');

/**
 * INDEX CATEGORIES
 */
router.get('/', function (req, res) {
    //query
    connection.query('SELECT * FROM categories ORDER BY id_category desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
                data: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data Categories',
                data: rows
            })
        }
    });
});

/**
 * STORE CATEGORIES
 */
router.post('/', [

    //validation
    body('name').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    const id_category = uuidv4();

    //define formData
    let formData = {
        id_category: id_category,
        name: req.body.name,
    }

    // insert query
    connection.query('INSERT INTO categories SET ?', formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error\n',
                data: err
            })
        } else {
            return res.status(201).json({
                status: true,
                message: 'Insert Data Successfully',
                data: rows[0]
            })
        }
    })

});

/**
 * SHOW CATEGORIES
 */
router.get('/(:id)', function (req, res) {

    let id = req.params.id;
    console.log(id);

    connection.query(`SELECT * FROM categories WHERE id_category = "${id}"`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
                data: err
            })
        }

        // if categories not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Categories Not Found!',
                data: rows.length
            })
        }
        // if categories found
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data Categories',
                data: rows[0]
            })
        }
    })
})

/**
 * UPDATE CATEGORIES
 */
router.put('/(:id)', [

    //validation
    body('name').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id category
    let id = req.params.id;

    //data category
    let formData = {
        name: req.body.name,
    }

    // update query
    connection.query(`UPDATE categories SET ? WHERE id_category = "${id}"`, formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
                data: err,
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update Data Successfully!',
            })
        }
    })

});

/**
 * DELETE CATEGORIES
 */
router.delete('/(:id)', function (req, res) {

    //id category
    let id = req.params.id;

    //data category
    let formData = {
        deleted_at: new Date(),
    }

    connection.query(`UPDATE categories SET ? WHERE id_category = "${id}"`, formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
                data: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully!',
            })
        }
    })
});

module.exports = router;