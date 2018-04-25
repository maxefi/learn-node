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
    // see data posted
    // console.log('req.body: ', req.body);

    const store = new Store(req.body);

    // sync example with a callback
    // store.save(function(err, store) {
    //     if(!err) return res.redirect('/');
    // });

    // sync example with promises
    // store.save()
    //      .then(store => {
    //          res.json(store);
    //      })
    //      .then(stores => {
    //          res.render('storeList', { stores });
    //      })
    //      .catch(err => {
    //          throw Error(err);
    //      });

    // should be try/catched, instead create hof 'catchErrors' for it
    await store.save();
    res.redirect('/');
};
