const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cron = require('node-cron')
const Posts = require('./model/posts');


dotenv.config();

const app = express();
app.use(express.json());

const postRouter = require('./controllers/post_management/post_management_controller');
const User = require('./model/user');
app.use('/api', authenticateToken, postRouter);

//MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('MongoDB connection error:', err));


// Define a function that will be executed by the cron job
const performScheduledTask = async () => {
    const scheduledTime = await Posts.find();

    scheduledTime.map((time) => {
        const currentTime = new Date().toLocaleString();
        const postTime = new Date(time.scheduled_at).toLocaleString();
        if (currentTime >= postTime && time.status === 'scheduled') {
            console.log(`Post ID: ${time._id} is scheduled to be published now.`);
            time.status = 'published'; 
            time.save(); // Save the updated post
        }   
    });
    // console.log('Running a scheduled task:', new Date().toLocaleTimeString());
};

// Schedule the cron job
cron.schedule('* * * * *', () => {
    performScheduledTask();
});

// JWT middleware to authenticate a token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // If there's no token, return Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // If the token is invalid, return Forbidden
        }
        
        req.user = user;
        next();
    });
}

// === ROUTES ===

// Register a new user
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
});

// Login and get a JWT
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user == null) {
            return res.status(400).json({ message: 'User not found.' });
        }
        
        if (await bcrypt.compare(password, user.password)) {
            // Create the JWT
            const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Logged in successfully.', token: accessToken });
        } else {
            res.status(401).json({ message: 'Invalid password.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
