const express = require('express');
const blogPostRouter = require('./blogPosts-router');

const server = express(); 

server.use(express.json()); 

server.use('/api/posts', blogPostRouter); 

//Catchall
server.get('/', (req, res) => {
    res.send(`
        <h2>Blog Posts API</h2>
        <p>Welcome from Joe</p>
    `);
});



module.exports = server; 
