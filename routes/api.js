
/**********************************
    CouchDb configuration and setup
    **********************************/
var cradle = require('cradle'),
    config = require('../config/db')['development']; 

var conn = new(cradle.Connection)(config.url, config.port, {
  cache: true,
  raw: false
});

var db = conn.database(config.database);
db.create();


/**
  Post Model
**/
var Post = exports.Post = function () {
};

/**
  List all posts
**/
Post.prototype.list = function(req,res){
  var posts = [];
  db.view('posts/all', function(error , results){
    if(error)
      res.json(false);
    else{

      results.forEach(function(id,post){
        posts.push({
          id:id,
          title: post.title,
          text: post.text
        });
      });

      res.json({ posts:posts });  
    }
  });
};


/**
  Show Post by Id
**/
Post.prototype.show = function(req,res){
  var id = req.params.id;
  db.get(id, function(err, doc){
    if(err){
      res.json(false);  
    }else{
      res.json({
        post: doc
      });
    }
  });
};


/**
  Create a new Post
**/
Post.prototype.create = function(req,res){
  var post = req.body;
  post.resource = 'Post';
  db.save(post, function (err, ret) {
    if (err) {
      res.json(false);
    }
    res.json(post);
  });
};

/**
  Update Post
**/
Post.prototype.update = function(req, res){
  var id = req.params.id;
  var post = req.body;
  post.resource = 'Post';
  db.merge(id, post, function(err,result){
    if(err)
      res.json(false);
    else
      res.json(true);
  });
};

/**
  Destroy a Post
**/
Post.prototype.destroy = function(req, res){
  var id = req.params.id;
  db.remove(id, function(err,result){
    if(err)
      res.json(false);  
    else
      res.json(true);
  });
};
