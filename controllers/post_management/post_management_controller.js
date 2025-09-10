const express = require('express');
const User = require('../../model/user');
const router = express.Router();
const Post = require('../../model/posts');

 router.post('/posts', async (req, res) => {  
    try {
      const user = await User.findOne({ username: req.user.username})
        if(!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                action: 'Create',
                msg: 'User not found'
            });
        }
      req.body.user_id = user._id;      
      const post = await Post.create(req.body);

      if (post) {
        return res.status(201).json({
          statusCode: 201,
          success: true,
          action: 'Create',
          msg: 'Created Successfully',
          body: post
        });
      }
      res.status(500).json({
        statusCode: 500,
        success: false,
        action: 'Create',
        msg: 'Something went wrong. Please try again!'
      });
    } catch (err) {
      res.status(500).json({
        statusCode: 500,
        success: false,
        action: 'Create',
        msg: 'Something went wrong. Please try again!', body: err
      });
    }
  }) 

  // update post by id
  router.put('/posts/:id', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.user.username})
       
      const checkPost = await Post.findOne({ _id: req.params.id, user_id: user._id});

      if(!checkPost) {
        return res.status(404).json({
            statusCode: 404,
            success: false,
            action: 'Update',
            msg: 'This user has not this kind of post!!'
        });
    }

      const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (post) {
        return res.status(200).json({
          statusCode: 200,
          success: true,
          action: 'Update',
          msg: 'Updated Successfully',
          body: post
        });
      } else {
        return res.status(404).json({
          statusCode: 404,
          success: false,
          action: 'Update',
          msg: 'Post not found'
        });
      }
    } catch (err) {
      res.status(500).json({
        statusCode: 500,
        success: false,
        action: 'Update',
        msg: 'Something went wrong. Please try again!', body: err
      });
    }
    });

    // delete post by id
    router.delete('/posts/:id', async (req, res) => {
      try {
    const user = await User.findOne({ username: req.user.username})
       
      const checkPost = await Post.findOne({ _id: req.params.id, user_id: user._id});

      if(!checkPost) {
        return res.status(404).json({
            statusCode: 404,
            success: false,
            action: 'Delete',
            msg: 'This user has not this kind of post!!'
        });
    }

        const post = await Post.findByIdAndDelete(req.params.id);
        if (post) {
          return res.status(200).json({
            statusCode: 200,
            success: true,
            action: 'Delete',
            msg: 'Deleted Successfully',
            body: post
          });
        } else {
          return res.status(404).json({
            statusCode: 404,
            success: false,
            action: 'Delete',
            msg: 'Post not found'
          });
        }
        } catch (err) {
        res.status(500).json({
          statusCode: 500,
          success: false,
          action: 'Delete',
          msg: 'Something went wrong. Please try again!', body: err
        });
      }
    });

        // get all posts

    router.get('/posts',async (req, res) => {
      try {
      const user = await User.findOne({ username: req.user.username})
        const posts = await Post.find({user_id: user._id});
        if (posts) {
          return res.status(200).json({
            statusCode: 200,
            success: true,
            action: 'Fetch',
            msg: 'Fetched Successfully',
            body: posts
          });
        } else {
          return res.status(404).json({
            statusCode: 404,
            success: false,
            action: 'Fetch',
            msg: 'No posts found'
          });
        }
        } catch (err) { 
        res.status(500).json({
          statusCode: 500,
          success: false,
          action: 'Fetch',
          msg: 'Something went wrong. Please try again!', body: err
        });
      }
    })
    // get post by id

    router.get('/posts/:id',async (req, res) => {
      try {
      const user = await User.findOne({ username: req.user.username})
       
      const post = await Post.findOne({ _id: req.params.id, user_id: user._id});

        if (post) {
          return res.status(200).json({
            statusCode: 200,
            success: true,
            action: 'Fetch',    
            msg: 'Fetched Successfully',
            body: post
          });
        } else {
          return res.status(404).json({
            statusCode: 404,
            success: false,
            action: 'Fetch',
            msg: 'Post not found'
          });
        }
        } catch (err) {
        res.status(500).json({
          statusCode: 500,
          success: false,
          action: 'Fetch',
          msg: 'Something went wrong. Please try again!', body: err
        });
      }
    });
  
    
module.exports =  router; 


