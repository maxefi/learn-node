const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name!').notEmpty();
    req.checkBody('email', 'That Email is not valid').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false,
    });
    req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
    req.checkBody('password-confirm', 'Confirmed Password cannot be black!').notEmpty();
    req.checkBody('password-confirm', 'Oops! Your Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
        return;
    }
    next();
};

exports.register = async (req, res, next) => {
    const { email, name, password } = req.body;
    const user = new User({ email, name });
    // .register doesn't return a promise so it's callback based
    // in this case we should use cbs or promisify to turn it into promise based
    const registerWithPromise = promisify(User.register, User);
    await registerWithPromise(user, password);
    next();
};

exports.account = (req, res) => {
    res.render('account', { title: 'Edit Your Account' });
};

exports.updateAccount = async (req, res) => {
    const { name, email } = req.body;
    const updates = { name, email };

    const user = await User.findOneAndUpdate({ _id: req.user._id }, { $set: updates }, {
        new: true, runValidators: true,
    });
    req.flash('success', `Updated ${user.name} profile!`);
    res.redirect('back');
};
