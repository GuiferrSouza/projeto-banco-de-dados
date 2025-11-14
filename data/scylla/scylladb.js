const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');

const client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'myapp'
});

console.log('ScyllaDB conectado');

const ordersTable = "orders";
const logsTable = "request_logs";
const ordersByCustomerTable = "orders_by_customer";

async function dbInsert(table, doc) {
  const id = doc.id || uuidv4();

  const normalizedDoc = {};

  for (const key of Object.keys(doc)) {
    if (key === "id") continue;

    const value = doc[key];

    if (value === null || value === undefined) continue;

    if (value instanceof Date) {
      normalizedDoc[key] = value;
      continue;
    }

    if (Array.isArray(value) || typeof value === "object") {
      normalizedDoc[key] = JSON.stringify(value);
      continue;
    }

    normalizedDoc[key] = value;
  }

  const columns = ["id", ...Object.keys(normalizedDoc)];
  const placeholders = columns.map(() => "?");
  const values = [id, ...Object.values(normalizedDoc)];

  const query = `
    INSERT INTO ${table} (${columns.join(", ")})
    VALUES (${placeholders.join(", ")})
  `;

  await client.execute(query, values, { prepare: true });

  return { id, ...normalizedDoc };
}

async function dbFindOne(table, query) {
  if (!query.id) throw new Error("dbFindOne exige { id }");

  const result = await client.execute(
    `SELECT * FROM ${table} WHERE id = ?`,
    [query.id],
    { prepare: true }
  );

  return result.rowLength ? result.first() : null;
}

async function dbFind(table, query = null) {
  if (!query) throw new Error("Scylla exige WHERE");

  const [field, value] = Object.entries(query)[0];

  const result = await client.execute(
    `SELECT * FROM ${table} WHERE ${field} = ?`,
    [value],
    { prepare: true }
  );

  return result.rows.map(row => ({
    ...row,
    id: row.id ? row.id.toString() : null,
    created_at: row.created_at ? row.created_at.toISOString() : null,
    updated_at: row.updated_at ? row.updated_at.toISOString() : null
  }));
}

async function dbUpdate(table, query, update) {
  if (!query.id) throw new Error("dbUpdate exige { id }");

  const updateFields = [];
  const values = [];

  for (const key of Object.keys(update)) {
    updateFields.push(`${key} = ?`);
    values.push(update[key]);
  }

  values.push(query.id);

  const cql = `
    UPDATE ${table}
    SET ${updateFields.join(", ")}
    WHERE id = ?
  `;

  await client.execute(cql, values, { prepare: true });

  return 1;
}

async function dbUpdateByCustomer(table, customer_id, id, update) {
  const updateFields = [];
  const values = [];

  for (const key of Object.keys(update)) {
    updateFields.push(`${key} = ?`);
    values.push(update[key]);
  }

  values.push(customer_id, id);

  const cql = `
    UPDATE ${table}
    SET ${updateFields.join(", ")}
    WHERE customer_id = ? AND id = ?
  `;

  await client.execute(cql, values, { prepare: true });

  return 1;
}

async function dbRemove(table, query) {
  if (!query.id) throw new Error("dbRemove exige { id }");

  await client.execute(
    `DELETE FROM ${table} WHERE id = ?`,
    [query.id],
    { prepare: true }
  );

  return 1;
}

module.exports = {
  client,
  ordersTable,
  logsTable,
  ordersByCustomerTable,
  dbInsert,
  dbFind,
  dbFindOne,
  dbUpdate,
  dbUpdateByCustomer,
  dbRemove
};