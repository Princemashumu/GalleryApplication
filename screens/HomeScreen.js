import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Modal, TouchableOpacity, TextInput } from 'react-native';

// Declare 'images' array
const images = Array.from({ length: 30 }, (_, index) => ({
  id: `${index + 1}`,
  uri: { uri: `https://via.placeholder.com/150?text=Image+${index + 1}` },
  location: index % 2 === 0 ? 'Beach' : 'Mountain',
  date: `2024-12-${String(index + 1).padStart(2, '0')}`,
}));

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); // Track selected image index
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState(images);

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
        image.location.toLowerCase().includes(lowerQuery) || image.date.includes(query)
    );
    setFilteredImages(filtered);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleImageClick(index)} style={styles.gridImageContainer}>
      <Image source={item.uri} style={styles.gridImage} />
      <Text style={styles.imageMetadata}>{item.location}</Text>
      <Text style={styles.imageMetadata}>{item.date}</Text>
    </TouchableOpacity>
  );

  const renderFullImage = ({ item }) => (
    <View style={styles.imageSlide}>
      <Image source={item.uri} style={styles.fullScreenImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by location or date (YYYY-MM-DD)"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredImages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.noSpaceColumnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No images found</Text>}
      />
      <Modal visible={modalVisible} transparent={false} animationType="fade" onRequestClose={closeModal}>
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <FlatList
          data={filteredImages}
          horizontal
          pagingEnabled
          initialScrollIndex={selectedIndex}
          keyExtractor={(item) => item.id}
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
