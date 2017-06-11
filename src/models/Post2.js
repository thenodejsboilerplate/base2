//./models/Post.js
// grab the things we need
'use strict';
const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  User = require('./User'),
  moment = require('moment');
const mongoose_delete = require('mongoose-delete');
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


//we use population here. we can use like:
    // let Post = mongoose.model('Post', postSchema);
    // Post.findOne({'title': /azat/i})
    //     .populate('author')
    //     .exec(function(err, post){
    //         //process err
    //         console.log(post.author.username);
    //     });

//or we can filter it  like
/**
 *      Post.findOne({'title': /azat/i})
 *      .populate({
 *         path: 'author',
 *         select: '_id username email'
 *         match: {text: /node\.js/i},
 *         options: {limit: 10, sort: '_id'}
 *    
 *      })
 * 
 */
var postSchema = new Schema({
  //population,type can be String, Number,Buffer,ObjectId
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true, min: 4 },
//   slug: {
//       type: String,
//       set: function(slug){
//           return slug.toLowerCase();
//       }
//   },
  content: { type: String, required: true, min:100 },//,match: /[0-9a-zA-Z_-]/
//intro: {type: String, required: true, min: 20},
//comments: [{ body: String, date: Date }],
//   pv: {
//       type: Number, 
//       default: 0,
//       validate: [
//           function(pv){
//             return pv > -1
//           }, 'invalid pv'
//       ],
//   },
  image: String,
  like: {type: Number, default: 0},
  hidden: {type: Boolean, default: 'false'},
  great:{type: Boolean, default: 'false'},      
  // created_at: {type: Date, default: Date.now()},
  // updated_at: {type: Date, default: Date.now()},
     
   
}, {timestamps: true});
//or set getter method using SchemaType.get(fn)
//postSchema.path('title').get(function(value){
//     if(value) return value;
//     return this.posts.length;
// });

postSchema.plugin(mongoose_delete,{ deletedAt : true, deletedBy : true});

// on every save, add the date
// postSchema.pre('save', function(next) {
//   // get the current date
//   const currentDate = new Date();
  
//   // change the updated_at field to current date: do not leave .local
//   this.updated_at = currentDate;

//   // if created_at doesn't exist, add to that field
//   if (!this.created_at){
//     this.created_at = currentDate;
//   }
//   next();
// });

postSchema.methods.time = time=> {
  return moment(time).format('L');
};

// postSchema.methods.processPost = (post)=>{

//   return {
//     _id:post._id,
//     author: post.author,
//     title: post.title,
//     intro: post.content.slice(0,100),
//     content: post.content,  
//     image:post.image,
//     pv: post.pv,

//     created_at: post.time(post.created_at),
//     updated_at: post.time(post.updated_at),            
//   };  

// };
//or:

postSchema.virtual('safeUser').get(function(){
  return {
    _id:this._id,
    author: this.author,
    title: this.title,
    intro: this.content.slice(0,100),
    content: this.content,  
    image:this.image,
    pv: this.pv,

    created_at: this.time(this.created_at),
    updated_at: this.time(this.updated_at),            
  }; 
});


// make this available to our users in our Node applications
module.exports = mongoose.model('Post', postSchema);