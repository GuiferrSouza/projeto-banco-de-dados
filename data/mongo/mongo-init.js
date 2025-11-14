db = db.getSiblingDB('myapp');

db.createCollection('products');
db.createCollection('request_logs');

db.products.createIndex({ customer_id: 1 });
db.request_logs.createIndex({ request_id: 1 });

print("MongoDB initialized.");