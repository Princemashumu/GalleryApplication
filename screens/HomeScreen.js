import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { openDatabaseAsync, getAllImages, deleteImage } from '../database/db';
import * as FileSystem from 'expo-file-system';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for map icon

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(false); // New state for map visibility

  // Function to initialize database and fetch images
  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const database = await openDatabaseAsync();
      
      const fetchedImages = await getAllImages(database);
      console.log('Fetched images:', fetchedImages);

      if (fetchedImages && fetchedImages.length > 0) {
        // Process and save images
        const processedImages = await Promise.all(fetchedImages.map(async (image) => {
          const base64 = image.base64.startsWith('data:image') 
            ? image.base64 
            : `data:image/jpeg;base64,${image.base64}`;
          const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
          const fileUri = `${FileSystem.documentDirectory}image_${image.id}.jpg`;

          try {
            await FileSystem.writeAsStringAsync(fileUri, base64Data, {
              encoding: FileSystem.EncodingType.Base64
            });

            return {
              ...image,
              base64: fileUri,
              localUri: fileUri
            };
          } catch (fileError) {
            console.error('Error saving image file:', fileError);
            return {
              ...image,
              base64: base64,
              localUri: null
            };
          }
        }));

        setImages(processedImages);
        setFilteredImages(processedImages);
      } else {
        console.log('No images found in the database');
        setImages([]);
        setFilteredImages([]);
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle image deletion
  const handleDeleteImage = async (image) => {
    try {
      const database = await openDatabaseAsync();
      await deleteImage(database, image.id);
      
      if (image.localUri) {
        await FileSystem.deleteAsync(image.localUri);
      }
      
      Alert.alert('Success', 'Image deleted successfully');
      await initializeDatabase();
    } catch (error) {
      console.error('Error deleting image:', error);
      Alert.alert('Error', 'Failed to delete image');
    }
  };

  // Confirm delete image
  const confirmDeleteImage = (image) => {
    Alert.alert(
      'Delete Image', 
      'Are you sure you want to delete this image?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteImage(image)
        }
      ]
    );
  };

  // Use useFocusEffect to reload images every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      initializeDatabase();
    }, [])
  );

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
    const filtered = images.filter(
      (image) =>
        image.timestamp.toLowerCase().includes(lowerQuery) ||
        image.latitude.toString().includes(query) ||
        image.longitude.toString().includes(query)
    );
    setFilteredImages(filtered);
  };

  // Handle image click to show in full-screen modal
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Render each grid image
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity 
        onPress={() => handleImageClick(item)} 
        onLongPress={() => confirmDeleteImage(item)}
        delayLongPress={500}
        style={styles.gridImageContainer}
      >
        <Image 
          source={{ uri: item.base64 }} 
          style={styles.gridImage} 
          resizeMode="cover"
        />
        <Text style={styles.imageMetadata}>{item.timestamp}</Text>
      </TouchableOpacity>
    );
  };

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={initializeDatabase} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry Loading</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by timestamp, latitude, or longitude"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Map toggle button */}
      <TouchableOpacity 
        onPress={() => setIsMapVisible(prev => !prev)} 
        style={styles.mapToggleButton}
      >
        <Ionicons name="map" size={30} color="#000" />
      </TouchableOpacity>

      {/* Conditionally render MapView */}
      {isMapVisible && (
        <MapView 
        style={styles.map}
        initialRegion={{
          latitude: -26.2041,  // Johannesburg latitude (South Africa)
          longitude: 28.0473,  // Johannesburg longitude (South Africa)
          latitudeDelta: 5,    // Adjust zoom level for better visibility of South Africa
          longitudeDelta: 5,   // Adjust zoom level for better visibility of South Africa
        }}
      >
      
          {filteredImages.map((image) => 
            image.latitude && image.longitude ? (
              <Marker
              style={color= 'red'}
                key={image.id}
                coordinate={{
                  latitude: parseFloat(image.latitude),
                  longitude: parseFloat(image.longitude),
                }}
                title={image.timestamp}
                description={`Taken on ${image.timestamp}`}
              />
            ) : null
          )}
        </MapView>
      )}

      {filteredImages.length === 0 ? (
        <Text style={styles.emptyText}>No images available</Text>
      ) : (
        <FlatList
          data={filteredImages}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          numColumns={3}
          columnWrapperStyle={styles.noSpaceColumnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No images found</Text>}
        />
      )}

      <Modal 
        visible={modalVisible} 
        transparent={true} 
        animationType="fade" 
        onRequestClose={closeModal}
      >
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <View style={styles.fullScreenContainer}>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.base64 }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    height: 300, 
    borderRadius: 10,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  mapToggleButton: {
    position: 'absolute',
    top: 5,
    right: 19,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    width: '80%',
  },
  gridImageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  imageMetadata: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
});

export default HomeScreen;
