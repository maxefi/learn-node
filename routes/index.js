const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeConroller');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);
// composition - function wrapped with a function
router.post('/add', catchErrors(storeController.createStore));

module.exports = router;
