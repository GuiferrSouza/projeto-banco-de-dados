CREATE KEYSPACE IF NOT EXISTS myapp
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE myapp;

CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY,
    data text,
    createdAt timestamp,
    updatedAt timestamp,
    status text
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

CREATE TABLE IF NOT EXISTS request_logs (
    id uuid PRIMARY KEY,
    data text,
    createdAt timestamp,
    updatedAt timestamp,
    type text
);

CREATE INDEX IF NOT EXISTS idx_requestlogs_type ON request_logs (type);