const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeConroller');
const { catchErrors } = require('../handlers/errorHandlers');

const { getStores, addStore, createStore, updateStore, editStore, upload, resize, getStoreBySlug } = storeController;

router.get('/', catchErrors(getStores));
router.get('/stores', catchErrors(getStores));
router.get('/add', addStore);
router.post('/add', upload, catchErrors(resize), catchErrors(createStore));
router.post('/add/:id', upload, catchErrors(resize), catchErrors(updateStore));
router.get('/stores/:id/edit', catchErrors(editStore));
router.get('/store/:slug', catchErrors(getStoreBySlug))

module.exports = router;
