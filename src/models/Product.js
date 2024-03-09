const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    category: {type: String, enum:['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios']},
    size: {type: String, enum:['XS', 'S', 'M', 'L', 'XL']},
    price: {type: Number, required: true} 
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;