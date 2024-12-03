import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons'; // For the camera icon


const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions(); // Use hook to get and request camera permissions

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission(); // Request permission on initial load if not granted
    }
  }, [permission]);

  if (!permission) {
    return <Text>Requesting permission...</Text>; // Show loading message while permission is being checked
  }

  if (!permission.granted) {
    // If permission is not granted, show a message with buttons to request permission
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => alert("You can select 'Allow only this time' in the settings.")}>
          <Text style={styles.buttonText}>Allow only this time</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.denyButton} onPress={() => alert("Camera access denied.")}>
          <Text style={styles.buttonText}>Deny Access</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const handleCapture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri); // Store the captured photo URI in the state
    }
  };
  // Once permission is granted, show the camera
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera}>
        {/* Camera content goes here */}
        <View style={styles.captureButtonContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
            >
              <Ionicons name="camera" size={30} color="white" />
            </TouchableOpacity>
          </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  camera: {
    flex: 1,
    width: '100%',

  },
  message: {
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  denyButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  capturedImage: {
    flex:1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  captureButton: {
    backgroundColor: 'red',
    borderRadius: 50, // Circular button
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 40, // Position the button at the bottom of the camera
    left: '50%',
    marginLeft: -35, // To center it
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraScreen;
