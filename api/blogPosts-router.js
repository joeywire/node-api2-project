/* 
To Do: 
- Refactor 3 w/ async await and fully flushed out error handling 

- Comment server.js and index.js

- This is the good stuff my dude
*/





const express = require('express');
//Import our helper functions to access DB
const BlogPost = require('../data/db'); 

const router = express.Router();

// POST REQUESTS 
router.post('/', async (req, res) => {
    if (!req.body.title || !req.body.contents) { 
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
        return;
    }
    try { 
        const newPostId = await BlogPost.insert(req.body); 
        res.status(201).json(newPostId); 
    } catch (error) {
        res.status(500).json( {errorMessage: error.message});
    }

})
    // Promise Version
router.post('/', (req, res) => {
    //conditional logic to ensure req has necessary info
    if (!req.body.title || !req.body.contents) { 
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }
    BlogPost.insert(req.body)
        .then(newID => {
            res.status(201).json(newID);
        })
        .catch(err => {
            res.status(500).json( {errorMessage: err.message});
        })
});

router.post('/:id/comments', (req, res) => {
    const comment = {
        post_id: req.params.id,
        text: req.body.text
    }; 

    if (!comment.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else { 
        BlogPost.insertComment(comment)
            .then(returnedId => {
                res.status(200).json(returnedId)
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
    }

});


// ALL YOUR GETS

router.get('/', async (req, res) => {
    try { 
        const allPosts = await BlogPost.find(); 
        res.status(200).json(allPosts); 
    } catch (error) {
        res.status(500).json({ errorMessage: error.message })
    }
})
    // Promise Version
router.get('/', (req, res) => {
    BlogPost.find()
        .then(bPosts => {
            res.status(200).json(bPosts); 
        })
        .catch(error => {
            res.status(500).json({ error: "The posts information could not be retrieved."});
            console.log(error.message);
        })
}); 

router.get('/:id', (req, res) => {
    const id = req.params.id; 
    BlogPost.findById(id)
        .then(bPost => {
            //REVISIT - OVERLOOKING SOMETHING WITH THIS CONDITIONAL
            if (bPost.length > 0) {
                res.status(200).json(bPost);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } 
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be retrieved." })
        });
}); 

router.get(`/:id/comments`, (req, res) => {
    const postId = req.params.id;
    let idCheck = false; 

    // BlogPost.find()
    //     .then(posts => {
    //         posts.forEach(post => {
    //             if (post.id === postId) {
    //                 idCheck = !idCheck; 
    //             } 
    //         }) 
    //     })
    //     .catch(err => console.log(err));
    
    // if (!idCheck) { 
    //     res.status(404).json({ message: "The post with the specified ID does not exist." });
    //     return
    // }

    BlogPost.findPostComments(postId)
        .then(comment => {
            res.status(200).json(comment); 
        })
        .catch(err => {
            res.status(500).json({ error: "The comments information could not be retrieved." })
        });
});

//DELETE ME
router.delete('/:id', async (req, res) => {
    const postId = req.params.id; 
    try { 
        const delPost = await BlogPost.remove(postId);
        res.status(200).json(delPost); 
    } catch (err) {
        res.status(500).json({ error: "The post could not be removed" });
        console.log(err.message);
    }
})
    //Ugly shit with promises 
// router.delete('/:id', (req, res) => {
//     const postId = req.params.id; 
//     BlogPost.remove(postId)
//         .then(delPost => {
//             res.status(200).json(delPost);
//         })
//         .catch(err => {
//             res.status(500).json( {error: "The post could not be removed"} );
//         })
// });

// PUT IT THERERERSA

router.put('/:id', (req, res) => {
    const { postId } = req.params; 
    const changes = req.body; 

    BlogPost.update(postId, changes)
        .then(returnedNum => {
            res.status(200).json(returnedNum); 
        })
        .catch(err => {
            res.status(500).json({ errorMessage: err.message});
        })
});

module.exports = router; 
