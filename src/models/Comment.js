//./models/Post.js
// grab the things we need
"use strict";
const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      User = require('../models/User'),
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
var commentSchema = new Schema({

          user_id: { type: String, required: true },
          post_id: { type: String, required: true },
          author: { type: String, required: true },
          content: { type: String, required: true, min:100 },//,match: /[0-9a-zA-Z_-]/
          hidden: {type: Boolean, default: 'false'},
          comment: { type: String },
          meta: {
            votes: Number,
            favs:  Number
          }
}, {timestamps: true});


commentSchema.methods.time = time=> {
    return moment(time).format('L');
};

commentSchema.methods.processComment = comment=>{
    return {
        _id:comment._id,
        user_id: comment.user_id,
        post_id: comment.post_id,
        author: comment.author,
        content: comment.content,   
        hidden: comment.hidden,      
        created_at: comment.time(comment.created_at),
        updated_at: comment.time(comment.updated_at),     
    };
};




// make this available to our users in our Node applications
module.exports = mongoose.model('Comment', commentSchema);