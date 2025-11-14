CREATE KEYSPACE IF NOT EXISTS myapp
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 1
};

USE myapp;

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS request_logs;
DROP TABLE IF EXISTS orders_by_customer;

CREATE TABLE orders (
  id uuid PRIMARY KEY,
  customer_id int,
  customer_name text,
  items text,
  total_amount double,
  status text,
  created_at timestamp,
  updated_at timestamp
);

CREATE TABLE request_logs (
  id uuid PRIMARY KEY,
  timestamp timestamp,
  method text,
  path text,
  body text,
  query text
);

CREATE TABLE orders_by_customer (
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