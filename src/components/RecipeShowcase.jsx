import React, { useState, useEffect, useCallback } from 'react'; // <--- FIX IS HERE
import CategoryNav from './CategoryNav';
import RecipeCarousel from './RecipeCarousel';
import { categories, allRecipesData, getDefaultRecipeForCategory } from '../data/recipesData'; // Assuming data structure
import './RecipeShowcase.css';

const RecipeShowcase = () => {
    // Default to a specific category initially or first in list
    const [activeCategory, setActiveCategory] = useState(categories[1] || categories[0]);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
    const recipesToShow = allRecipesData[activeCategory] || [];

    // Effect to update background based on *activeCategory* change
    useEffect(() => {
        const defaultRecipe = getDefaultRecipeForCategory(activeCategory);
        setBackgroundImageUrl(defaultRecipe ? defaultRecipe.imageUrl : '');
    }, [activeCategory]); // Update BG when category state changes

    // --- Handler passed to CategoryNav ---
    // This is called by CategoryNav AFTER scroll debounce/center detection
    // Now useCallback is correctly imported and can be used
    const handleCategorySelect = useCallback((newCategory) => {
        // console.log("Setting active category from showcase:", newCategory);
        setActiveCategory(newCategory);
    }, []); // Empty dependency array - function identity is stable


    // Background logic for carousel interaction (if still needed)
    const handleActiveRecipeChange = (activeRecipe) => {
        if (activeRecipe && activeRecipe.imageUrl) {
            setBackgroundImageUrl(activeRecipe.imageUrl);
        }
         else {
             const defaultRecipe = getDefaultRecipeForCategory(activeCategory);
             setBackgroundImageUrl(defaultRecipe ? defaultRecipe.imageUrl : '');
         }
    };

    const showcaseStyle = {
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
        backgroundColor: !backgroundImageUrl ? '#1a1a1a' : 'transparent',
    };

    return (
        <div className="recipe-showcase" style={showcaseStyle}>
            <div className="recipe-showcase-content">
                <CategoryNav
                    categories={categories}
                    activeCategory={activeCategory} // Pass current state
                    onCategorySelect={handleCategorySelect} // Pass the update handler
                />
                <RecipeCarousel
                    key={activeCategory} // Reset carousel on category change
                    recipes={recipesToShow}
                    onActiveRecipeChange={handleActiveRecipeChange} // For background change on carousel nav
                />
                {/* Footer text etc. */}
                 <div className="footer-text">Red Hot Chili Peppers</div>
            </div>
        </div>
    );
};

export default RecipeShowcase;