const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    const uri = 'mongodb+srv://guiferr:Leontino10%2A@maincluster.i5qxhsg.mongodb.net/main_db?retryWrites=true&w=majority';

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      timeoutMS: 5000
    });

    console.log('Conectado ao MongoDB Atlas');
  } catch (err) {
    console.error('Erro ao conectar no MongoDB:', err);
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
}, { collection: 'main_collection' });

const Product = mongoose.model('Product', productSchema);

module.exports = {
  connectMongoDB,
  Product
};