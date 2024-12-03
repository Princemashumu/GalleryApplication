import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, Alert } from 'react-native';
import { Drawer } from 'react-native-paper'; // for the drawer layout
import { MaterialCommunityIcons } from 'react-native-vector-icons'; // for the icons
import { launchImageLibrary } from 'react-native-image-picker'; // Import the image picker

export const DrawerContent = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);

  // Function to handle image selection
  const selectImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 }, // You can customize options here
      (response) => {
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', 'Image picker error: ' + response.errorMessage);
        } else {
          setImageUri(response.assets[0].uri); // Set the selected image URI
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Drawer.Section title="">
        {/* Camera screen item */}
        <Drawer.Item label="Camera" onPress={() => navigation.navigate('Camera')} />
        <Drawer.Item label="Gallery" onPress={() => navigation.navigate('Gallery')} />

        {/* Upload Image Button with Plus Icon */}
        <Drawer.Item
          label="Upload Image"
          icon={() => (
            <MaterialCommunityIcons
              name="plus-circle"
              size={24}
              color="#000"
            />
          )}
          onPress={selectImage} // Trigger the image picker
        />
      </Drawer.Section>

      {/* Show selected image (Optional) */}
      {imageUri && (
        <View style={styles.imageContainer}>
          <Text style={styles.imageText}>Selected Image:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      {/* Follow Us Section */}
      <Drawer.Section title="" style={styles.followUsSection}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="github"
            size={30}
            onPress={() => Linking.openURL('https://github.com/your-profile')} // Replace with your GitHub URL
            style={styles.icon}
          />
          <MaterialCommunityIcons
            name="facebook"
            size={30}
            onPress={() => Linking.openURL('https://www.facebook.com/in/your-profile')} // Replace with your Facebook URL
            style={styles.icon}
          />
          <MaterialCommunityIcons
            name="twitter"
            size={30}
            onPress={() => Linking.openURL('https://www.twitter.com/in/your-profile')} // Replace with your Twitter URL
            style={styles.icon}
          />
          <MaterialCommunityIcons
            name="whatsapp"
            size={30}
            onPress={() => Linking.openURL('https://www.whatsapp.com/in/your-profile')} // Replace with your WhatsApp URL
            style={styles.icon}
          />
        </View>

        {/* Version Text */}
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
    alignItems: 'center', // Center the icons and text
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  icon: {
    marginHorizontal: 15,
    color: '#000', // Customize the color as needed
  },
  versionText: {
    fontSize: 14,
    color: '#333', // Color of version text
    marginTop: 15, // Space between icons and text
    textAlign: 'center',
    fontWeight: 'bold', // Make the version text bold
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
