exports.homePage = (req, res) => {
    console.log('req.name: ', req.name);
    res.render('index');
};

