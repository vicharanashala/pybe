const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set. Add your MongoDB Atlas connection string to backend/.env (see .env.example).');
  process.exit(1);
}

const User = require('../models/User');

/**
 * Creates (or resets the password of) the single admin account used to
 * access the admin dashboard. Admin accounts are never created through the
 * public /api/auth/register endpoint — this script is the only way in.
 *
 * Override the defaults via env vars before running, e.g.:
 *   ADMIN_EMAIL=you@pybe.dev ADMIN_PASSWORD='something-strong' npm run seed:admin
 *
 * IMPORTANT: change ADMIN_PASSWORD (or edit the default below) before
 * deploying anywhere other than your own machine.
 */
const ADMIN_NAME = process.env.ADMIN_NAME || 'PyBe Admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pybe.dev';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const admin = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashed,
        role: 'admin',
        onboardingComplete: true // admins skip the learner onboarding flow
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Admin account ready: ${admin.email}`);
    console.log(`   Sign in at /login with:`);
    console.log(`     email:    ${ADMIN_EMAIL}`);
    console.log(`     password: ${ADMIN_PASSWORD}`);
    console.log('   (change ADMIN_PASSWORD and re-run this script to rotate it)');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
