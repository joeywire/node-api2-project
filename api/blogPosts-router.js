const express = require('express');
//Import our helper functions to access DB
const BlogPost = require('../data/db'); 

const router = express.Router();

//POST REQUESTS 
router.post('/', (req, res) => {
    //conditional logic to ensure req has necessary info
    if (!req.body.title || !req.body.contents) { 
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    BlogPost.insert(req.body)
        .then(newID => {
            res.status(201).json(newID);
        })
        .catch(err => {
            res.status(500).json( {errorMessage: err.message});
        })
})



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
