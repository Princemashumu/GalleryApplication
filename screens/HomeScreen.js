import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { openDatabase, createTable, getAllImages } from '../database/db'; // Import database functions

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [db, setDb] = useState(null); // Store the database instance

  // Fetch images when the component mounts
  useEffect(() => {
    const initializeDatabase = async () => {
      const database = openDatabase();
      setDb(database);
      createTable(database); // Ensure the images table exists

      // Fetch all images after creating the table
      getAllImages(database, (fetchedImages) => {
        console.log('Fetched images:', fetchedImages); // Log the fetched images
        setImages(fetchedImages);
        setFilteredImages(fetchedImages); // Initially show all images
      });
    };

    initializeDatabase();
  }, []);

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedIndex(0);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
    const filtered = images.filter(
      (image) =>
        image.timestamp.toLowerCase().includes(lowerQuery) || // Assuming 'timestamp' is a searchable field
        image.latitude.toString().includes(query) || // You can adjust to match your criteria
        image.longitude.toString().includes(query)
    );
    console.log('Filtered images:', filtered); // Log the filtered images
    setFilteredImages(filtered);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleImageClick(index)} style={styles.gridImageContainer}>
      <Image source={{ uri: item.path }} style={styles.gridImage} />
      <Text style={styles.imageMetadata}>{item.timestamp}</Text>
      <Text style={styles.imageMetadata}>{`Lat: ${item.latitude}, Long: ${item.longitude}`}</Text>
    </TouchableOpacity>
  );

  const renderFullImage = ({ item }) => (
    <View style={styles.imageSlide}>
      <Image source={{ uri: item.path }} style={styles.fullScreenImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by timestamp, latitude, or longitude"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {images.length === 0 ? (
        <Text style={styles.emptyText}>Loading images...</Text> // Show a loading message while images are being fetched
      ) : (
        <FlatList
          data={filteredImages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.noSpaceColumnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No images found</Text>}
        />
      )}
      <Modal visible={modalVisible} transparent={false} animationType="fade" onRequestClose={closeModal}>
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <FlatList
          data={filteredImages}
          horizontal
          pagingEnabled
          initialScrollIndex={selectedIndex}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFullImage}
          showsHorizontalScrollIndicator={false}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchInput: { height: 40, borderColor: '#ccc', borderWidth: 1, margin: 5, paddingHorizontal: 10, borderRadius: 5 },
  gridImageContainer: { flex: 1, margin: 1 },
  gridImage: { width: 120, height: 120 },
  imageMetadata: { fontSize: 12, textAlign: 'center', color: '#555' },
  noSpaceColumnWrapper: { justifyContent: 'space-between' },
  modalContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
  closeButton: { position: 'absolute', top: 40, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20 },
  closeButtonText: { color: 'white', fontSize: 16 },
  fullScreenImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  imageSlide: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#777' },
});

export default HomeScreen;
