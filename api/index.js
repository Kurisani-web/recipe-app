const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({storage});

mongoose
  .connect('mongodb+srv://sujan:sujan@cluster0.rpdk2vy.mongodb.net/')
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => {
    console.log('Error connecting to mongodb', err);
  });

app.listen(3000, () => console.log('Server running on port 3000'));

const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');

const SECRET_KEY = 'q8nFv3!xRu7@pZwE#bC2$JtL9^dHkX5gVuY1*mZn';

app.post('/api/register', async (req, res) => {
  try {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({message: 'Name email nd password are req'});
    }
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'Email already registered'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({name, email, password: hashedPassword});

    await user.save();

    const token = jwt.sign(
      {id: user._id, email: user.email, name: user.name},
      SECRET_KEY,
      {expiresIn: '9h'},
    );
    res.json({token, user: {id: user._id, email: user.email, name: user.name}});
  } catch (error) {
    console.log('Error registering', error);
    res.status(500).json({message: 'Internal server error'});
  }
});

app.post('/api/login', async (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).json({message: 'Email and password are req'});
  }
  const user = await User.findOne({email});
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({message: 'Invalid credentials'});

  const token = jwt.sign(
    {id: user._id, email: user.email, name: user.name},
    SECRET_KEY,
    {expiresIn: '9h'},
  );
  res.json({token, user: {id: user._id, email: user.email, name: user.name}});
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('auth header', authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({message: 'Access denied'});
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('JWT verification error', err.message);
      if (err.name == 'TokenExpiredError')
        return res
          .status(401)
          .json({message: 'Token expired, please login again'});
    }
    req.user = user;
    next();
  });
};

app.post(
  '/api/posts',
  authenticateToken,
  upload.single('image'),
  async (req, res) => {
    const {recipeName, description} = req.body;

    if (!recipeName || !description) {
      return res.status(400).json({message: 'Recipe name and description req'});
    }
    if (!req.file) return res.status(400).json({message: 'Image is required'});

    const post = new Post({
      userId: req.user.id,
      recipeName,
      description,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    try {
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({message: 'Error saving post', error});
    }
  },
);

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name email')
      .sort({createdAt: -1})
      .limit(20);

    res.json(posts);
  } catch (error) {
    res.status(500).json({message: 'Error fetching posts', error});
  }
});

app.post('/api/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({message: 'Post not found'});

    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      await post.save();
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({message: 'Error liking post'});
  }
});

app.post('/api/posts/:id/comments', authenticateToken, async (req, res) => {
  const {text} = req.body;
  if (!text) return res.status(400).json({message: 'Comment text is required'});
  try {
    const comment = new Comment({
      postId: req.params.id,
      userId: req.user.id,
      text,
    });
    await comment.save();
    const post = await Post.findById(req.params.id);
    if (post) {
      post.comments.push(comment._id);
      await post.save();
    }
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({message: 'Error adding comment', err});
  }
});

app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({postId: req.params.id})
      .populate('userId', 'name email')
      .sort({createdAt: -1});

    res.json(comments);
  } catch (err) {
    res.status(500).json({message: 'Error getting comments', err});
  }
});


app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'name email').populate('comments', 'text userId createdAt');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
})