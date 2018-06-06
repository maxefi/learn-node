const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const User = mongoose.model('User');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype isn\'t allowed!' }, false);
        }
    },
};

exports.homePage = (req, res) => {
    console.log('req.name: ', req.name);
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if (!req.file) return next();
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
};

exports.createStore = async (req, res) => {
    // validation comes here
    req.body.author = req.user._id;
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
    // call .populate to get virtual fields
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
};

const confirmOwner = (store, user) => {
    // should use .equals if the field is ObjectId
    if (!store.author.equals(user._id)) {
        throw Error('You must own a store in order to edit it!');
    }
};

exports.editStore = async (req, res) => {
    const store = await Store.findOne({ _id: req.params.id });
    confirmOwner(store, req.user);
    res.render('editStore', { title: `Edit ${store.name} Store`, store });
};

exports.updateStore = async (req, res) => {
    // set the location data to be a point
    // TODO: req.body is {}, how so?
    // req.body.location.type = 'Point';
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

exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug }).populate('author reviews');
    if (!store) return next();
    res.render('store', { store, title: store.name });
};

exports.getStoresByTag = async (req, res, next) => {
    const { tag } = req.params;
    // if no tag than any store that has 'tags'
    const tagQuery = tag || { $exists: true };

    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find({ tags: tagQuery });

    const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
    res.render('tags', { tags, title: 'Tags', tag, stores });
};

exports.searchStores = async (req, res) => {
    const stores = await Store
    // find matched queries
        .find({
            $text: {
                $search: req.query.q,
            },
        }, {
            score: { $meta: 'textScore' },
        })
        // sort it by meta text score
        .sort({
            score: { $meta: 'textScore' },
        })
        // limit the result by 5
        .limit(5);
    res.json(stores);
};

exports.mapStores = async (req, res) => {
    const { lng, lat } = req.query;
    const coordinates = [lng, lat].map(parseFloat);
    const stores = await Store
        .find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates,
                    },
                    $maxDistance: 10000 // 10km
                },
            },
        })
        .select('slug name description location')
        .limit(10);
    res.json(stores);
};

exports.mapPage = async (req, res) => {
    res.render('map', { title: 'Map' });
};

exports.heartStore = async (req, res) => {
    const hearts = req.user.hearts.map(obj => obj.toString());
    const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { [operator]: { hearts: req.params.id } },
        { new: true });
    res.json(user);
};

exports.getHeartedStores = async (req, res) => {
    const stores = await Store.find({
        _id: { $in: req.user.hearts },
    });
    res.render('stores', { title: 'Hearted Stores', stores });
};

exports.getTopStores = async (req, res) => {
    const stores = await Store.getTopStores();
    res.render('topStores', { title: 'Top Stores!', stores });
};
