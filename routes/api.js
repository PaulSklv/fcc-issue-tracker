/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;



module.exports = function (app, issuesCollection) {
  
  app.route('/api/issues/:project')
  
    .get(function (req, res) {
      MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
          return console.log('Unable to connect to database!');
        }

        client.db('issueTracker').collection('issues').find(req.query, (err, issues) => {
          if(err) console.log(err);
          else {
            console.log(issues.ops)
            // issues.toArray((err, array) => {
            //   if(err) console.log(err)
            //   else res.send(array);
            // })
          }
        }); 
      })
      // dataBaseCollection().find(req.query, (err, issues) => {
      //   if(err) console.log(err);
      //   else {
      //     issues.toArray((err, array) => {
      //       if(err) console.log(err)
      //       else res.send(array);
      //     })
      //   }
      // })
    })
    
    .post(function (req, res){
      var { issue_title, issue_text, created_by, asigned_to, status_text } = req.body;
      issuesCollection.insertOne({
          issue_title,
          issue_text,
          created_by,
          asigned_to,
          status_text,
          open: "open",
          created_on: new Date(),
          updated_on: new Date()
        }, (err, issue) => {
        if(err) {
          console.log("Error was occured.");
          res.redirect('/' + req.params.project + '/')
        } else res.redirect('/' + req.params.project + '/')
      });
    })
    
    .put(function (req, res){
      const { _id, ...rest } = req.body;
      const keys = Object.keys(rest); 
      let noField = true;
      keys.forEach(el => {
        if(rest[el] !== '') {
          noField = false;
        }
      })
      if(!noField) {
        issuesCollection.update({_id: new ObjectId(req.body._id)}, { $set: { ...rest, updated_on: new Date()} }, (err, issue) => {
          if(err) res.send('Could not update');
          else console.log(issue);
        }).catch(() => res.send('Could not update'))
      } else res.send('no updated field sent');
    })
    
    .delete(function (req, res){
      issuesCollection.findOneAndDelete({_id: new ObjectId(req.body._id)}, (err, issue) => {
        if(err) console.log(err);
        else res.redirect('/' + req.params.project + '/')
      })
      
    });
    
};
