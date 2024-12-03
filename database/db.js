import * as SQLite from 'expo-sqlite';

// Open a database (create it if it doesn't exist)
export const openDatabase = () => {
  const db = SQLite.openDatabase('myDatabase.db'); // 'myDatabase.db' is the database name
  return db;
};

// Function to create a table if it doesn't exist
export const createTable = (db) => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT, timestamp TEXT, latitude REAL, longitude REAL);`
    );
  });
};

// Function to insert an image record into the table
export const insertImage = (db, image) => {
  const { path, timestamp, latitude, longitude } = image;
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO images (path, timestamp, latitude, longitude) VALUES (?, ?, ?, ?)`,
      [path, timestamp, latitude, longitude],
      (_, result) => {
        console.log("Image inserted", result);
      },
      (_, error) => {
        console.error("Error inserting image", error);
        return false;
      }
    );
  });
};

// Function to fetch all images from the database
export const getAllImages = (db, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM images`,
      [],
      (_, result) => {
        callback(result.rows._array);
      },
      (_, error) => {
        console.error("Error fetching images", error);
        return false;
      }
    );
  });
};
