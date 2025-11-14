const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');

const client = new cassandra.Client({
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1',
    keyspace: 'myapp'
});

console.log('ScyllaDB conectado');

function mapRow(row) {
    if (!row) return null;

    return {
        _id: row.id,
        ...JSON.parse(row.data),
        createdAt: row.createdat,
        updatedAt: row.updatedat
    };
}

async function dbInsert(table, doc) {
    const id = uuidv4();
    const createdAt = new Date();

    await client.execute(
        `INSERT INTO ${table} (id, data, createdAt)
     VALUES (?, ?, ?)`,
        [id, JSON.stringify(doc), createdAt],
        { prepare: true }
    );

    return {
        _id: id,
        ...doc,
        createdAt
    };
}

async function dbFindOne(table, query) {
    if (query._id) {
        const result = await client.execute(
            `SELECT * FROM ${table} WHERE id = ?`,
            [query._id],
            { prepare: true }
        );

        return result.rowLength ? mapRow(result.first()) : null;
    }

    const field = Object.keys(query)[0];
    const value = query[field];

    const result = await client.execute(
        `SELECT * FROM ${table} WHERE ${field} = ? LIMIT 1`,
        [value],
        { prepare: true }
    );

    return result.rowLength ? mapRow(result.first()) : null;
}

async function dbFind(table, query = {}) {
    if (Object.keys(query).length === 0) {
        throw new Error("dbFind sem filtros não é permitido em ScyllaDB.");
    }

    const field = Object.keys(query)[0];
    const value = query[field];

    const result = await client.execute(
        `SELECT * FROM ${table} WHERE ${field} = ?`,
        [value],
        { prepare: true }
    );

    return result.rows.map(mapRow);
}

async function dbUpdate(table, query, update) {
    if (!query._id) {
        throw new Error("dbUpdate requer query por _id em ScyllaDB.");
    }

    const updatedAt = new Date();
    const updateData = update.$set || update;

    await client.execute(
        `UPDATE ${table}
     SET data = ?, updatedAt = ?
     WHERE id = ?`,
        [JSON.stringify(updateData), updatedAt, query._id],
        { prepare: true }
    );

    return 1;
}

async function dbRemove(table, query) {
    if (!query._id) {
        throw new Error("dbRemove requer query por _id em ScyllaDB.");
    }

    await client.execute(
        `DELETE FROM ${table} WHERE id = ?`,
        [query._id],
        { prepare: true }
    );

    return 1;
}

module.exports = {
    dbInsert,
    dbFind,
    dbFindOne,
    dbUpdate,
    dbRemove
};
