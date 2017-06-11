// ./models/User.js
'use strict';
const mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  moment = require('moment'),
  helper = require('../libs/utility'),
     // logger = require('./logger'),
  Schema = mongoose.Schema;

// create a schema
// The allowed SchemaTypes are:
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array
var userSchema = new Schema({
  local: {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true,min: 4 },
      password: { type: String, required: true },//,match: /[0-9a-zA-Z_-]/

      active: {type:Boolean, required: true, default: true },
      logo: {type: String},
      //Properties resetPasswordToken and resetPassword are not part of the above document, because they are set only after password reset is submitted. And since we haven’t specified default values, those properties will not be set when creating a new user.
      resetPasswordToken: String,
      resetPasswordExpires: Date,
      roles:[String],
      admin: {Boolean: Boolean, default: false},
      //location: String,
      meta: {
        age: Number
        //website: String
      }
  },
  github: {
    id: String,
    token: String,
    email: String,
    name: String
  },
    // twitter          : {
    //     id           : String,
    //     token        : String,
    //     displayName  : String,
    //     username     : String
    // },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

// userSchema.post...
// userSchema.post('save',function(doc){
//     consle.log(doc._id);
// });
// userSchema.post('save',function(doc,next){
//     consle.log('post1');
//     next();
// });
// on every save, add the date
// userSchema.pre('save', function (next) {
//   // get the current date
//   var currentDate = new Date();

//   // change the updated_at field to current date: do not leave .local
//   this.local.updated_at = currentDate;

//   // if created_at doesn't exist, add to that field
//   if (!this.created_at) {
//     this.local.created_at = currentDate;
//   }

//   // //for pw,use this, we do not need generateHahs method below. But seems not woring???
//   // var user = this;
//   // var SALT_FACTOR = 5;

//   // if (!user.isModified('password')) {return next();}

//   // bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
//   //   //genSalt(rounds, callback)
//   //       // rounds - [OPTIONAL] - the number of rounds to process the data for. (default - 10)
//   //       // callback - [REQUIRED] - a callback to be fired once the salt has been generated.
//   //       // error - First parameter to the callback detailing any errors.
//   //       // result - Second parameter to the callback providing the generated salt.
//   //   if (err) return next(err);

//   //   bcrypt.hash(user.password, salt, null, function(err, hash) {
//   //   // hash(data, salt, progress, cb)
//   //       // data - [REQUIRED] - the data to be encrypted.
//   //       // salt - [REQUIRED] - the salt to be used to hash the password.
//   //       // progress - a callback to be called during the hash calculation to signify progress
//   //       // callback - [REQUIRED] - a callback to be fired once the data has been encrypted.
//   //       // error - First parameter to the callback detailing any errors.
//   //       // result - Second parameter to the callback providing the encrypted form.
//   //     if (err) return next(err);
//   //     user.password = hash;
//   //   });
//   // });

//   next();
// });

// pre and post save() hooks are not executed on update(), findOneAndUpdate() etc
// userSchema.pre('update', function (next) {
//   let now = Date.now();
//   this.update({'_id': this._id}, {$set: {'updated_at': now}});
//   next();
// });

// userSchema.pre('findOneAndUpdate', function (next) {
//   let now = Date.now();
//   this.update({'_id': this._id}, {$set: {'updated_at': now}});
//   next();
// });

// methods ======================

// generating a hash
userSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// checking if password is valid

// in arrow-functions , the 'this'' value of the following statement is : window; // or the global object
// as to arrow function inside a function,  it's the this of the outer function
// arrow function expressions are best suited for non-method functions.
userSchema.methods.validPassword = password => {
  return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.time = time => {
  return moment(time).format('L');
};

userSchema.methods.processUser = user => {
  return {
        _id: user._id,
        username: user.local.username,
        email: user.local.email,
        logo: user.local.logo,
        roles: user.local.roles,
        admin: user.local.admin,
        active: user.local.active,      
        created_at: moment(user.local.created_at).format('L'),
        updated_at: moment(user.local.updated_at).format('L')

  };
};



// the schema is useless so far
// we need to create a model using it

// make this available to our users in our Node applications
module.exports = mongoose.model('User', userSchema);
