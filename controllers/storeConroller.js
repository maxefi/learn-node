exports.homePage = (req, res) => {
    console.log('req.name: ', req.name);
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
};

exports.createStore = (req, res) => {
    console.log('req.body: ', req.body); // see data posted
    res.json(req.body);
};
