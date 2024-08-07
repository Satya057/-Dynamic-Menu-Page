import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const Menu = ({ addToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    axios.get('https://dummyjson.com/recipes')
      .then(response => {
        setMenuItems(response.data.recipes);
        setFilteredItems(response.data.recipes); // Initially show all items
      })
      .catch(error => {
        console.error('Error fetching the menu items:', error);
      });
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.tags.includes(category)));
    }
  };

  return (
    <div className="menu-container">
      <div className="menu">
        <h2>Customize your lunch according to your taste</h2>
        <div className="menu-categories">
          <div className={`category ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => handleCategoryChange('all')}>All</div>
          <div className={`category ${selectedCategory === 'Pizza' ? 'active' : ''}`} onClick={() => handleCategoryChange('Pizza')}>Pizza</div>
          <div className={`category ${selectedCategory === 'Italian' ? 'active' : ''}`} onClick={() => handleCategoryChange('Italian')}>Italian</div>
        </div>
        <div className="menu-items">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-item">
              <img src={item.image} alt={item.name} className="menu-item-image" />
              <h3>{item.name}</h3>
              <p><strong>Rating:</strong> {item.rating} ({item.reviewCount} reviews)</p>
              <button className="add-to-cart-button" onClick={() => addToCart(item)}>Add</button>
              <div className="recipe-details">
                {/* <h4>Ingredients</h4>
                <ul>
                  {item.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Cart = ({ cartItems, increaseQuantity, decreaseQuantity }) => {
  const groupedItems = cartItems.reduce((acc, item) => {
    const foundItem = acc.find(cartItem => cartItem.id === item.id);
    if (foundItem) {
      foundItem.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="cart">
      <h2>Cart</h2>
      {groupedItems.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <ul>
          {groupedItems.map((item, index) => (
            <li key={index} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <div className="quantity-controls">
                  <button onClick={() => increaseQuantity(item)}>+</button>
                  <button onClick={() => decreaseQuantity(item)}>-</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const increaseQuantity = (item) => {
    setCartItems([...cartItems, item]);
  };

  const decreaseQuantity = (item) => {
    const updatedCartItems = cartItems.reduce((acc, currentItem) => {
      if (currentItem.id === item.id) {
        if (currentItem.quantity > 1) {
          acc.push({ ...currentItem, quantity: currentItem.quantity - 1 });
        }
      } else {
        acc.push(currentItem);
      }
      return acc;
    }, []);
    setCartItems(updatedCartItems);
  };

  return (
    <div className="app">
      <Menu addToCart={addToCart} />
      <Cart cartItems={cartItems} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} />
    </div>
  );
};

export default App;
