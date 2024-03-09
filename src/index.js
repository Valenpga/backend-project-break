const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');//modulo de dependencia 0 para cargar variables de entorno
const mongoose = require('mongoose');
const path = require('path');//path es para poder trabajar con carpetas y ficheros
const Product = require('./models/Product');
const ejs = require('ejs');

dotenv.config();

app.set('view engine', 'ejs')

const MONGO_URI = process.env.MONGO_URI = `mongodb+srv://Nuria:LOPQG1SHXsULqXWF@cluster0.5oledkd.mongodb.net/TIENDA DE ROPA`;

//conecto la base de datos al servidor, para que se puedan guardar datos.
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(() => console.log('connected to the database Mongodb'));


app.use(express.urlencoded ({ extended: true}));
//configurar el middleware para analizar el cuerpo de las solicitudes post.
app.use(express.static(path.join(__dirname,'public','index.html')));
//configurar middleware para servir archivos estaticos desde la carpeta public


//ruta principal para mostrar la pagina de inicio
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
});

//ruta para prcesar el formulario de creacion de producto (post request)
app.post('/create-product', async (req,res) =>{
    try{
        const{ name, description, image, category, size, price} = req.body;
        //crear nuevo producto en la base de datos
        const newProduct = new Product({ name, description, image, category, size, price});
        await newProduct.save();
        res.status(201).send('Successfully created product');

    }catch(error) {
        console.error('Error creating product:', error);
        res.status(500).send('Internal Server Error.');
    }
});

// Ruta para obtener la información de un producto individual
app.get('/productos/:productId', async (req, res) => {
  const { productId } = req.params;
  const producto = await obtenerProductoPorId(productId);

  if (!producto) {
    return res.status(404).send('Producto no encontrado');
  }

  res.render('producto', { producto });
});

async function obtenerProductoPorId(productId) {
  try {
    // Implementar la lógica de búsqueda del producto por ID
    // ... (por ejemplo, utilizando Mongoose)
    const producto = await Product.findById(productId)
      .populate('categoria') // Opcional: poblar la referencia a la categoría
      .lean(); // Convertir el documento a un objeto simple
    return producto;
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    throw error; // Se puede manejar el error de forma personalizada en la ruta
  }
}

//Error 404 para rutas no encontradas
app.use((req, res, next) => {
    res.status(404).send('Page not found.')
});

//middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error.');
});

app.listen(PORT,() =>{
    console.log(`Server is running in server ${PORT}`)
});

