// screens/DeletedPhotosScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Image } from 'react-native';

// Assuming you have a mock function to get deleted photos from the database or state
const getDeletedPhotos = () => {
  // This function should return a list of deleted photos, each with an `id` and `uri` or `url`
  return [
    { id: '1', uri: 'https://example.com/photo1.jpg' },
    { id: '2', uri: 'https://example.com/photo2.jpg' },
    // Add more mock data here
  ];
};

const DeletedPhotosScreen = () => {
  const [deletedPhotos, setDeletedPhotos] = useState([]);

  useEffect(() => {
    // Fetch the deleted photos when the screen is loaded
    setDeletedPhotos(getDeletedPhotos());
  }, []);

  const handleRestorePhoto = (id) => {
    // Handle the restore logic here (e.g., move photo back to the main gallery)
    console.log(`Restoring photo with ID: ${id}`);
  };

  const handleDeletePhotoPermanently = (id) => {
    // Handle permanent deletion logic here (e.g., remove photo from the database or storage)
    console.log(`Permanently deleting photo with ID: ${id}`);
    setDeletedPhotos(deletedPhotos.filter((photo) => photo.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.photoItem}>
      <Image source={{ uri: item.uri }} style={styles.photo} />
      <View style={styles.actions}>
        <Button title="Restore" onPress={() => handleRestorePhoto(item.id)} />
        <Button
          title="Delete Permanently"
          onPress={() => handleDeletePhotoPermanently(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deleted Photos</Text>
      <FlatList
        data={deletedPhotos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No deleted photos available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  photoItem: {
    marginBottom: 15,
    alignItems: 'center',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default DeletedPhotosScreen;
