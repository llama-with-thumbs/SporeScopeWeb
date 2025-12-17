# SporeScope Web Viewer
A web application for visualizing biological growth experiments captured on Raspberry Pi–based imaging rigs.
The system loads structured experiment data from Firestore, processes it, and presents an interactive interface for exploring plates, snippets, perimeter shapes, time-series metrics, and growth dynamics.

- Designed and developed in 2025
- Deployed at: https://llama-with-thumbs.github.io/SporeScopeWeb/

# App-interface
![app interface](https://firebasestorage.googleapis.com/v0/b/sporescope.firebasestorage.app/o/Assets%2FScreenshot%202025-12-16%20151047.png?alt=media&token=c83a15da-34ed-4abf-92eb-2c0bb16e5a67)

# Data model
Here is a schematic representation of the data model that was established to better accommodate the growing project, employing an ontology-based approach in its creation.

![data model](https://firebasestorage.googleapis.com/v0/b/bio-chart.appspot.com/o/Bio-chart%20Assets%2FChamber-flask-model.png?alt=media&token=d89aa493-8749-42cf-ba25-f43fd4dba40a)


# Technology Stack

- React + TypeScript (UI)
- Firebase Firestore (data storage)
- Firebase Storage (image hosting)
- JavaScript/Canvas for polygon rendering
- Recharts for time-series visualizations
- Conventional Commits, GitHub Pages deployment

# Image Processing
Images are collected by Raspberry Pi cameras and preprocessed:

- Alignment & leveling
- Cropping into flask regions
- Saving raw + processed images
- Uploading metadata and measurements to Firestore

# Feature Extraction

For each plate, scripts extract:
- Mean RGB intensities
- Growth area & perimeter
- Polygon boundary shapes
- All results are stored as document fields or shape subcollections.
  
# Current Focus

- Improving shape detection visualization
- Synchronizing charts and GIF frames
- Adding ontology-driven metadata
- Building a generic "biological experiment explorer" UI


![chamber](https://firebasestorage.googleapis.com/v0/b/sporescope.firebasestorage.app/o/Assets%2Ftest_with_circles.png?alt=media&token=91d37956-3e60-47c9-836a-6032dff34ef3)
