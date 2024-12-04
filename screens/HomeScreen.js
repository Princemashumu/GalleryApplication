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

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // Open database
    const database = await openDatabaseAsync();
    
    // Delete image from database
    await deleteImage(database, image.id);
    
    // Remove local file if exists
    if (image.localUri) {
      await FileSystem.deleteAsync(image.localUri);
    }
    
    // Refresh images
    
    // Show success alert
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
        delayLongPress={500} // 500ms long press duration
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
        <ActivityIndicator 
          size="large" 
          color="#0000ff" 
          style={styles.loader}
        />
        <Text style={styles.loadingText}>Loading images...</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  gridImageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    Top:20,
    height: 150,
    borderRadius: 10,
  },
  imageMetadata: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  noSpaceColumnWrapper: {
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  fullScreenImage: {
    // alignContent:"center",
    width: '100%',
    height: '100%',
    resizeMode: 'fill',
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  imageSlide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageInfo: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
});


export default HomeScreen;
