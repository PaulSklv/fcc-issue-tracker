/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const { MongoClient, ObjectID } = require('mongodb')
const connection = MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = function (app, issuesCollection) {
  
  app.route('/api/issues/:project')
  
    .get(function (req, res) {
      connection.then(client => {
        client.db('issueTracker').collection(req.params.project).find({}).toArray().then((result) => {
          res.send(result);
        }).catch(error => {
          return console.log("Error was occured!", error)
        });
      }).catch(error => {
        return console.log("Error was occured!", error)
      });
    })
    
    .post(function (req, res){
      var { issue_title, issue_text, created_by, asigned_to, status_text } = req.body;
      connection.then(client => {
        client.db('issueTracker').collection(req.params.project).insertOne({
          issue_title,
          issue_text,
          created_by,
          asigned_to,
          status_text,
          open: "open",
          created_on: new Date(),
          updated_on: new Date()
        }).then(() => res.redirect('/' + req.params.project + '/')).catch(error => {return console.log('Error was occured!', error)})
      }).catch(error => {return console.log('Error was occured!', error)})
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
        issuesCollection.update({_id: new ObjectID(req.body._id)}, { $set: { ...rest, updated_on: new Date()} }, (err, issue) => {
          if(err) res.send('Could not update');
          else console.log(issue);
        }).catch(() => res.send('Could not update'))
      } else res.send('no updated field sent');
    })
    
    .delete(function (req, res){
      issuesCollection.findOneAndDelete({_id: new ObjectID(req.body._id)}, (err, issue) => {
        if(err) console.log(err);
        else res.redirect('/' + req.params.project + '/')
      })
      
    });
    
};
