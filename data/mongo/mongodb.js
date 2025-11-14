const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    const uri = "mongodb://localhost:27017/myapp";
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    });

    console.log(`Conectado ao MongoDB (${uri})`);
  } catch (err) {
    console.error('Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  }
};

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  brand: { type: String, required: true },
  material: String,
  stock: { type: Number, default: 0 },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

module.exports = {
  connectMongoDB,
  Product
};