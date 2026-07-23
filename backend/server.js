import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
// ponytail: allow requested origins for frontend clients
app.use(cors({
  origin: ['https://tukufy-shop.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

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
    // Seed default admin user if none exists
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found. Creating default admin user...');
      await User.create({
        name: 'Admin',
        email: 'admin@tukufy.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Default admin created: admin@tukufy.com / admin123');
    }

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
          reviewsCount: 124,
          specifications: [
            { key: 'Driver Size', value: '40mm Neodymium' },
            { key: 'Frequency Response', value: '4 Hz – 40 kHz' },
            { key: 'Noise Cancelling', value: 'Adaptive ANC (Hybrid)' },
            { key: 'Battery Life', value: '30 hours (ANC on)' },
            { key: 'Connectivity', value: 'Bluetooth 5.3 / USB-C / 3.5mm' },
            { key: 'Weight', value: '250g' },
            { key: 'Charging', value: 'USB-C Fast Charge + Wireless' },
            { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
          ]
        },
        {
          name: 'Premium Leather Watch Band',
          description: 'Handcrafted genuine leather strap for smartwatches (42mm). Features Dark Brown premium leather, custom brushed steel hardware, and soft leather backing for ultimate wrist comfort. Fits wrists from 150mm to 210mm.',
          price: 98.00,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&auto=format&fit=crop&q=80',
          stock: 3, // Only 3 left - matches the UI styling badge
          rating: 4.6,
          reviewsCount: 48,
          specifications: [
            { key: 'Material', value: 'Genuine Leather' },
            { key: 'Band Width', value: '22mm' },
            { key: 'Compatibility', value: 'Fits 42mm / 44mm / 45mm' },
            { key: 'Wrist Size', value: '150mm – 210mm' },
            { key: 'Hardware', value: 'Brushed Stainless Steel' },
            { key: 'Color', value: 'Dark Brown' },
            { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
          ]
        },
        {
          name: 'Braided USB-C Cable',
          description: 'Heavy duty, double-braided nylon charging and data cable. Supports up to 100W Power Delivery and high-speed data sync. Re-engineered reinforced collars prevent fraying, measuring 6ft in length.',
          price: 19.00,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80',
          stock: 25,
          rating: 4.7,
          reviewsCount: 231,
          specifications: [
            { key: 'Length', value: '6 ft (1.8m)' },
            { key: 'Connector', value: 'USB-C to USB-C' },
            { key: 'Power Delivery', value: 'Up to 100W' },
            { key: 'Data Transfer', value: 'USB 3.1 Gen 2 (10 Gbps)' },
            { key: 'Material', value: 'Double-Braided Nylon' },
            { key: 'Compatibility', value: 'USB-C Devices (Laptops, Phones, Tablets)' },
            { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
          ]
        },
        {
          name: 'Laptop Sleeve Case',
          description: 'Premium envelope sleeve with soft microfiber interior lining and magnetic closure. Form-fitting design for 13-inch laptops, providing heavy-duty scratch resistance and light impact protection. Sleek Heather Gray styling.',
          price: 39.00,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
          stock: 12,
          rating: 4.5,
          reviewsCount: 89,
          specifications: [
            { key: 'Compatibility', value: '13-inch Laptops (MacBook / Dell XPS)' },
            { key: 'Material', value: 'Water-Resistant Polyester + MicroFiber' },
            { key: 'Closure', value: 'Magnetic Flap' },
            { key: 'Dimensions', value: '12.5 x 9.2 x 0.8 inches' },
            { key: 'Color', value: 'Heather Gray' },
            { key: 'Protection', value: 'Scratch-Resistant + Light Impact' },
            { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
          ]
        },
        {
          name: 'Wireless Mouse',
          description: 'Ergonomic multi-device wireless mouse. Features high-precision scroll wheel, silent-click buttons, and USB-C rechargeable battery with up to 70 days battery life. Modern matte black look.',
          price: 49.00,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
          stock: 15,
          rating: 4.4,
          reviewsCount: 110,
          specifications: [
            { key: 'Sensor', value: '4000 DPI Optical' },
            { key: 'Connectivity', value: 'Bluetooth 5.0 / 2.4GHz USB Dongle' },
            { key: 'Battery Life', value: '70 Days (Rechargeable USB-C)' },
            { key: 'Buttons', value: '6 (Silent Click)' },
            { key: 'Compatibility', value: 'Windows / macOS / Linux / iPadOS' },
            { key: 'Weight', value: '95g' },
            { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
          ]
        },
        {
          name: 'Portable Power Bank',
          description: 'Compact 10,000mAh external battery charger. Features ultra-slim profiles, dual USB-C Power Delivery ports, and high-speed charging. Can charge your smartphone up to 3 times on a single charge.',
          price: 29.00,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1609592424082-9653842c5f16?w=600&auto=format&fit=crop&q=80',
          stock: 20,
          rating: 4.3,
          reviewsCount: 74,
          specifications: [
            { key: 'Capacity', value: '10,000 mAh' },
            { key: 'Output Ports', value: '2x USB-C (PD), 1x USB-A' },
            { key: 'Max Output', value: '65W Power Delivery' },
            { key: 'Recharge Time', value: '2.5 Hours (USB-C 45W)' },
            { key: 'Dimensions', value: '5.8 x 2.8 x 0.6 inches' },
            { key: 'Weight', value: '210g' },
            { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
          ]
        },
        {
          name: 'Wireless Earbuds',
          description: 'Premium wireless earbuds with charging case. High fidelity sound with immersive bass, crystal clear calls, touch control pads, and IPX7 sweat-resistant protection. Up to 20 hours total battery life.',
          price: 129.00,
          category: 'Earbuds',
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
          stock: 10,
          rating: 4.7,
          reviewsCount: 95,
          specifications: [
            { key: 'Driver', value: '11mm Dynamic' },
            { key: 'Battery Life', value: '8 Hours + 20 Hours (Case)' },
            { key: 'Water Resistance', value: 'IPX7 Sweat & Water Resistant' },
            { key: 'Connectivity', value: 'Bluetooth 5.3' },
            { key: 'Noise Cancelling', value: 'Active Noise Cancelling (ANC)' },
            { key: 'Charging', value: 'USB-C + Wireless Charging Case' },
            { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
          ]
        },
        {
          name: 'Subwoofer Soundbar Speaker',
          description: 'High-end home theater Bluetooth speaker soundbar. Room-filling immersive stereo audio, customized sound stages, deep bass, and optical/HDMI ARC connection ports. Dark sleek aesthetic.',
          price: 349.00,
          category: 'Speakers',
          image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
          stock: 5,
          rating: 4.8,
          reviewsCount: 42,
          specifications: [
            { key: 'Total Power', value: '300W RMS' },
            { key: 'Channels', value: '3.1 Channel (L/R/C + Subwoofer)' },
            { key: 'Subwoofer', value: '6.5-inch Wireless Subwoofer' },
            { key: 'Connectivity', value: 'Bluetooth 5.2 / HDMI ARC / Optical' },
            { key: 'Audio Formats', value: 'Dolby Atmos / DTS:X' },
            { key: 'Dimensions', value: '36 x 4.5 x 3.2 inches' },
            { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
          ]
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
