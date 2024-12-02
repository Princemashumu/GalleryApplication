import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Modal, TouchableOpacity } from 'react-native';
import { sections } from './sectionsData'; // Import your data

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);  // To control the modal visibility
  const [selectedImage, setSelectedImage] = useState(null);  // To store the selected image

  // Handler to open the modal and set the selected image
  const handleImageClick = (imageUri) => {
    setSelectedImage(imageUri);  // Set the clicked image
    setModalVisible(true);  // Show the modal
  };

  // Handler to close the modal
  const closeModal = () => {
    setModalVisible(false);  // Hide modal
    setSelectedImage(null);  // Reset selected image
  };

  const renderItem = ({ item, index, sectionLength }) => (
    <TouchableOpacity onPress={() => handleImageClick(item.uri)} style={styles.gridImageContainer}>
      <Image
        source={item.uri}
        style={[
          styles.gridImage,
          index < sectionLength - 3 ? { marginBottom: 1 } : {}, // 1px space between rows except the last row
        ]}
      />
    </TouchableOpacity>
  );

  const renderSection = ({ item, index }) => (
    <View style={styles.section}>
      {item.title ? (
        <Text style={styles.sectionTitle}>{item.title}</Text>
      ) : null}
      <FlatList
        data={item.images}
        renderItem={(imageItem) =>
          renderItem({ ...imageItem, sectionLength: item.images.length })
        }
        keyExtractor={(image) => image.id}
        numColumns={index === 0 ? 3 : 1} // 3 columns for the first section
        columnWrapperStyle={index === 0 ? styles.noSpaceColumnWrapper : null}
        showsHorizontalScrollIndicator={false}
        horizontal={index !== 0}
        key={index === 0 ? 'grid-layout' : `list-layout-${item.id}`} // Force re-render
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(section) => section.id}
        ListEmptyComponent={<Text>No sections available</Text>}
      />

      {/* Modal for full-screen image view */}
      <Modal
        visible={modalVisible}
        transparent={false}  // Makes the modal fill the screen
        animationType="fade"
        onRequestClose={closeModal}  // Close the modal when pressing back
      >
        
        <View style={styles.modalContainer}>
          <TouchableOpacity onRequestClose={closeModal}  style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Image
            source={selectedImage}
            style={styles.fullScreenImage}  // Full-screen style for the image
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    paddingHorizontal: 10, // Padding inside the title
    paddingTop: 5,
    paddingBottom: 5,
  },
  gridImageContainer: {
    flex: 1,
  },
  gridImage: {
    width: 120,
    height: 120,
  },
  noSpaceColumnWrapper: {
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  // Modal styling
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',  // Set background to black for better contrast
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',  // Ensures the image maintains its aspect ratio
  },
});

export default HomeScreen;
