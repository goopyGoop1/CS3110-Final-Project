### CS3110-Final-Project Art Gallery


---

#### Overview
This project is a 3D art gallery simulation built using WebGL. It showcases an interactive and visually engaging 3D environment with textured walls, dynamically rendered picture frames, and objects such as pyramids and spheres. The gallery features animations, lighting effects, and textures for an immersive experience.

---

#### Project Directory Structure
The project requires a specific folder structure for proper execution. Ensure the files are arranged as follows:

```
/ProjectFolder
├── /ArtGallery
│   ├── ArtGallery2.html
│   ├── ArtGallery2.js
├── cuon-matrix.js
├── cuon-utils.js
├── webgl-debug.js
├── webgl-utils.js
├── CanadianArt.jpg
├── CSArt.jpg
├── Masjid.jpg
├── MonaLisa.jpg
├── NorthernLightsMagic.jpg
├── Picasso.jpg
├── Garffti.jpg
```

**Important Notes:**
- The `ArtGallery2.html` and `ArtGallery2.js` files must be placed inside a folder named `/ArtGallery`.
- The **library files** (`cuon-matrix.js`, `cuon-utils.js`, `webgl-debug.js`, and `webgl-utils.js`) and the **image files** must reside in the **parent directory** (`/ProjectFolder`).

---

#### Requirements

1. **WebGL-Compatible Browser:**
   Use a browser that supports WebGL, such as:
   - **Google Chrome**
   - **Mozilla Firefox**

2. **JavaScript Libraries:**
   The following library files are required and must be placed in the **parent directory** (`/ProjectFolder`):
   - `cuon-matrix.js`
   - `cuon-utils.js`
   - `webgl-debug.js`
   - `webgl-utils.js`

3. **Image Files:**
   The following image files are required and must also be placed in the **parent directory** (`/ProjectFolder`):
   - `CanadianArt.jpg`
   - `CSArt.jpg`
   - `Masjid.jpg`
   - `MonaLisa.jpg`
   - `NorthernLightsMagic.jpg`
   - `Picasso.jpg`
   - `Garffti.jpg`

---

#### How to Run the Project

1. **Set Up the File Structure:**
   - Ensure the directory structure matches the one described above.
   - Place the `ArtGallery2.html` and `ArtGallery2.js` files inside the `/ArtGallery` folder.
   - Place the library and image files in the parent folder (`/ProjectFolder`).

2. **Open the HTML File:**
   - Open the `ArtGallery2.html` file in a WebGL-compatible browser.

3. **Interact with the Gallery:**
   - Use the following controls to navigate and explore the gallery:

| Key(s)           | Action                                      |
|-------------------|---------------------------------------------|
| **Arrow Keys/WASD** | Move the camera forward, backward, left, or right |
| **Q/E**           | Rotate the camera yaw                     |
| **R/F**           | Adjust the camera pitch                   |
| **+/–**           | Increase or decrease the field of view (FOV) |

---

#### Features

1. **Dynamic 3D Environment:**
   - A visually realistic gallery with textured walls and floors.
   - Dynamic grid-based floor design for added aesthetics.

2. **Interactive Objects:**
   - Picture frames displaying textures of iconic artworks.
   - Animated objects, such as pyramids and spheres, with dynamic rotation.

3. **Lighting:**
   - Ambient lighting provides a base level of illumination.
   - Directional and diffuse lighting create realistic shadows and highlights.

4. **Textures:**
   - High-quality textures from included image files are applied to walls and objects.

5. **Animation:**
   - Objects like pyramids and spheres rotate dynamically, adding life to the gallery.

---

#### Notes and Customization

1. **File Paths:**
   - Do not change the directory structure; the project assumes the library and image files are in the **parent folder** relative to the `/ArtGallery` directory.

2. **Customization:**
   - To add custom objects or textures, modify the `ArtGallery2.js` file. Replace the image file names in the `initTextures` function to apply new textures.

3. **Performance:**
   - The project is optimized for modern browsers. For best performance, avoid running multiple tabs with intensive 3D rendering simultaneously.

---

#### Troubleshooting

1. **File Not Found:**
   - Ensure the `ArtGallery2.html` file and `ArtGallery2.js` are in the `/ArtGallery` folder.
   - Verify that the library and image files are correctly placed in the parent folder.

2. **Textures Not Loading:**
   - Check the image file paths in the `ArtGallery2.js` file under the `initTextures` function.

3. **WebGL Errors:**
   - Ensure your browser supports WebGL and that it is enabled.

---


![image](https://github.com/user-attachments/assets/b8687607-8493-499e-bf30-e2b912520d77)

![image](https://github.com/user-attachments/assets/dd57779a-6f64-4909-98b0-e3233153672c)

![image](https://github.com/user-attachments/assets/a7729b77-1724-4345-8588-c07e20028281)

![image](https://github.com/user-attachments/assets/cf270885-7bed-4ecf-9faf-0f74e4d5cdb4)

![image](https://github.com/user-attachments/assets/a7c62ba5-6ec9-4d41-90bb-e90a16007f7d)


---


Enjoy exploring the 3D art gallery and immerse yourself in a creative visual experience! 😊
