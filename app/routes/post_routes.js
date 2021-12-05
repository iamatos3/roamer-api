// Express Library
const express = require('express')
// Passport Library
const passport = require('passport')

// Pulling in Mongoose Post Model for Posts
const Post = require('../models/post')

// Collection of methods help detect situations when we need to throw a custom error
const customErrors = require('../../lib/custom_errors')

// Function to send 404 when non-existent document is requested
const handle404 = customErrors.handle404

// Function to send 401 when a user tries to modify a resource by another user
const requireOwnership = customErrors.requireOwnership

// middleware to remove blank fields
const removeBlanks = require('../../lib/remove_blank_fields')

// Argument to require a token in order to provide access to routes
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router
const router = express.Router()

// POST ROUTES

// INDEX
// GET /posts
router.get('/posts', requireToken, (req, res, next) => {
	Post.find()
	// respond with status 200 and JSON of the examples
    .then(posts => res.status(200).json({ posts }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /posts/5a7db6c74d55bc51bdf456788
router.get('/posts/:id', requireToken, (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Post.findById(req.params.id)
		.then(handle404)
		// if `findById` is successful, respond with 200 and "post" JSON
		.then((post) => res.status(200).json({ post }))
		.catch(next)
})

// CREATE
// POST /posts
router.post('/posts', requireToken, (req, res, next) => {
	// set owner of new example to be current user
	req.body.post.owner = req.user.id
	console.log(req.body.post)

	Post.create(req.body.post)
	    // respond to successful `create` with status 201 and JSON of new "post"
        .then(post => {
            res.status(201).json({ post })

        })
        .catch(next)
})

// UPDATE
// PATCH /posts/5a7db6c74d55bc51bdf456788
router.patch('/posts/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new owner, prevent that by deleting that key/value pair
	delete req.body.post.owner

	Post.findById(req.params.id)
		.then(handle404)
		// ensure the signed in user (req.user.id) is the same as the post's owner
		.then((post) => requireOwnership(req, post))
		// updating example object with postData
		.then((post) => post.updateOne(req.body.post))
	    // if that succeeded, return 204 and no JSON
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DESTROY
// DELETE /posts/5a7db6c74d55bc51bdf456788
router.delete('/posts/:id', requireToken, (req, res, next) => {
	Post.findById(req.params.id)
		.then(handle404)
		.then(post => requireOwnership(req, post))
		// delete post from the database (mongodb)
		.then(post => post.deleteOne())
	    // send back 204 and no content if the deletion succeeded
        .then(() => res.sendStatus(204))
        .catch(next)
})

module.exports = router