'use strict';

const AWS = require('aws-sdk');
const fs  = require('fs');
AWS.config.loadFromPath( "./.ymuto_config.json" ); 

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

/*
 var params = {
  Code: {
  }, 
  Description: "test", 
  FunctionName: "MyFunction", 
  Handler: "index.handler", // is of the form of the name of your source file and then name of your function handler
  MemorySize: 128, 
  Publish: true, 
  Role: "arn:aws:iam::452180456920:role/test", // replace with the actual arn of the execution role you created
  Runtime: "nodejs4.3", 
  Timeout: 15, 
  VpcConfig: {
  }
 };
*/

let _callbackError = ( err ) => {
  return Promise.reject(err);
};

exports.createBucket = ( bucketName ) => {
  let params = {
    Bucket: bucketName
  };

  return s3.createBucket( params ).promise().then( ( v ) => {
    return Promise.resolve( v );
  }, _callbackError );
};

exports.deleteObject = ( bucketName, objectKeyName ) => {
  let params = {
    Bucket : bucketName,
    Key : objectKeyName
  };

  return s3.deleteObject( params ).promise().then( ( v ) => {
    return Promise.resolve( v );
  }, _callbackError );
}

exports.putObjectFile = ( bucketName, keyName, filePath, contentType, callbackSuccess, callbackError ) => {

  var bodyFile = fs.readFileSync(filePath);

  let params = {
    Bucket : bucketName,
    Key: keyName,
    ContentType: contentType,
    Body: bodyFile,
    ACL: "private"
  };
  

  return s3.putObject( params ).promise().then( ( v ) => {
    if ( callbackSuccess ) {
      return callbackSuccess( v );
    }
    return Promise.resolve( v );
  }, ( err ) => {
    if ( callbackError ) {
      return callbackError( error );
    }
    return _callbackError ( err );
  });
}

exports.putObjectString = ( bucketName, keyName, bodyString, contentType, callbackSuccess, callbackError ) => {

  let ct = "text/plain";
  if ( contentType ) {
    ct = contentType;
  }

  let params = {
    Bucket : bucketName,
    Key: keyName,
    ContentType: contentType,
    Body: bodyString,
    ACL: "private"
  };

  return s3.putObject( params ).promise().then( ( v ) => {
    if ( callbackSuccess ) {
      return callbackSuccess( v );
    }
    return Promise.resolve( v );
  }, _callbackError );
};

exports.getObjectJson = ( bucketName, keyName ) => {
  return exports.getObject( bucketName, keyName, (v)=>{ return Promise.resolve( JSON.parse(v.Body) ) } );
}

exports.getObject = ( bucketName, keyName, callbackSuccess, callbackError ) => {

  let params = {
    Bucket : bucketName,
    Key : keyName
  };

  return s3.getObject( params ).promise().then( ( v ) => {
    if ( callbackSuccess ) {
      return callbackSuccess( v );
    }
    return Promise.resolve( v );
  }, ( err ) => {
    if ( callbackError ) {
      return callbackError( err );
    }
    return _callbackError( err );
  });
};
