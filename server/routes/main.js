const express = require('express');
const router = express.Router();
const Post = require('../model/post');

router.get('/contact', async (req, res) => {
    res.render('contact');

});
router.get('', async (req, res) => {
    const locals = { title: "title", desc: "New Blog written" };
    try {
        let perPage = 5;
        let page = req.query.page || 1;
        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });
    } catch (error) {
        console.log(error);
    }

});
router.get('/about', (req, res) => {
    res.render('about');
});
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const data = await Post.findById({ _id: slug });
        res.render('post', {data});
    } catch (error) {
        console.log(error);
    }

});


router.get('/postdel/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const data = await Post.findById({ _id: slug });
        try {
            await Post.deleteOne(data);
            console.log(" document(s) deleted");
        }
        catch (error) {
            console.log(error);
        }
        res.render('postdel', {data });

    } catch (error) {
        console.log(error);
    }

});


router.post('/search', async (req, res) => {

    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }

            ]
        })
        res.render("search", {
            data
        });




    } catch (error) {
        console.log(error);
    }

});

module.exports = router;
