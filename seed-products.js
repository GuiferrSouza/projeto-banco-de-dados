require('dotenv').config();
const { connectMongoDB, Product } = require('./src/config/mongodb');

const sampleProducts = [
  {
    name: 'Camiseta Básica Premium',
    description: 'Camiseta de algodão egípcio com corte moderno e caimento perfeito',
    category: 'Camisetas',
    price: 89.90,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Branco', 'Azul Marinho'],
    brand: 'Fashion Co',
    material: 'Algodão Egípcio',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
  },
  {
    name: 'Calça Jeans Slim',
    description: 'Calça jeans com elastano para maior conforto e modelagem slim fit',
    category: 'Calças',
    price: 199.90,
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['Azul Escuro', 'Azul Claro', 'Preto'],
    brand: 'Denim Style',
    material: 'Jeans com Elastano',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
  },
  {
    name: 'Vestido Floral Longo',
    description: 'Vestido longo com estampa floral delicada e tecido leve',
    category: 'Vestidos',
    price: 249.90,
    sizes: ['P', 'M', 'G'],
    colors: ['Floral Rosa', 'Floral Azul', 'Floral Verde'],
    brand: 'Bella Moda',
    material: 'Viscose',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'
  },
  {
    name: 'Blazer Alfaiataria',
    description: 'Blazer de alfaiataria com corte estruturado e acabamento premium',
    category: 'Blazers',
    price: 399.90,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Marinho', 'Bege'],
    brand: 'Executive',
    material: 'Lã e Poliéster',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400'
  },
  {
    name: 'Tênis Casual Branco',
    description: 'Tênis casual versátil com design minimalista',
    category: 'Calçados',
    price: 299.90,
    sizes: ['37', '38', '39', '40', '41', '42'],
    colors: ['Branco', 'Off White'],
    brand: 'UrbanFeet',
    material: 'Couro Sintético',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
  },
  {
    name: 'Moletom Oversized',
    description: 'Moletom com modelagem oversized e acabamento macio',
    category: 'Moletons',
    price: 179.90,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Cinza Mescla', 'Preto', 'Verde Militar'],
    brand: 'Street Wear',
    material: 'Moletom Flanelado',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
  },
  {
    name: 'Camisa Social Slim',
    description: 'Camisa social de corte slim com tecido antirrugas',
    category: 'Camisas',
    price: 149.90,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Branco', 'Azul Claro', 'Rosa'],
    brand: 'Formal Chic',
    material: 'Algodão Premium',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'
  },
  {
    name: 'Saia Midi Plissada',
    description: 'Saia midi com pregas delicadas e cintura alta',
    category: 'Saias',
    price: 169.90,
    sizes: ['P', 'M', 'G'],
    colors: ['Preto', 'Nude', 'Vinho'],
    brand: 'Elegance',
    material: 'Poliéster',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400'
  }
];

async function seedProducts() {
  try {
    await connectMongoDB();
    console.log('Conectado ao MongoDB');

    await Product.deleteMany({});
    console.log('Produtos antigos removidos');

    const result = await Product.insertMany(sampleProducts);
    console.log(`${result.length} produtos inseridos com sucesso!`);

    process.exit(0);
  } catch (err) {
    console.error('Erro ao popular produtos:', err);
    process.exit(1);
  }
}

seedProducts();