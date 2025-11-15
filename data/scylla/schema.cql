CREATE KEYSPACE IF NOT EXISTS myapp
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 1
};

USE myapp;

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY,
  customer_id int,
  customer_name text,
  items text,
  total_amount double,
  status text,
  created_at timestamp,
  updated_at timestamp
);

CREATE TABLE IF NOT EXISTS request_logs (
  id uuid PRIMARY KEY,
  timestamp timestamp,
  method text,
  path text,
  body text,
  query text
);

CREATE TABLE IF NOT EXISTS orders_by_customer (
  customer_id int,
  id uuid,
  customer_name text,
  items text,
  total_amount double,
  status text,
  created_at timestamp,
  updated_at timestamp,
  PRIMARY KEY (customer_id, id)
);