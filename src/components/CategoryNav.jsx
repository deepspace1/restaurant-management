import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CategoryNav.css';

const CategoryNav = ({ categories, activeCategory, onCategorySelect }) => {
    const navRef = useRef(null);
    const [activeItemStyle, setActiveItemStyle] = useState({ left: 0, width: 0, opacity: 0 });

    // Duplicate categories for infinite scrolling
    const duplicatedCategories = [...categories, ...categories];

    // Function to measure and set active indicator/mask style
    const measureAndSetStyle = useCallback(() => {
        if (navRef.current && activeCategory) {
            const activeItemElement = navRef.current.querySelector(
                `.category-item[data-category="${activeCategory}"]`
            );

            if (activeItemElement) {
                const { offsetLeft, offsetWidth, offsetParent } = activeItemElement;
                const parentWidth = offsetParent.offsetWidth;

                const totalWidth = duplicatedCategories.length * offsetWidth;
                const centerOffset = (totalWidth - parentWidth) / 2;
                const activeOffset = offsetLeft - centerOffset;

                setActiveItemStyle({
                    left: activeOffset,
                    width: parentWidth,
                    opacity: 1, // Make visible
                });

                // Apply partial opacity to adjacent items
                const prevItem = activeItemElement.previousElementSibling;
                const nextItem = activeItemElement.nextElementSibling;

                if (prevItem) {
                    prevItem.classList.add('partial');
                } else {
                    prevItem?.classList.remove('partial');
                }

                if (nextItem) {
                    nextItem.classList.add('partial');
                } else {
                    nextItem?.classList.remove('partial');
                }
            } else {
                setActiveItemStyle(prev => ({ ...prev, opacity: 0 }));
            }
        } else {
            setActiveItemStyle(prev => ({ ...prev, opacity: 0 }));
        }
    }, [activeCategory]);

    // Effect to update style when activeCategory changes or on resize
    useEffect(() => {
        const rafId = requestAnimationFrame(measureAndSetStyle);

        window.addEventListener('resize', measureAndSetStyle);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', measureAndSetStyle);
        };
    }, [activeCategory, categories, measureAndSetStyle]);

    // Infinite scroll logic
    useEffect(() => {
        const container = navRef.current;

        if (!container) return;

        const handleScroll = () => {
            const maxScroll = container.scrollWidth / 2; // Halfway point of duplicated categories

            // If scrolled past the halfway point, reset to the equivalent position in the first half
            if (container.scrollLeft >= maxScroll) {
                container.scrollLeft -= maxScroll;
            } else if (container.scrollLeft < 0) {
                container.scrollLeft += maxScroll;
            }
        };

        container.addEventListener('scroll', handleScroll);

        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [categories]);

    const dynamicStyle = {
        left: `${activeItemStyle.left}px`,
        width: `${activeItemStyle.width}px`,
        opacity: activeItemStyle.opacity,
    };

    return (
        <nav ref={navRef} className="category-nav scrollable-nav fading-nav">
            {/* Render duplicated categories */}
            {duplicatedCategories.map((category, index) => (
                <span
                    key={`${category}-${index}`}
                    className={`category-item ${category === activeCategory ? 'active' : ''}`}
                    onClick={() => onCategorySelect(category)}
                    data-category={category}
                >
                    {category}
                </span>
            ))}

            {/* Background line */}
            <span className="nav-ruler-line"></span>

            {/* Mask element */}
            <span className="nav-mask" style={dynamicStyle}></span>

            {/* Indicator element */}
            <span className="nav-indicator" style={dynamicStyle}></span>
        </nav>
    );
};

export default CategoryNav;