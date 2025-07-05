import React, { useState, useEffect } from "react";
import "../App.css";
import "../style.css";

type Recommendation = string;

type InputBox = {
    id: number;
    value: string;
};

const BookRecommendations: React.FC = () => {
    const [inputBoxes, setInputBoxes] = useState<InputBox[]>([]);
    const [recommendations, setRecommendations] = useState<Recommendation[]>(
        []
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        addField();
    }, []);

    const addField = () => {
        setInputBoxes((prev) => [...prev, { id: prev.length, value: "" }]);
    };

    const handleInputChange = (id: number, value: string) => {
        setInputBoxes((prev) =>
            prev.map((box) => (box.id === id ? { ...box, value } : box))
        );
    };

    const getRecommendations = async () => {
        const books = inputBoxes
            .map((box) => box.value)
            .filter((val) => val.trim() !== "");
        if (books.length === 0) {
            alert("Please enter a book title.");
            return;
        }

        setLoading(true);
        setRecommendations([]);

        try {
            const response = await fetch(
                `/api/recommend?books=${encodeURIComponent(books.join(","))}`
            );
            const data = await response.json();

            if (data.recommendations) {
                setRecommendations(data.recommendations);
            } else {
                alert("No recommendations found.");
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            alert("Error fetching recommendations.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>Book Recommendations</h1>

            <div className="input_div">
                {inputBoxes.map((box) => (
                    <div key={box.id} className="inputcontainer">
                        <input
                            type="text"
                            value={box.value}
                            onChange={(e) =>
                                handleInputChange(box.id, e.target.value)
                            }
                            placeholder="Enter a book title"
                        />
                    </div>
                ))}
            </div>

            <button onClick={getRecommendations} className="text-button">
                {loading ? "Loading..." : "Get Recommendations"}
            </button>

            <button onClick={() => addField()} className="text-button">
                <b>+</b>
            </button>

            <div className="container">
                {recommendations.length > 0 ? (
                    <ul>
                        {recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No recommendations yet.</p>
                )}
            </div>
        </div>
    );
};

export default BookRecommendations;
