import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Modal, TouchableOpacity, TextInput } from 'react-native';
import { openDatabaseAsync, getAllImages } from '../database/db';
import * as FileSystem from 'expo-file-system';

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // store selected image
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize database and fetch images
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsLoading(true);
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
        }
      } catch (error) {
        console.error('Error initializing database:', error);
        setError('Failed to load images');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDatabase();
  }, []);

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
    setSelectedImage(image); // Set the selected image
    setModalVisible(true); // Show the modal
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

  // Render loading or error states
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading images...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
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
      {images.length === 0 ? (
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centeredContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  errorText: {
    color: 'red',
    fontSize: 16
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  gridImageContainer: { 
    flex: 1, 
    margin: 1, 
    aspectRatio: 1 
  },
  gridImage: { 
    width: '100%', 
    height: '100%' 
  },
  imageMetadata: { 
    fontSize: 12, 
    textAlign: 'center', 
    color: '#555', 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'rgba(255,255,255,0.7)' 
  },
  noSpaceColumnWrapper: { justifyContent: 'space-between' },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
    zIndex: 1,
  },
  closeButtonText: { color: 'white', fontSize: 16 },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  fullScreenImage: { 
    width: '100%', 
    height: '80%', 
    resizeMode: 'contain' 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16, 
    color: '#777' 
  },
});

export default HomeScreen;
