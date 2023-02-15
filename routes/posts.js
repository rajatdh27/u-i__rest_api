const router = require("express").Router();
const Post = require("../model/Post");

//create a post
router.get("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a post
//like a post
//get a post
//get all posts

module.exports = router;
