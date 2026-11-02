const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const PROFILES_FILE = path.join(__dirname, '../data/user_profiles.json');

/**
 * @route POST /api/users/profile
 * @desc Saves or updates a user profile in user_profiles.json for frictionless persistence.
 */
router.post('/profile', (req, res) => {
    try {
        const { name, age, interests } = req.body;
        if (!name || !age) {
            return res.status(400).json({ success: false, error: "Name and age are required." });
        }
        
        let profiles = [];
        if (fs.existsSync(PROFILES_FILE)) {
            const data = fs.readFileSync(PROFILES_FILE, 'utf8');
            try { profiles = JSON.parse(data); } catch (e) { profiles = []; }
        }
        
        const newProfile = {
            id: 'user_' + Date.now(),
            name,
            age: Number(age),
            interests: interests || [],
            createdAt: new Date().toISOString()
        };
        
        // Update or add profile
        const idx = profiles.findIndex(p => p.name === name);
        if (idx >= 0) {
            profiles[idx] = { ...profiles[idx], ...newProfile };
        } else {
            profiles.push(newProfile);
        }
        
        fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf8');
        res.status(200).json({ success: true, data: newProfile });
    } catch (error) {
        console.error("[PyBe Error] Failed to save profile:", error.message);
        res.status(500).json({ success: false, error: "Server error saving profile." });
    }
});

module.exports = router;
