import * as SQLite from 'expo-sqlite';



  // Open the SQLite database
  export const openDatabaseAsync = () => {
    const db = SQLite.openDatabaseAsync('imageDB.db'); // Open or create a database
    return db;
  };

    // const openDatabaseAsyncAsync = async () => {
    //   try {
    //     const database = await SQLite.openDatabaseAsync('imageDB.db'); // Open or create a database
    //     setDb(database);
    //     console.log('Database initialized:', database);
    //   } catch (error) {
    //     console.log('Error initializing database:', error);
    //   }
    // };
  
  const initializeDatabase = () => {
    const db = openDatabaseAsync();
    console.log('Database initialized:', db); // Check if the database object is printed correctly
  };
  
  initializeDatabase();
  
  export const createTableAndInsertData = (db) => {
    db.runAsync(tx => {
      // Create images table if not exists, now with base64 column
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS images (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          base64 TEXT,  // Change from path to base64
          timestamp TEXT, 
          latitude REAL, 
          longitude REAL
        );
      `, [], 
      () => console.log('Table created or already exists'),
      (_, error) => {
        console.log('Error creating table', error);
      });
    });
  };



// Insert an image record into the database
export const insertImage = (db, image) => {
  if (!db) {
    console.error('Database is not initialized');
    return; // Exit the function early if db is null
  }

  const { base64, timestamp, latitude, longitude } = image; // Use base64
  console.log('Inserting image with data:', image); // Log image data for verification

  db.runAsync(tx => {
    tx.executeSql(
      'INSERT INTO images (base64, timestamp, latitude, longitude) VALUES (?, ?, ?, ?)', 
      [base64, timestamp, latitude, longitude], // Use base64 instead of path
      (_, result) => {
        console.log('Image inserted with base64', result.insertId);
      },
      (_, error) => {
        console.log('Error inserting image', error);
      }
    );
  });
};


// Fetch all images from the database
export const getAllImages = (db) => {
  return new Promise((resolve, reject) => {
    db.runAsync(tx => {
      tx.executeSql(
        'SELECT * FROM images', 
        [], 
        (_, { rows }) => {
          console.log('Fetched images:', rows._array);
          resolve(rows._array); // resolve with array of images
        },
        (_, error) => {
          console.log('Error fetching images:', error);
          reject(error);
        }
      );
    });
  });
};

// Fetch the first image from the database
export const getFirstImage = (db) => {
  return new Promise((resolve, reject) => {
    db.runAsync(tx => {
      tx.executeSql(
        'SELECT * FROM images LIMIT 1', 
        [], 
        (_, { rows }) => {
          if (rows.length > 0) {
            console.log('First image:', rows.item(0));
            resolve(rows.item(0));
          } else {
            resolve(null); // No images in DB
          }
        },
        (_, error) => {
          console.log('Error fetching first image:', error);
          reject(error);
        }
      );
    });
  });
};

// Update an image record by ID
export const updateImage = (db, id, newPath) => {
  db.runAsync(tx => {
    tx.executeSql(
      'UPDATE images SET path = ? WHERE id = ?', 
      [newPath, id], 
      (_, result) => {
        console.log('Image updated', result.rowsAffected);
      },
      (_, error) => {
        console.log('Error updating image', error);
      }
    );
  });
};

// Delete an image record by ID
export const deleteImage = (db, id) => {
  db.runAsync(tx => {
    tx.executeSql(
      'DELETE FROM images WHERE id = ?', 
      [id], 
      (_, result) => {
        console.log('Image deleted', result.rowsAffected);
      },
      (_, error) => {
        console.log('Error deleting image', error);
      }
    );
  });
};

// Fetch images with cursor-based operations
export const getImagesWithCursor = (db) => {
  db.runAsync(tx => {
    tx.executeSql(
      'SELECT * FROM images', 
      [], 
      (_, { rows }) => {
        rows._array.forEach((row) => {
          console.log('Cursor result:', row);
        });
      },
      (_, error) => {
        console.log('Error fetching images with cursor:', error);
      }
    );
  });
};
