// User Controller Implementation
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
    // Destructure username, email, and password from request body
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save(); // Save the new user to the database
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        // Handle any errors that occur during user registration
        res.status(500).json({ error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    // Destructure email and password from request body
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token }); // Send the token back to the client
    } catch (error) {
        // Handle any errors that occur during login
        res.status(500).json({ error: error.message });
    }
};

// Update user information
const updateUser = async (req, res) => {
    // Destructure username, email, and password from request body
    const { username, email, password } = req.body;
    const { username: userParam } = req.params; // Extract username from request parameters

    try {
        // Find user by username from request parameters
        const user = await User.findOne({ username: userParam });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields if provided
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            // Hash new password if provided
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save(); // Save the updated user to the database
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        // Handle any errors that occur during user update
        res.status(500).json({ error: error.message });
    }
};

// Export the user controller functions for use in routes
module.exports = { registerUser, loginUser, updateUser };