const { getDatabase } = require('../database');
const Product = require('./Product');

const COLLECTION_NAME = 'carts';

class Cart {
  constructor() {}

  static async add(productName) {
    const db = getDatabase();
    const product = await Product.findByName(productName);

    if (!product) {
      throw new Error(`Product '${productName}' not found.`);
    }

    // Check if cart exists with items
    const cart = await db.collection(COLLECTION_NAME).findOne({ items: { $exists: true } });

    if (!cart) {
      // If no cart exists, create a new one with the product
      return db.collection(COLLECTION_NAME).insertOne({
        items: [{ product, quantity: 1 }]
      });
    }

    // Check if product already exists in cart
    const existingProductIndex = cart.items.findIndex(
      item => item.product.name === productName
    );

    if (existingProductIndex !== -1) {
      // If product exists, update its quantity
      cart.items[existingProductIndex].quantity += 1;
    } else {
      // If product doesn't exist in cart, add it
      cart.items.push({ product, quantity: 1 });
    }

    // Update the cart in the database
    return db.collection(COLLECTION_NAME).updateOne(
      { _id: cart._id },
      { $set: { items: cart.items } }
    );
  }

  static async getItems() {
    const db = getDatabase();
    const cart = await db.collection(COLLECTION_NAME).findOne({ items: { $exists: true } });
    return cart ? cart.items : [];
  }

  static async getProductsQuantity() {
    const db = getDatabase();
    const cart = await db.collection(COLLECTION_NAME).findOne({ items: { $exists: true } });
    
    if (!cart || !cart.items.length) {
      return 0;
    }

    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  static async getTotalPrice() {
    const db = getDatabase();
    const cart = await db.collection(COLLECTION_NAME).findOne({ items: { $exists: true } });
    
    if (!cart || !cart.items.length) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  static clearCart() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).deleteMany({});
  }
}

module.exports = Cart;