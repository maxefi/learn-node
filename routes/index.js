const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeConroller');
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');

const {
    getStores, addStore, createStore, updateStore, editStore, upload, resize, getStoreBySlug,
    getStoresByTag,
} = storeController;

const { loginForm, registerForm, validateRegister, register } = userController;

router.get('/', catchErrors(getStores));
router.get('/stores', catchErrors(getStores));
router.get('/add', addStore);
router.post('/add', upload, catchErrors(resize), catchErrors(createStore));
router.post('/add/:id', upload, catchErrors(resize), catchErrors(updateStore));
router.get('/stores/:id/edit', catchErrors(editStore));
router.get('/store/:slug', catchErrors(getStoreBySlug));
router.get('/tags', catchErrors(getStoresByTag));
router.get('/tags/:tag', catchErrors(getStoresByTag));
router.get('/login', loginForm);
router.get('/register', registerForm);
// 1. validate the registration data
// 2. register the user
// 3. log in
router.post('/register', validateRegister, register);

module.exports = router;
