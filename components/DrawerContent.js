import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, Alert, Image } from 'react-native';
import { Drawer } from 'react-native-paper';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import {openDatabaseAsync ,insertImage } from '../database/db';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system'; // Import FileSystem


export const DrawerContent = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [db, setDb] = useState(null);
  const [location, setLocation] = useState(null);

  // Open the SQLite database
  const openDatabaseAsync = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('imageDB.db'); // Open or create a database
      setDb(database);
      console.log('Database initialized:', database);
    } catch (error) {
      console.log('Error initializing database:', error);
    }
  };

  useEffect(() => {
    openDatabaseAsync(); // Initialize the database when the component mounts
  }, []);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    } else {
      Alert.alert('Location permission required', 'We need access to your location.');
    }
  };

 const selectImage = async () => {
  if (!db) {
    Alert.alert('Error', 'Database not initialized. Please try again.');
    return;
  }

  // Request permission to access the media library
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert('Permission required', 'You need to grant permission to access the gallery');
    return;
  }

  // Launch the image picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaType: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    allowsEditing: false,
    selectionLimit: 1,
  });

  // If the user picked an image, continue processing
  if (!result.canceled) {
    const selectedUri = result.assets[0].uri;
    setImageUri(selectedUri);

    try {
      // Convert the selected image URI to base64
      const base64Image = await FileSystem.readAsStringAsync(selectedUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Get current location
      await getLocation(); // Ensure that location is fetched

      // Prepare image data with additional metadata
      const image = {
        base64: base64Image,  // Store the base64 string here
        timestamp: new Date().toISOString(),
        latitude: location?.latitude || 0,  // Default to 0 if location is unavailable
        longitude: location?.longitude || 0, // Default to 0 if location is unavailable
      };

      // Insert the image and metadata into the database
      await insertImage(db, image);  // Ensure this function is correctly implemented

      // Success feedback
      Alert.alert('Success', 'Image URI uploaded successfully!');
    } catch (error) {
      console.log('Error during image processing or database insertion:', error);
      Alert.alert('Error', 'Failed to upload image URI.');
    }
  } else {
    console.log('Image selection was canceled');
  }
};

  return (
    <View style={styles.container}>
      <Drawer.Section title="">
        <Drawer.Item label="Camera" onPress={() => navigation.navigate('Camera')} />
        <Drawer.Item label="Gallery" onPress={() => navigation.navigate('Gallery')} />
        <Drawer.Item
          label="Upload Image"
          icon={() => <MaterialCommunityIcons name="plus-circle" size={24} color="#000" />}
          onPress={selectImage}
        />
      </Drawer.Section>

      {imageUri && (
        <View style={styles.imageContainer}>
          {/* <Text style={styles.imageText}>Selected Image:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} /> */}
        </View>
      )}

      <Drawer.Section title="" style={styles.followUsSection}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="github"
            size={30}
            onPress={() => Linking.openURL('https://github.com/your-profile')}
            style={styles.icon}
          />
          <MaterialCommunityIcons
            name="facebook"
            size={30}
            onPress={() => Linking.openURL('https://www.facebook.com/in/your-profile')}
            style={styles.icon}
          />
          <MaterialCommunityIcons
            name="twitter"
            size={30}
            onPress={() => Linking.openURL('https://www.twitter.com/in/your-profile')}
            style={styles.icon}
          />
          <MaterialCommunityIcons
            name="whatsapp"
            size={30}
            onPress={() => Linking.openURL('https://www.whatsapp.com/in/your-profile')}
            style={styles.icon}
          />
        </View>
        <Text style={styles.versionText}>Version 1.2.4.0</Text>
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  followUsSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  icon: {
    marginHorizontal: 15,
    color: '#000',
  },
  versionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  imageText: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});
