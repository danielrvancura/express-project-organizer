var express = require('express');
var db = require('../models');
var router = express.Router();

//get all categories
router.get('/', function(req, res){
  db.category.findAll().then(function(categories){
    res.render('categories/all',{categories: categories});
  }).catch(function(err) {
    console.log('categories/all');
  });
});

router.get('/:id', function(req, res){
  db.category.findOne({
    where: {id: req.params.id},
    // include: [db.projects]
  }).then(function(category){
    category.getProjects().then(function(projects) {
     res.render('categories/show', { projects:projects, category:category })
    });
  });
});

// GET /categories new - display form for creating a new project
// router.get('/new', function(req, res) {
//   console.log('category route');
//   res.render('categories/');
// });

//
// // POST /projects - create a new project
// router.post('/', function(req, res) {
//   db.category.create({
//     name: req.body.name,
//     githubLink: req.body.githubLink,
//     deployedLink: req.body.deployedLink,
//     description: req.body.description
//   })
//   .then(function(category) {
//     res.redirect('/');
//   })
//   .catch(function(error) {
//     console.log(error)
//     res.status(400).render('main/404');
//   });
// });




// GET /projects/:id - display a specific project
// router.get('/:id', function(req, res) {
//   db.category.find({
//     where: { id: req.params.id }
//   })
//   .then(function(category) {
//     if (!category) throw Error();
//     res.render('categories/show', { category: category});
//   })
//   .catch(function(error) {
//     res.status(400).render('main/404');
//   });
// });



module.exports = router;
