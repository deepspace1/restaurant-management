import React, { useState, useEffect } from 'react'; // Import useEffect
import './RecipeCarousel.css';

// --- Add onActiveRecipeChange to props ---
const RecipeCarousel = ({ recipes, onActiveRecipeChange }) => {
    const [currentIndex, setCurrentIndex] = useState(1); // Initial active index

    // --- Effect to call the callback when currentIndex changes ---
    useEffect(() => {
        // Ensure callback exists and there are recipes
        if (onActiveRecipeChange && recipes && recipes.length > 0) {
             // Make sure currentIndex is valid before accessing recipes array
            const validIndex = (currentIndex + recipes.length) % recipes.length;
            onActiveRecipeChange(recipes[validIndex]);
        }
        // Depend on currentIndex and the callback itself (and recipes array)
    }, [currentIndex, onActiveRecipeChange, recipes]);

    if (!recipes || recipes.length === 0) {
        return <div style={{ color: 'white', textAlign: 'center' }}>No recipes available.</div>;
    }

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? recipes.length - 1 : prevIndex - 1
        );
        // Callback is now handled by the useEffect hook
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === recipes.length - 1 ? 0 : prevIndex + 1
        );
         // Callback is now handled by the useEffect hook
    };

    const getVisibleRecipes = () => {
       // ...(keep existing logic for getVisibleRecipes)...
       const len = recipes.length;
        if (len === 0) return [];
        if (len === 1) return [null, recipes[0], null];
        if (len === 2) {
            const prevIndex = (currentIndex - 1 + len) % len;
            return [recipes[prevIndex], recipes[currentIndex], null];
        }
        const prevIndex = (currentIndex - 1 + len) % len;
        const nextIndex = (currentIndex + 1) % len;
        return [recipes[prevIndex], recipes[currentIndex], recipes[nextIndex]];
    };

    const visibleRecipes = getVisibleRecipes();
    const activeRecipe = recipes[currentIndex];

    return (
        <div className="recipe-carousel-container">
            <div className="recipe-carousel">
                <button onClick={handlePrev} className="carousel-arrow prev-arrow" aria-label="Previous Recipe">
                    b
                </button>
                <div className="carousel-images">
                    {visibleRecipes.map((recipe, index) => (
                        <div
                            key={recipe ? recipe.id : `placeholder-${index}`}
                            className={`carousel-card ${index === 1 ? 'active' : ''} ${!recipe ? 'placeholder' : ''}`}
                        >
                            {recipe && <img src={recipe.imageUrl} alt={recipe.title} />}
                        </div>
                    ))}
                </div>
                <button onClick={handleNext} className="carousel-arrow next-arrow" aria-label="Next Recipe">
                    b
                </button>
            </div>

            {activeRecipe && (
                <div className="recipe-details">
                    <h3>{activeRecipe.title}</h3>
                    <p>{activeRecipe.description}</p>
                    <a href={activeRecipe.link} className="discover-link">
                        DISCOVER RECIPE →
                    </a>
                </div>
            )}
        </div>
    );
};

export default RecipeCarousel;