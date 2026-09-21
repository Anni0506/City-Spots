import { useState } from 'react';
import { getCurrentLocation } from '../utils/getCurrentLocation';

// This form component receives "onAddPost" as a prop function from App.jsx
// NEW props: `author` (who is posting) and `fallbackPosition` (used if location lookup fails)
function AddPostForm({ onAddPost, author, fallbackPosition }) {
  //1.AddPostForm
  //  │
  //  ├── spotName
  //  ├── category
  //  ├── imageUrl
  //  ├── caption
  //  └── position   <- NEW: [lat, lng] once the user has pressed the location button
  const [spotName, setSpotName] = useState('');
  const [category, setCategory] = useState('lowkey');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [position, setPosition] = useState(null); // null = "not chosen yet"
  const [locationMessage, setLocationMessage] = useState(''); // small status text under the button

  //---------------------NEW: location button-----------------

  const handleUseMyLocation = () => {
    setLocationMessage('Finding you...');

    getCurrentLocation(
      (coords) => {
        setPosition(coords);
        setLocationMessage('📍 Location set!');
      },
      (message) => {
        // Don't block the user if location fails: use the map's current center instead
        setPosition(fallbackPosition);
        setLocationMessage(`${message} Using the map's current center instead.`);
      }
    );
  };

  //---------------------2. Handle form submission-----------------

  const handleSubmit = (e) => {
    // e.preventDefault() stops the browser from refreshing the entire web page on submit
    e.preventDefault();

    // Basic validation: ensure required fields are not empty
    if (!spotName || !imageUrl || !caption) {
      alert('Please fill out all fields!');
      return;
    }

    // NEW: a post without a location can't be shown on the map
    if (!position) {
      alert('Please tap "Use my current location" first!');
      return;
    }

    // Create a brand-new post JSobject with a unique random ID
    const newPost = {
      id: crypto.randomUUID(),
      author, // NEW (shorthand for author: author)
      spotName: spotName, //this creates an object and fills values from above variables
      category, // same as category: category,  {Property Shorthand}
      imageUrl: imageUrl,
      caption: caption,
      position, // NEW
      likes: 0, // NEW: every post starts with 0 likes...
      comments: [], // NEW: ...and an empty comments list
    };

    // Pass the new post back up to App.jsx
    onAddPost(newPost);

    // Reset form inputs back to blank after sending the info to App.jsx
    setSpotName('');
    setCategory('lowkey');
    setImageUrl('');
    setCaption('');
    setPosition(null);
    setLocationMessage('');
  };

  //------------------------------------------------------------------

  const formStyle = {
    border: '1px solid #ddd',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px',
    backgroundColor: '#fafafa',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    marginBottom: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={{ marginTop: 0, marginBottom: '12px' }}>➕ Share a New Spot</h3>

      {/* Spot Name Input */}
      <input
        type="text"
        placeholder="Spot Name (e.g., Hidden Bakery)"
        //Whatever is currently inside this input should be whatever is stored in spotName
        value={spotName}
        //Whenever the user changes what is inside this input, run this function.
        onChange={(e) => setSpotName(e.target.value)} //e is event object
        style={inputStyle}
      />

      {/* Category Dropdown */}
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
        <option value="lowkey">🔒 Lowkey Gem</option>
        <option value="popular">🔥 Popular Spot</option>
      </select>

      {/* Image URL Input */}
      <input
        type="text"
        placeholder="Image URL (e.g., https://...)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={inputStyle}
      />

      {/* Caption Input */}
      <textarea
        placeholder="Write a brief caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows="3"
        style={{ ...inputStyle, resize: 'vertical' }}
      />

      {/* NEW: Location button.
          type="button" is IMPORTANT: a <button> inside a <form> is "submit" by default,
          so without this the location button would also try to submit the form! */}
      <button
        type="button"
        onClick={handleUseMyLocation}
        style={{ ...inputStyle, cursor: 'pointer', backgroundColor: '#fff' }}
      >
        📍 Use my current location
      </button>
      {locationMessage && (
        <p style={{ margin: '-4px 0 12px 0', fontSize: '13px', color: '#555' }}>{locationMessage}</p>
      )}

      <button
        //type="submit" automatically fires the <form>
        // element's onSubmit event when clicked—or when a user presses
        // Enter while inside any text input!
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Post Spot
      </button>
    </form>
  );
}

export default AddPostForm;
