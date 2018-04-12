const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeConroller');

router.get('/', storeController.homePage);

router.get('/reverse/:name', (req, res) => {
    res.send([...req.params.name].reverse().join(''));
});

module.exports = router;
