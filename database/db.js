// db.js
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const openDatabase = async () => {
  const db = await SQLite.openDatabase({ name: 'images.db', location: 'default' });
  return db;
};

export const createTable = async (db) => {
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT,
      timestamp TEXT,
      latitude REAL,
      longitude REAL
    );`
  );
};

export const insertImage = async (db, image) => {
  await db.executeSql(
    `INSERT INTO images (path, timestamp, latitude, longitude) VALUES (?, ?, ?, ?)`,
    [image.path, image.timestamp, image.latitude, image.longitude]
  );
};

export const fetchImages = async (db) => {
  const results = await db.executeSql('SELECT * FROM images');
  return results[0].rows.raw();
};
