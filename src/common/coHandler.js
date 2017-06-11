'use strict';
const co = require('co');
const logger = require('../libs/logger');

const env = process.env.NODE_ENV || 'test';

module.exports = (handle) => {
    
    co(handle)
            .catch((err) => {
              logger.debug('into error handler');
              logger.error(`
                req: ${req},
                err: ${err},
                `
              );
              // if(err.constructor.name === 'MessageError') {
              //   res.json({
              //     Code: -20000,
              //     Message: err.message
              //   });
              // }
              if(env ==='test' || env === 'develop'){
                res.json({
                  Code: -1000,
                  Message: err.stack
                });
              } else if(env === 'production') {
                res.json({
                  Code: -1000,
                  Message: '操作失败 '
                });
              }
            });

};
