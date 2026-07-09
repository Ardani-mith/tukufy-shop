import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET all products (with optional filtering by category or search)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error: error.message });
  }
});

// POST create a new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, image, stock, rating, reviewsCount } = req.body;
    
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      category,
      image,
      stock: stock !== undefined ? Number(stock) : 10,
      rating: rating !== undefined ? Number(rating) : 4.5,
      reviewsCount: reviewsCount !== undefined ? Number(reviewsCount) : 12
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

// PUT update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, category, image, stock, rating, reviewsCount } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (image !== undefined) product.image = image;
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);
    if (reviewsCount !== undefined) product.reviewsCount = Number(reviewsCount);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product successfully deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

export default router;
