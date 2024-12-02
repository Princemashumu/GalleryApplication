// screens/CameraScreen.js

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { RNCamera } from 'react-native-camera'; // Make sure RNCamera is correctly imported

const CameraScreen = () => {
  const [photo, setPhoto] = useState(null); // To store the photo

  let camera; // Define camera reference

  // Function to take a photo
  const takePhoto = async () => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      setPhoto(data.uri); // Store the photo URI
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back} // Access the camera type here
        ref={(ref) => { camera = ref }}  // Assign camera reference
        captureAudio={false}  // We don't need audio for photos
      >
        <View style={styles.buttonContainer}>
          <Button title="Take Photo" onPress={takePhoto} />
        </View>
      </RNCamera>
      {photo && (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.photo} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  photoContainer: {
    marginTop: 20,
  },
  photo: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});

export default CameraScreen;
