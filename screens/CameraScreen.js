import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons'; // For icons
import * as FileSystem from 'expo-file-system'; // For reading the image file as base64
import { openDatabaseAsync, insertImage } from '../database/db'; // Import your database functions

const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [cameraType, setCameraType] = useState('back'); // Default to back camera
  const cameraRef = useRef(null);
  const [db, setDb] = useState(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await openDatabaseAsync(); // Initialize the database
      setDb(database);
    };
    initializeDatabase();
  }, []);

  
  if (!permission) {
    return <Text>Requesting Camera Permissions...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri);
    }
  };

  const toggleCameraType = () => {
    setCameraType((current) =>
      current === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
    );
  };

  const handleClosePhoto = () => setPhoto(null);

  // Function to upload the image to the SQLite database
  const uploadImage = async (uri) => {
    if (!db) {
      console.error('Database not initialized');
      return;
    }

    try {
      // Convert the image to base64
      const base64Image = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Prepare the image data to insert into the database
      const imageData = {
        base64: base64Image,
        timestamp: new Date().toISOString(),
        latitude: 0, // Add actual latitude here (use geolocation)
        longitude: 0, // Add actual longitude here (use geolocation)
      };

      // Insert the image data into the database
      insertImage(db, imageData);
      console.log('Image uploaded to database successfully!');
      
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleUpload = () => {
    if (photo) {
      uploadImage(photo);
      setPhoto(null); // Optionally clear the photo after upload
    }
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.photo} />
          <TouchableOpacity style={styles.closeButton} onPress={handleClosePhoto}>
            <Ionicons name="close" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
            <Ionicons name="cloud-upload-outline" size={40} color="white" />
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView style={styles.camera} cameraType={cameraType} type={cameraType} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleCameraType}>
              {/* Icon for switching camera */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
              <Ionicons name="camera" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 40,
    width: '100%',
  },
  iconButton: {
    padding: 20,
    borderRadius: 50,
  },
  captureButton: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 50,
  },
  photoContainer: {
    flex: 1,
  },
  photo: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 50,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: 'white',
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CameraScreen;
