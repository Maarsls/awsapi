var router = require("express").Router();
const Blog = require("../model/blog");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  Blog.find()
    .exec()
    .then(function (blog) {
      console.log(blog);
      res.send(blog);
    });
});

router.post("/", auth, async (req, res) => {
  const entryRes = await Blog.create(req.body.entry);

  res.send(entryRes);
});

router.get("/about", function (req, res) {
  res.send("About Page");
});

module.exports = router;
