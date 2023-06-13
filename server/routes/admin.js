const express = require('express');
const router = express.Router();
const Post = require('../model/post');

const adminLayout = '../views/layouts/main';

router.get('/admin', async (req, res) => {
    try {
        res.render('admin/index', { layout: adminLayout });
    } catch (error) {
        console.log(error);
    }

});


router.post('/admin', async (req, res) => {
    try {
        const { title, content } = req.body;
        const data = {title: title, body: content};
        console.log(data);
        Post.insertMany([data]);
        res.render('post',{data});
    } catch (error) {
        console.log(error);
    }

});


module.exports = router;
