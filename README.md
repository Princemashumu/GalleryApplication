# 🖼️ React Native Image Gallery App

A feature-rich **React Native Image Gallery Application** that enables users to manage and browse images stored in an SQLite database. The app offers functionalities such as image viewing, searching, and deletion.

---

## **Features** ✨
- **Image Management**: Store and manage images in a local SQLite database. 🗃️
- **Search Functionality**: Search images by timestamp, latitude, or longitude. 🔍
- **Full-Screen Viewing**: View images in a full-screen modal. 🖥️
- **Delete Images**: Long press an image to delete it with confirmation. ❌
- **Efficient State Management**: Images are fetched and displayed using optimized state handling. ⚡

---

## **Installation Instructions** 🛠️

### **Prerequisites** ✅
1. [Node.js](https://nodejs.org/) installed (v12 or higher recommended) 🔧
2. [Expo CLI](https://expo.dev/) installed globally 🌍
3. Basic understanding of React Native development 📚

---

### **Steps to Run Locally** 🏃‍♂️
1. **Clone the Repository**:
   ```sh
   git clone https://github.com/yourusername/react-native-image-gallery.git
   cd react-native-image-gallery
## Install Dependencies: Navigate to the project directory and install all dependencies:

```
npm install
```
Run the Application: Start the Expo development server:

```
npx expo start
```
## Scan the QR code using the Expo Go app or run the project on an emulator. 📱

# How to Use 🧑‍💻
### Add Images 📸:

Add images to the SQLite database manually or through an API.
# Search Images 🔎:

Use the search bar to filter images by timestamp, latitude, or longitude.
# View Images 🖼️:

Tap an image to view it in a full-screen modal.
# Delete Images 🗑️:

Long press an image to trigger the delete confirmation.

# Code Overview 📜
### HomeScreen Component 🏠
The HomeScreen component is the primary interface of the application. Below are key highlights:

## Database Operations:
Initializes the SQLite database and fetches images using openDatabaseAsync and getAllImages. 🏗️
## Image Processing:
Images are processed and saved as Base64 strings in the local file system. 💾
## Search Functionality:
Filters images based on user queries in real-time. 🔄
## Full-Screen Modal:
Displays a selected image in a full-screen modal. ✨
## Error Handling:
Displays user-friendly messages in case of errors. ⚠️
# Key Functions 🔑

- initializeDatabase: Fetches and processes all images stored in the SQLite database. 📥
- handleSearch: Filters images dynamically based on user input. 🔄
- handleDeleteImage: Deletes an image from both the SQLite database and the local file system. 🗑️

# File Structure 📂
```
react-native-image-gallery/
├── components/
│   ├── HomeScreen.js         # Main image gallery screen
│   └── ...
├── database/
│   ├── db.js                 # SQLite database functions
│   └── ...
├── assets/
│   └── ...                   # Static assets (e.g., images)
├── App.js                    # Entry point for the app
└── package.json              # Project metadata and dependencies
```
# Key Dependencies 🔑

- React Native: Framework for building mobile applications. 📱
- Expo: Simplifies the development and deployment process. 🚀
- SQLite: Local database for storing image metadata. 🗃️
- FileSystem: File handling using the expo-file-system package. 📁
- Contributing 🤝

## Contributions are welcome! Follow these steps to contribute:

# Fork the repository. 🍴
## Create a new branch:
```
git checkout -b feature/my-feature
```
Make your changes and commit:
```
git commit -m "Add new feature"
```
Push to your branch:
```
git push origin feature/my-feature
```
## Open a Pull Request. 📬
# License 📜
This project is licensed under the MIT License. 🛡️

# Acknowledgements 🙏
React Native and Expo team 🌍
