// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, Image } from 'react-native';
// import { RNCamera } from 'react-native-camera';
// import { PermissionsAndroid, Platform } from 'react-native';

// const CameraScreen = () => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [photo, setPhoto] = useState(null);

//   useEffect(() => {
//     (async () => {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'App needs camera access to take photos',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
//       } else {
//         // For iOS, permissions are requested automatically
//         setHasPermission(true);
//       }
//     })();
//   }, []);

//   let camera;

//   const takePhoto = async () => {
//     if (camera) {
//       const options = { quality: 0.5, base64: true };
//       const data = await camera.takePictureAsync(options);
//       setPhoto(data.uri);
//     }
//   };

//   if (hasPermission === null) {
//     return <Text>Requesting camera permission...</Text>;
//   }

//   if (!hasPermission) {
//     return <Text>No access to camera. Please enable it in settings.</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <RNCamera
//         style={styles.camera}
//         ref={(ref) => {
//           camera = ref;
//         }}
//         type={RNCamera.Constants.Type.back}
//         captureAudio={false}
//       >
//         <View style={styles.buttonContainer}>
//           <Button title="Take Photo" onPress={takePhoto} />
//         </View>
//       </RNCamera>
//       {photo && (
//         <View style={styles.photoContainer}>
//           <Image source={{ uri: photo }} style={styles.photo} />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   camera: { flex: 1 },
//   buttonContainer: {
//     flex: 0.1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   photoContainer: { marginTop: 20 },
//   photo: { width: 300, height: 300, borderRadius: 10 },
// });

// export default CameraScreen;
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { Camera } from 'expo-camera';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri); // Store the photo URI
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} />
      <Button title="Capture" onPress={takePhoto} />
      {photo && (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.photo} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 0.7 },
  photoContainer: { marginTop: 20, alignItems: 'center' },
  photo: { width: 300, height: 300, borderRadius: 10 },
});

export default CameraScreen;
