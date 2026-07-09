import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import productRoutes from './routes/products.js';
import Product from './models/Product.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
  });
});

// Database connection & Server startup configuration
let mongoServer = null;

async function startServer() {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('No MONGODB_URI environment variable found. Starting in-memory MongoDB server...');
    try {
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`In-memory MongoDB started at: ${mongoUri}`);
    } catch (err) {
      console.error('Failed to start in-memory MongoDB:', err);
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully!');
    
    // Seed sample data if database is empty
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

async function seedDatabase() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Seeding initial products...');
      const sampleProducts = [
        {
          name: 'Apex Pro Wireless Headphones',
          description: 'Premium active noise-cancelling over-ear headphones with 30-hour battery life and custom audio tuning. Features ultra-soft leather ear cushions, adaptive noise cancelling, and premium sound transparency mode. Supports wireless charging and fast charge.',
          price: 299.00,
          category: 'Headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          stock: 8,
          rating: 4.9,
          reviewsCount: 124
        },
        {
          name: 'Premium Leather Watch Band',
          description: 'Handcrafted genuine leather strap for smartwatches (42mm). Features Dark Brown premium leather, custom brushed steel hardware, and soft leather backing for ultimate wrist comfort. Fits wrists from 150mm to 210mm.',
          price: 98.00,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&auto=format&fit=crop&q=80',
          stock: 3, // Only 3 left - matches the UI styling badge
          rating: 4.6,
          reviewsCount: 48
        },
        {
          name: 'Braided USB-C Cable',
          description: 'Heavy duty, double-braided nylon charging and data cable. Supports up to 100W Power Delivery and high-speed data sync. Re-engineered reinforced collars prevent fraying, measuring 6ft in length.',
          price: 19.00,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80',
          stock: 25,
          rating: 4.7,
          reviewsCount: 231
        },
        {
          name: 'Laptop Sleeve Case',
          description: 'Premium envelope sleeve with soft microfiber interior lining and magnetic closure. Form-fitting design for 13-inch laptops, providing heavy-duty scratch resistance and light impact protection. Sleek Heather Gray styling.',
          price: 39.00,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
          stock: 12,
          rating: 4.5,
          reviewsCount: 89
        },
        {
          name: 'Wireless Mouse',
          description: 'Ergonomic multi-device wireless mouse. Features high-precision scroll wheel, silent-click buttons, and USB-C rechargeable battery with up to 70 days battery life. Modern matte black look.',
          price: 49.00,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
          stock: 15,
          rating: 4.4,
          reviewsCount: 110
        },
        {
          name: 'Portable Power Bank',
          description: 'Compact 10,000mAh external battery charger. Features ultra-slim profiles, dual USB-C Power Delivery ports, and high-speed charging. Can charge your smartphone up to 3 times on a single charge.',
          price: 29.00,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1609592424082-9653842c5f16?w=600&auto=format&fit=crop&q=80',
          stock: 20,
          rating: 4.3,
          reviewsCount: 74
        },
        {
          name: 'Wireless Earbuds',
          description: 'Premium wireless earbuds with charging case. High fidelity sound with immersive bass, crystal clear calls, touch control pads, and IPX7 sweat-resistant protection. Up to 20 hours total battery life.',
          price: 129.00,
          category: 'Earbuds',
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
          stock: 10,
          rating: 4.7,
          reviewsCount: 95
        },
        {
          name: 'Subwoofer Soundbar Speaker',
          description: 'High-end home theater Bluetooth speaker soundbar. Room-filling immersive stereo audio, customized sound stages, deep bass, and optical/HDMI ARC connection ports. Dark sleek aesthetic.',
          price: 349.00,
          category: 'Speakers',
          image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
          stock: 5,
          rating: 4.8,
          reviewsCount: 42
        }
      ];
      await Product.insertMany(sampleProducts);
      console.log('Successfully seeded database with products!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Shutting down gracefully...');
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
  process.exit(0);
});

startServer();
