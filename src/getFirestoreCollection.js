import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, doc } from "firebase/firestore";

import PlatesList from "./PlatesList";
import "./getFirestoreCollection.css";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLVbT9SlfBsb2QlwXlk7_F0zPlxBxGjaY",
  authDomain: "sporescope.firebaseapp.com",
  projectId: "sporescope",
  storageBucket: "sporescope.firebasestorage.app",
  messagingSenderId: "586817503616",
  appId: "1:586817503616:web:0409752be90dbfc76f8165",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const FirestoreDataComponent = () => {
  const [chamberData, setChamberData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openChambers, setOpenChambers] = useState({}); // Track open/closed state for each chamber

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sporescope"));

        const data = await Promise.all(
          querySnapshot.docs.map(async (docRef) => {
            const { creation_date, chamber } = docRef.data();

            // Load all plates for this chamber
            const platesCollectionRef = collection(doc(db, "sporescope", docRef.id), "plates");
            const platesQuerySnapshot = await getDocs(platesCollectionRef);

            const platesData = await Promise.all(
              platesQuerySnapshot.docs.map(async (plateDoc) => {
                const plate = plateDoc.data();

                // -----------------------------
                // 1) Load snippets (same as before)
                // -----------------------------
                const snippetsCollectionRef = collection(plateDoc.ref, "snippets");
                const snippetsQuerySnapshot = await getDocs(snippetsCollectionRef);
                const snippetsData = snippetsQuerySnapshot.docs.map((d) => d.data());

                // -----------------------------
                // 2) NEW — resolve most_recent_snippet_in_firestore_path
                // -----------------------------
                let shapesData = [];
                let resolvedSnippet = null;

                if (plate.most_recent_snippet_in_firestore_path) {
                  try {
                    const snippetPath = plate.most_recent_snippet_in_firestore_path;
                    const snippetDocRef = doc(db, snippetPath);

                    const snippetSnap = await getDoc(snippetDocRef);
                    if (snippetSnap.exists()) {
                      resolvedSnippet = {
                        id: snippetSnap.id,
                        ...snippetSnap.data(),
                      };

                      // -----------------------------
                      // 3) Load shapes subcollection
                      // -----------------------------
                      const shapesRef = collection(snippetDocRef, "shapes");
                      const shapesSnap = await getDocs(shapesRef);

                      shapesData = shapesSnap.docs.map((shapeDoc) => ({
                        id: shapeDoc.id,
                        ...shapeDoc.data(),
                      }));

                      console.log("SHAPES for plate:", plate.plate, shapesData);
                    }
                  } catch (err) {
                    console.error("Error fetching shapes via most_recent_snippet_in_firestore_path:", err);
                  }
                }

                // -----------------------------
                // 4) Return plate with new shapes field
                // -----------------------------
                return {
                  ...plate,
                  snippets: snippetsData,
                  resolved_snippet: resolvedSnippet, // optional
                  shapes: shapesData, // ← YOU NEED THIS
                };
              })
            );

            return { creation_date, chamber, plates: platesData };
          })
        );

        setChamberData(data);

        // Initialize open chambers
        const initialOpenState = {};
        data.forEach((c) => {
          initialOpenState[c.chamber] = true;
        });
        setOpenChambers(initialOpenState);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, []);

  const toggleChamber = (chamberId) => {
    setOpenChambers((prev) => ({
      ...prev,
      [chamberId]: !prev[chamberId],
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {isLoading ? (
        // Render a loading spinner while data is being fetched
        <div className="spinner"></div>
      ) : (
        // Render the content when data is loaded
        chamberData.map((chamber) => {
          const isOpen = openChambers[chamber.chamber] || false;

          return (
            <div
              key={chamber.creation_date}
              style={{ padding: "0", margin: "10px", border: "1px solid #ccc", borderRadius: "3px" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "5px 0 5px 10px" }}>
                <div
                  onClick={() => toggleChamber(chamber.chamber)}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#cc0000")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "red")}
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                    color: "red",
                    fontSize: "20px",
                    marginRight: "10px",
                    width: "20px",
                    height: "20px",
                    lineHeight: "20px",
                    transition: "color 0.2s ease",
                  }}>
                  {isOpen ? "▼" : "▶"}
                </div>
                <div>
                  <strong>Chamber identifier:</strong> {chamber.chamber}
                </div>
              </div>

              <div
                style={{
                  overflow: "hidden",
                  transition: "max-height 0.35s ease, opacity 0.35s ease",
                  maxHeight: isOpen ? "10000px" : "0px",
                  opacity: isOpen ? 1 : 0,
                }}>
                {chamber.plates.map((plate) => (
                  <PlatesList
                    key={plate.plate}
                    snippets={plate.snippets}
                    plate={plate}
                    creation_date={chamber.creation_date}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FirestoreDataComponent;
