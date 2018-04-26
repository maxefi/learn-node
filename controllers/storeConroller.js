const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    console.log('req.name: ', req.name);
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
    // validation comes here
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
    // 1. Find the store given the ID
    const store = await Store.findOne({ _id: req.params.id });
    // TODO: 2. confirm they are the owner of the store
    // 3. Render out the edit form so the user can update their store
    res.render('editStore', { title: `Edit ${store.name} Store`, store });
};

exports.updateStore = async (req, res) => {
    // 1. Find and update store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return the new store instead of the old one
        runValidators: true,
    }).exec();
    const { name, slug, _id } = store;
    req.flash('success', `Successfully updated <strong>${name}</strong>. <a href='/stores/${slug}'>View Store -></a>`);
    // 2. Redirect them the store and tell it worked
    res.redirect(`/stores/${_id}/edit`);
};
