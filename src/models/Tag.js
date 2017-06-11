//./models/Tag.js
"use strict";
const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      User = require('../models/User'),
      Post = require('../models/Post'),
      moment = require('moment');

// create a schema
//The allowed SchemaTypes are:
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array
var tagSchema = new Schema({
          user_id: { type: String, required: true },
          post_id: { type: String, required: true },
          name: { type: String, required: true},
          count: { type: Number, required: true, default: 0},
   
}, {timestamps: true});


tagSchema.methods.time = time=> {
    return moment(time).format('L');
};

tagSchema.methods.processTag = tag=>{

    let tagsArray = tag.split(',');
    return {
        _id:tag._id,
        user_id: tag.user_id,
        post_id: tag.post_id,
        name: post.name,
        tags: tagsArray, 
        created_at: tag.time(tag.created_at),
        updated_at: tag.time(tag.updated_at),            
    };
};


tagSchema.methods.posts = tag=>{

         Post.findById(tag.post_id).exec((err,user)=>{
                if(err){
                    console.log(`cannot catch user,error: ${err}`);
                    req.flash('error',`error in find user for ${user_id}`);
                    res.redirect('back');							
                }else{
                    console.log(user);
                    let modifiedUser = user.processUser(user)
                    console.log(modifiedUser);
                    fn(modifiedUser);
                  
              }
        });

};



// make this available to our users in our Node applications
module.exports = mongoose.model('Tag', tagSchema);