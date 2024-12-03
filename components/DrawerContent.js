import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, Alert, Image } from 'react-native';
import { Drawer } from 'react-native-paper';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'; // Importing location for image metadata
import { openDatabase, insertImage } from '../database/db';

export const DrawerContent = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [db, setDb] = useState(null);
  const [location, setLocation] = useState(null); // State to store location data

  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await openDatabase();
      setDb(database);
    };
    initializeDatabase();
  }, []);

  // Function to fetch location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    } else {
      Alert.alert('Location permission required', 'We need access to your location.');
    }
  };

  // Function to handle image selection
  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'You need to grant permission to access the gallery');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
      selectionLimit: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);

      // Fetch location data when selecting an image
      await getLocation();

      const image = {
        path: result.uri,
        timestamp: new Date().toISOString(),
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
      };

      if (db) {
        await insertImage(db, image);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Drawer.Section title="">
        <Drawer.Item label="Camera" onPress={() => navigation.navigate('Camera')} />
        <Drawer.Item label="Gallery" onPress={() => navigation.navigate('Gallery')} />
        <Drawer.Item
          label="Upload Image"
          icon={() => (
            <MaterialCommunityIcons name="plus-circle" size={24} color="#000" />
          )}
          onPress={selectImage}
        />
      </Drawer.Section>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Text style={styles.imageText}>Selected Image:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
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
