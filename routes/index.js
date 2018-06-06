const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeConroller');
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const {
    getStores, addStore, createStore, updateStore, editStore, upload, resize, getStoreBySlug,
    getStoresByTag, searchStores, mapStores, mapPage, heartStore, getHeartedStores,
} = storeController;
const { loginForm, registerForm, validateRegister, register, account, updateAccount } = userController;
const { login, logout, isLoggedIn, forgot, reset, confirmedPasswords, update } = authController;

router.get('/', catchErrors(getStores));
router.get('/stores', catchErrors(getStores));
router.get('/add', isLoggedIn, addStore);
router.post('/add', upload, catchErrors(resize), catchErrors(createStore));
router.post('/add/:id', upload, catchErrors(resize), catchErrors(updateStore));
router.get('/stores/:id/edit', catchErrors(editStore));
router.get('/store/:slug', catchErrors(getStoreBySlug));
router.get('/tags', catchErrors(getStoresByTag));
router.get('/tags/:tag', catchErrors(getStoresByTag));
router.get('/login', loginForm);
router.get('/register', registerForm);
router.post('/register', validateRegister, register, login);
router.get('/logout', logout);
router.post('/login', login);
router.get('/account', isLoggedIn, account);
router.post('/account', catchErrors(updateAccount));
router.post('/account/reset', catchErrors(forgot));
router.get('/account/reset/:token', catchErrors(reset));
router.post('/account/reset/:token', confirmedPasswords, catchErrors(update));
router.get('/map', mapPage);
router.get('/hearts', isLoggedIn, catchErrors(getHeartedStores));

/*
    API
 */

router.get('/api/v1/search', catchErrors(searchStores));
router.get('/api/stores/near', catchErrors(mapStores));
router.post('/api/stores/:id/heart', catchErrors(heartStore));

module.exports = router;
