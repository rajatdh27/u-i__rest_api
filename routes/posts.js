const router = require("express").Router();
const Post = require("../model/Post");
const User = require("../model/User");

//create a post
router.get("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.log(err);
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
      res.status(403).json("you can like only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(req.body, post.userId);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//like a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/profile/:username", async (req, res) => {
  try {
    console.log(1);
    const user = await User.findOne({ username: req.params.username });
    console.log(2);
    const posts = await Post.find({ userId: user._id });
    console.log(3);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get all posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const postArray = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followers.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(postArray.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
