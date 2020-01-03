/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app, issuesCollection) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      iss
    })
    
    .post(function (req, res){
      var project = req.body;
      console.log(project)
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
