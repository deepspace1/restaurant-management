import React from 'react';
import RecipeShowcase from './components/RecipeShowcase';
import './App.css'; // Your main CSS file

function App() {
  return (
    <div className="App">
      {/* You could have a Header/Navbar component above */}
      {/* <Header /> */}

      <main>
        <RecipeShowcase />
      </main>

      {/* You could have a Footer component below */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;