const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const htmlspecialchars = require('htmlspecialchars');

const app = express();

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for session management
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true
}));

// Load data from JSON file or create if it doesn't exist
let users = {};
const dataFilePath = './data.json';
if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    users = JSON.parse(data);
} else {
    fs.writeFileSync(dataFilePath, JSON.stringify(users), 'utf8');
}

// Update JSON file with new data
const updateData = (res) =>
    fs.writeFile(dataFilePath, JSON.stringify(users), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to data file:', err);
            res.send('Error occurred while saving data.');
        }
    });

// Login page
app.get('/', (req, res) => {
    if (req.session.username) {
        // If user is already logged in, redirect to user information page
        res.redirect('/info');
    } else {
        // Otherwise, render the login page
        res.send(`
            <h1>Login</h1>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
        `);
    }
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Simulated authentication
    if (users[username] && users[username].password === password) {
        req.session.username = username;
        res.redirect('/info');
    } else {
        res.send('Invalid username or password.');
    }
});

// User information form
app.get('/info', (req, res) => {
    if (req.session.username) {
        res.send(`
            <h1>User Information</h1>
            <form action="/info" method="POST">
                <input type="text" name="name" placeholder="Name" required><br>
                <input type="text" name="address" placeholder="Address" required><br>
                <input type="text" name="jobTitle" placeholder="Job Title" required><br>
                <button type="submit">Submit</button>
            </form>
        `);
    } else {
        res.redirect('/');
    }
});

// Store user information
app.post('/info', (req, res) => {
    const { name, address, jobTitle } = req.body;
    const username = req.session.username;
    // Store user information in the database
    users[username] = { ...users[username], name, address, jobTitle };

    updateData(res);
    res.redirect('/user-info');
});

// Display user information
app.get('/user-info', (req, res) => {
    if (req.session.username && users[req.session.username]) {
        const userInfo = users[req.session.username];
        const encodedAddress = htmlspecialchars(userInfo.address);
        res.send(`
            <h1>User Information</h1>
            <p><strong>Name:</strong> ${userInfo.name}</p>
            <p><strong>Address:</strong> ${encodedAddress}</p>
            <p><strong>Job Title:</strong> ${userInfo.jobTitle}</p>
            <p><a href="/">Back to Home</a></p>
        `);
    } else {
        res.redirect('/');
    }
});

// Register page
app.get('/register', (req, res) => {
    res.send(`
        <h1>Register</h1>
        <form action="/register" method="POST">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Register</button>
        </form>
    `);
});

// Register route
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Simulated registration
    if (!users[username]) {
        users[username] = { password };
        updateData(res);
        res.redirect('/');
    } else {
        res.send('Username already exists.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
