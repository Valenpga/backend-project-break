const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {check,validationResult } = require('express-validator');

mongoose.connect('mongodb+srv://Nuria:LOPQG1SHXsULqXWF@cluster0.5oledkd.mongodb.net/TIENDA DE ROPA',{useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conecting Mongodb'))
    .catch(error => console.error('Error connecting Mongodb:',error));
//Para que express pueda interpretar los cuerpos de las peticiones como json
app.use(bodyParser.json());

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
});

const Product = mongoose.model('Product', ProductSchema);


//Get/products, devuelve todos los productos
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products)
});

app.get('/products/:productId', async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
});
  
app.get('/dashboard/new', (req, res) => {
    res.render('new_product'); // Reemplazar con la vista que renderiza el formulario
});
  
app.post('/products', [
    check('name').not().isEmpty().trim(),
    check('description').not().isEmpty().trim(),
    check('price').isNumeric(),
  ], async (req, res) => {
    const { name, description, price } = req.body;
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const newProduct = new Product({ name, description, price });
    await newProduct.save();
    res.json(newProduct);
});
  
app.get('/dashboard/:productId', async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.render('product_dashboard', { product }); // Reemplaza a la vista que renderiza el detalle del producto en el dashboard
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
});
  
app.get('/dashboard/:productId/edit', async (req, res) =>{
    const { productId } = req.params;
  
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.render('edit_product', { product }); // Reemplaza la vista con la que se renderiza el formulario
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
});
  
app.put('/products/:productId', async (req, res) => {
    const { productId } = req.params;
    const { name, description, price } = req.body;
  
    try {
      const product = await Product.findByIdAndUpdate(productId, {
        name,
        description,
        price,
      });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
});
  
app.delete('/products/:productId', async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findByIdAndDelete(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
});