import SQLite from 'react-native-sqlite-storage';

// Enable promise support
SQLite.enablePromise(true);

// Open a database
export const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabase({ name: 'images.db', location: 'default' });
    return db;
  } catch (error) {
    console.error('Failed to open database:', error);
  }
};

// Create table for storing images
export const createTable = async (db) => {
  try {
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT,
        timestamp TEXT,
        latitude REAL,
        longitude REAL
      );`
    );
    console.log('Table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

// Insert an image record
export const insertImage = async (db, image) => {
  try {
    await db.executeSql(
      `INSERT INTO images (path, timestamp, latitude, longitude) VALUES (?, ?, ?, ?)`,
      [image.path, image.timestamp, image.latitude, image.longitude]
    );
    console.log('Image inserted successfully');
  } catch (error) {
    console.error('Error inserting image:', error);
  }
};

// Fetch all images
export const fetchImages = async (db) => {
  try {
    const results = await db.executeSql('SELECT * FROM images');
    return results[0].rows.raw();
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

// Update an image record
export const updateImage = async (db, id, newPath) => {
  try {
    await db.executeSql(
      `UPDATE images SET path = ? WHERE id = ?`,
      [newPath, id]
    );
    console.log('Image updated successfully');
  } catch (error) {
    console.error('Error updating image:', error);
  }
};

// Delete an image by ID
export const deleteImage = async (db, id) => {
  try {
    await db.executeSql(
      `DELETE FROM images WHERE id = ?`,
      [id]
    );
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};
