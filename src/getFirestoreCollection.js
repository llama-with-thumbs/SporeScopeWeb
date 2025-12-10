import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
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

            const platesCollectionRef = collection(doc(db, "sporescope", docRef.id), "plates");
            const platesQuerySnapshot = await getDocs(platesCollectionRef);
            const platesData = await Promise.all(
              platesQuerySnapshot.docs.map(async (plateDoc) => {
                const plate = plateDoc.data();
                // Always include this plate regardless of last_update age

                const snippetsCollectionRef = collection(plateDoc.ref, "snippets");
                const snippetsQuerySnapshot = await getDocs(snippetsCollectionRef);
                const snippetsData = snippetsQuerySnapshot.docs.map((snippetDoc) => snippetDoc.data());

                return { ...plate, snippets: snippetsData };
              })
            );

            return { creation_date, chamber, plates: platesData };
          })
        );

        setChamberData(data);
        
        // Initialize all chambers as open
        const initialOpenState = {};
        data.forEach((chamber) => {
          initialOpenState[chamber.chamber] = true;
        });
        setOpenChambers(initialOpenState);
        
        setIsLoading(false); // Set loading to false when data is fetched
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
              <div style={{ display: 'flex', alignItems: 'center', padding: "5px 0 5px 10px" }}>
                <div
                  onClick={() => toggleChamber(chamber.chamber)}
                  style={{
                    cursor: 'pointer',
                    userSelect: 'none',
                    color: 'red',
                    fontSize: '20px',
                    marginRight: '10px',
                    width: '20px',
                    height: '20px',
                    lineHeight: '20px',
                  }}
                >
                  {isOpen ? '▼' : '▶'}
                </div>
                <div>
                  <strong>Chamber identifier:</strong> {chamber.chamber}
                </div>
              </div>
              
              <div
                style={{
                  overflow: 'hidden',
                  transition: 'max-height 0.35s ease, opacity 0.35s ease',
                  maxHeight: isOpen ? '10000px' : '0px',
                  opacity: isOpen ? 1 : 0,
                }}
              >
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
