const { MongoClient } = require('mongodb');
const { DB_USER, DB_PASS } = require('./config');

let database;

const mongoConnect = (callback) => {
  const url = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.9gzwygz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

  MongoClient.connect(url)
    .then(client => {
      console.log('Database connected.');
      database = client.db('shop');
      callback();
    })
    .catch(err => {
      console.error('Failed to connect:', err);
      throw err;
    });
};

const getDatabase = () => {
  if (!database) {
    throw new Error('No database found.');
  }
  return database;
};

module.exports = {
  mongoConnect,
  getDatabase
};