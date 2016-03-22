'use strict';

const config = require('config');
const request = require('request');

var dryrun = config.get('dryrun');
var sourceUrl = config.get('source.host');
var sourceBucket = config.get('source.bucket');
var targetUrl = config.get('target.host');
var targetBucket = config.get('target.bucket');

function getDesignDocuments(url, bucket, callback) {
  console.log(`retrieving deisgn docs from: ${url}`);
  var options = {
    uri: `${url}:8091/pools/default/buckets/default/ddocs`,
    mehtod: 'GET'
  };
  console.log(options);
  request(options, function (err, response, body) {
    return callback(err, body);
  });
}

function setDesignDoc(url, bucket, designDoc, callback) {
  console.log(`creating design doc: ${designDoc.name}`);
  var options = {
    uri: `${url}:8092/${bucket}/_design/${designDoc.name}`,
    method: 'PUT',
    json: {
      views: designDoc.views
    }
  };
  console.log(options);
  request(options, function (err, response, body) {
    return callback(err, body);
  });
}

getDesignDocuments(sourceUrl, sourceBucket, function (err, result) {
  if (err) {
    console.log(`Error retrieving design documents from ${sourceUrl} - ${err}`);
    return;
  }

  var data = JSON.parse(result);
  for (var i = 0; i < data.rows.length; i++) {
    var row = data.rows[i];
    var designDoc = {
      name: row.doc.meta.id.substr(8),
      views: row.doc.json.views
    };

    if (dryrun) {
      console.log(designDoc.name);
    } else {
      setDesignDoc(targetUrl, targetBucket, designDoc, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });
    }
  }
});
