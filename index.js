'use strict';

const AWS = require('aws-sdk');
AWS.config.loadFromPath( "./.ymuto_config.json" ); 

const s3 = new AWS.S3();

let _isLogger = false;

let print = ( params ) => {
  if ( _isLogger ) {
    console.log( JSON.stringify( params ) );
  };
};

exports.scn = ( params ) => {
  let p = {};
    p = {
      Bucket : params.bucket_name,
      Key    : params.file_path
    };
  return s3.getObject( p ).promise().then( ( v ) => {
    print( p );
    let result = JSON.parse( v.Body.toString() );
    print( result );
    return Promise.resolve( result );
  });
}

exports.scnAlias = ( params, aliasVersion = "" ) => {

  let p = {};

  if ( aliasVersion == "" )
  {
    p = {
      Bucket: params.bucket_name,
      Key: params.file_path
    };
  }
  else 
  {
    let bucketAlias = params.bucket_name + "/" + aliasVersion;
    p = {
      Bucket : bucketAlias,
      Key    : params.file_path
    };
  }

  return s3.getObject( p ).promise().then( ( v ) => {
    print( p );
    let result = JSON.parse( v.Body.toString() );
    print( result );
    return Promise.resolve( result );
  });
};
