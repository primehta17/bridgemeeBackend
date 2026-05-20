import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Plan from '../models/Plan.js';

const plans = [
  {
    name: 'Basic',
    description: 'Essential features for individuals getting started.',
    price: 9.99,
    durationMonths: 1,
    features: ['Email support', '5 projects', '1 GB storage'],
  },
  {
    name: 'Pro',
    description: 'Advanced tools for growing teams and power users.',
    price: 29.99,
    durationMonths: 1,
    features: ['Priority support', 'Unlimited projects', '50 GB storage', 'Analytics'],
  },
  {
    name: 'Enterprise',
    description: 'Full platform access with dedicated support.',
    price: 99.99,
    durationMonths: 12,
    features: ['24/7 support', 'SSO', 'Custom integrations', 'SLA'],
  },
];

const run = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/subscription_portal';
  await mongoose.connect(uri);

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Portal Admin';

  let admin = await User.findOne({ email: email.toLowerCase() });
  if (!admin) {
    admin = await User.create({ name, email, password, role: 'admin' });
    console.log(`Admin created: ${email}`);
  } else {
    admin.role = 'admin';
    await admin.save();
    console.log(`Admin already exists: ${email}`);
  }

  const count = await Plan.countDocuments();
  if (count === 0) {
    await Plan.insertMany(plans);
    console.log(`Seeded ${plans.length} subscription plans`);
  } else {
    console.log('Plans already exist, skipping plan seed');
  }

  await mongoose.disconnect();
  console.log('Seed complete');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
