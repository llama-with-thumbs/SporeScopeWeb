# Bio-chart Project
This project involves programming microcontrollers to collect data from sensors, transmit it to a database, perform analysis, and present the results through a web-based user interface.

- Designed and developed in 2023
- Technology stack: Python, JavaScript, ReactJS, TypeScript, Firebase, Airbnb, AWS EC2, Git, Conventional Commits
- Deployed at: https://llama-with-thumbs.github.io/bio-chart-web/
- App-interface

![app interface](https://firebasestorage.googleapis.com/v0/b/bio-chart.appspot.com/o/Bio-chart%20Assets%2Fapp%20interface.png?alt=media&token=6f9136d7-25c7-414b-9cf9-1112813bec40)

# Data model
Here is a schematic representation of the data model that was established to better accommodate the growing project, employing an ontology-based approach in its creation.
![data model](https://firebasestorage.googleapis.com/v0/b/bio-chart.appspot.com/o/Bio-chart%20Assets%2FChamber-flask-model.png?alt=media&token=d89aa493-8749-42cf-ba25-f43fd4dba40a)


# First Step: Image Processing
The initial step involves processing the raw image, which includes tasks such as:

- Aligning the image to a level position.
- Cropping out the necessary portions.
- Saving the processed images for later use.

In addition, images are saved in a database (Firebase is used, but consideration is given to switching to a more convenient solution).

![chamber](https://firebasestorage.googleapis.com/v0/b/bio-chart.appspot.com/o/Bio-chart%20Assets%2Fraw_image_with_rectangles.jpg?alt=media&token=b4b01c2b-6169-45e6-843c-703cd34350aa)
# Second Step: Color Channel Extraction
The second step involves extracting color channel values from the images and saving them to the database.

![Image Description](https://firebasestorage.googleapis.com/v0/b/bio-chart.appspot.com/o/captured_images%2FFull-sized%20image%2FFlasks%20combined%20with%20transparent%20backgrounds.png?alt=media&token=156a6075-0feb-420e-9895-621268399242)

