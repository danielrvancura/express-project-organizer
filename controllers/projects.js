var express = require('express');
var db = require('../models');
var async = require('async');
var router = express.Router();

// GET /projects/new - display form for creating a new project
router.get('/new', function(req, res) {
  res.render('projects/new');
});

// GET /projects/id - display a specific project
router.get('/:id', function(req, res) {
  db.project.find({
    where: { id: req.params.id },
    include: [db.category]
  })
  .then(function(project) {
    if (!project) throw Error();
    res.render('projects/show', { project: project });
  })
  .catch(function(error) {
    console.log(error)
    res.status(400).render('main/404');
  });
})


router.get('/', function(req, res){
  db.project.findAll().then(function(projects){
    res.render('projects/show', {projects: projects});
  }).catch(function(err) {
    console.log(err);
  });
});


//POST /projects - create a new project
// router.post('/', function(req, res) {
//   db.project.create({
//     name: req.body.name,
//     githubLink: req.body.githubLink,
//     deployedLink: req.body.deployedLink,
//     description: req.body.description
//   })
//   .then(function(project) {
//     res.redirect('/'); //async
//   })
//   .catch(function(error) {
//     res.status(400).render('main/404');
//   });
// });
//// orginal

router.post('/', function(req, res) {
  //change my comma-separated tags into an array of TAGS
  console.log(1);
  var categories = [];
  if(req.body.categories){
    categories = req.body.categories.split(',');
  }
  console.log(req.body)
  console.log(categories)
  console.log(1);
  db.project.create({
    name: req.body.name,
    githubLink: req.body.githubLink,
    deployedLink: req.body.deployedLink,
    description: req.body.description
  })
  .then(function(project) {
    console.log(1);
    // handle adding the tags if there are any
    if(categories.length > 0){
      //add some tags
      // make a loop through the tag array
      async.forEach(categories, function(cat, callback){
        // this is the iterator function
        //add the tag to the tags table
        console.log(1);

        db.category.findOrCreate({
          where: {name: cat.trim()}
        }).spread(function(newCategory, wasCreated){
        // add the relationship between the post and tag in the posts_tags table
        project.addCategory(newCategory).then(function(){
          console.log(1);
          callback(); // this says that it's done
        });
      });
      }, function(){
        console.log(1);
        // this is the function that runs when everything is resolved/done
        // redirect to post page
        res.redirect('/');
      });
};

});

});



module.exports = router;
