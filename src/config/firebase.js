var admin = require('firebase-admin');
var serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projeto-db-bef03-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
const ordersCollection = db.collection('Orders');
const requestLogsCollection = db.collection('Request_logs');

console.log('Firebase Firestore carregado');

const dbInsert = async (collection, doc) => {
  try {
    const docRef = await collection.add({
      ...doc,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const newDoc = await docRef.get();
    return {
      _id: docRef.id,
      ...newDoc.data()
    };
  } catch (error) {
    throw error;
  }
};

const dbFind = async (collection, query = {}) => {
  try {
    let ref = collection;
    
    Object.keys(query).forEach(key => {
      ref = ref.where(key, '==', query[key]);
    });
    
    const snapshot = await ref.get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

const dbFindOne = async (collection, query) => {
  try {
    if (query._id) {
      const docRef = collection.doc(query._id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      return {
        _id: doc.id,
        ...doc.data()
      };
    }
    
    let ref = collection;
    Object.keys(query).forEach(key => {
      ref = ref.where(key, '==', query[key]);
    });
    
    const snapshot = await ref.limit(1).get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      _id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    throw error;
  }
};

const dbUpdate = async (collection, query, update, options = {}) => {
  try {
    if (query._id) {
      const docRef = collection.doc(query._id);
      const updateData = update.$set || update;
      
      await docRef.update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return 1;
    }
    
    const docs = await dbFind(collection, query);
    
    if (docs.length === 0) {
      return 0;
    }
    
    const batch = db.batch();
    const updateData = update.$set || update;
    
    docs.forEach(doc => {
      const docRef = collection.doc(doc._id);
      batch.update(docRef, {
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    return docs.length;
  } catch (error) {
    throw error;
  }
};

const dbRemove = async (collection, query, options = {}) => {
  try {
    if (query._id) {
      const docRef = collection.doc(query._id);
      await docRef.delete();
      return 1;
    }
    
    const docs = await dbFind(collection, query);
    
    if (docs.length === 0) {
      return 0;
    }
    
    const batch = db.batch();
    
    docs.forEach(doc => {
      const docRef = collection.doc(doc._id);
      batch.delete(docRef);
    });
    
    await batch.commit();
    return docs.length;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  ordersDB: ordersCollection,
  requestLogsDB: requestLogsCollection,
  dbInsert,
  dbFind,
  dbFindOne,
  dbUpdate,
  dbRemove
};