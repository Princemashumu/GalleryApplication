import * as SQLite from 'expo-sqlite';

// Open the SQLite database
export const openDatabaseAsync = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('imageDB.db');
    
    // Create table when database is opened
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        base64 TEXT, 
        timestamp TEXT, 
        latitude REAL, 
        longitude REAL
      );
    `);

    // Optional: Insert a sample image if no images exist
    const existingImages = await getAllImages(db);
    if (existingImages.length === 0) {
      await insertImage(db, {
        base64: 'YOUR_SAMPLE_BASE64_STRING_HERE', // Replace with an actual base64 image
        timestamp: new Date().toISOString(),
        latitude: 37.7749,
        longitude: -122.4194
      });
    }

    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Fetch all images from the database
export const getAllImages = async (db) => {
  try {
    const images = await db.getAllAsync(
      `SELECT * FROM images;`  // Query to get all images
    );
    // console.log('Retrieved images:', images); // Debug log
    return images;
  } catch (error) {
    console.error('Error retrieving images:', error);
    return [];
  }
};

// Insert an image record into the database
export const insertImage = async (db, image) => {
  if (!db) {
    console.error('Database is not initialized');
    return; // Exit the function early if db is null
  }

  const { base64, timestamp, latitude, longitude } = image;
  console.log('Inserting image with data:', image);

  try {
    const result = await db.runAsync(
      'INSERT INTO images (base64, timestamp, latitude, longitude) VALUES (?, ?, ?, ?)', 
      [base64, timestamp, latitude, longitude]
    );
    console.log('Image inserted with ID', result.lastInsertRowId);
    return result;
  } catch (error) {
    console.error('Error inserting image', error);
  }
};

// Fetch the first image from the database
export const getFirstImage = async (db) => {
  try {
    const images = await db.getAllAsync('SELECT * FROM images LIMIT 1');
    return images.length > 0 ? images[0] : null;
  } catch (error) {
    console.error('Error fetching first image:', error);
    return null;
  }
};

// Update an image record by ID
export const updateImage = async (db, id, updatedData) => {
  try {
    const result = await db.runAsync(
      'UPDATE images SET base64 = ?, timestamp = ?, latitude = ?, longitude = ? WHERE id = ?', 
      [updatedData.base64, updatedData.timestamp, updatedData.latitude, updatedData.longitude, id]
    );
    console.log('Image updated', result.rowsAffected);
    return result;
  } catch (error) {
    console.error('Error updating image', error);
  }
};

// Delete an image record by ID
export const deleteImage = async (db, id) => {
  try {
    const result = await db.runAsync(
      'DELETE FROM images WHERE id = ?', 
      [id]
    );
    console.log('Image deleted', result.rowsAffected);
    return result;
  } catch (error) {
    console.error('Error deleting image', error);
  }
};