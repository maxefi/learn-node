const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
    const max = { name: 'Max', age: '25', cool: false };
    // res.send('Sup, dude. Nothing works...');
    // res.json(max);
    // res.send(req.query.name);
    res.json(req.query);
});

router.get('/reverse/:name', (req, res) => {
    res.send([...req.params.name].reverse().join(''));
});

module.exports = router;
