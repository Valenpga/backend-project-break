const Product = require('../models/Product');

const showProducts = async (req, res) => {
  const products = await Product.find();
  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Productos</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    ... (encabezado y otras secciones) ...
    <main>
      <section class="productos">
        <h2>Productos destacados</h2>
        <ul>
          ${products.map(renderProductCard).join('\n')}
        </ul>
      </section>
    </main>
    ... (pie de página y otras secciones) ...
  </body>
  </html>
  `;
  function renderProductCard (product) {
    return `
    <li class="producto">
        <a href="#">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <span class="precio">€${product.price}</span>
        </a>
      </li>
    `;
  }

  res.send(html);
};

const showProductById = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  const html = `
  <main>
    <section class="producto-detalle">
      <h1>Producto</h1>
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <span class="precio">€${product.price}</span>
    </section>
  </main>
  `;
  res.send(html);
};

const showNewProduct = async (req, res) => {
  const html = `
  <main>
    <section class="producto-nuevo">
      <h2>Crear un nuevo producto</h2>
      <form action="/products" method="POST">
        <input type="text" name="name" placeholder="Nombre del producto">
        <input type="text" name="description" placeholder="Descripción del producto">
        <input type="text" name="image" placeholder="URL de la imagen">
        <input type="number" name="price" placeholder="Precio del producto">
        <button type="submit">Crear producto</button>
      </form>
    </section>
  </main>
  `;
  res.send(html);
};

const createProduct = async (req, res) => {
  try {
    const { name, description, image, category, size, price } = req.body;

    const product = new Product({
      name,
      description,
      image,
      category,
      size,
      price,
    });

    await product.save();

    res.status(201).json({menssage:'Successfully created product',product});
  }catch(error) {
    console.error(error);//registrar el error
    res.status(500).json({menssage:'Error creating product.'});//enviar mensaje de error
  }
};

const showEditProduct = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  const html = `
  <main>
    <section class="producto-editar">
      <h2>Editar producto</h2>
      <form action="/products/[productId]" method="PUT">
        <input type="text" name="name" value="${product.name}">
        <input type="text" name="description" value="${product.description}">
        <input type="text" name="image" value="${product.image}">
        <input type="number" name="price" value="${product.price}">
        <button type="submit">Guardar cambios</button>
      </form>
      </section>
  </main>
  `;
  res.send(html);
};

const updateProduct = async (req, res) => {
  const { name, description, image, category, size, price } = req.body;

  const product = await Product.findByIdAndUpdate(req.params.productId, {
    name,
    description,
    image,
    category,
    size,
    price,
  });

  // Redirigir a la vista de detalle o al dashboard
  if (req.session.user) {
    res.redirect(`/dashboard/products/${product._id}`);
  } else {
    res.redirect(`/products/${product._id}`);
  }
};

const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.productId);

  res.redirect('/dashboard/products');
};

module.exports = {
  showProducts,
  showProductById,
  showNewProduct,
  createProduct,
  showEditProduct,
  updateProduct,
  deleteProduct,
};