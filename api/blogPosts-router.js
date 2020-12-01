const express = require('express');
//Import our helper functions to access DB
const BlogPost = require('../data/db'); 

const router = express.Router();

router.get('/', (req, res) => {
    BlogPost.find()
        .then(bPosts => {
            res.status(200).json(bPosts); 
        })
        .catch(error => {
            res.status(500).json({ error: "The posts information could not be retrieved."});
            console.log(error.message);
        })
})

module.exports = router; 
