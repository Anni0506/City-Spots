import { useState, useEffect } from 'react';
import Header from './Components/Header';
import BottomNav from './Components/BottomNav';
import MapView from './Components/MapView';
import PostsFeed from './Components/PostsFeed';
import AddPostForm from './Components/AddPostForm';
import AccountView from './Components/AccountView';
import { getCurrentLocation } from './utils/getCurrentLocation';


// ---------- Constants (things that never change while the app runs) ----------
// No login system yet, so we pretend this is the logged-in user (your "user_id" from the sketch)
const CURRENT_USER = 'user_id';

// [latitude, longitude]. The dummy posts below sit around this point.
// Change these numbers to your own city if you want the map to open there!
const DEFAULT_CENTER = [28.6139, 77.209];

// Dummy data. NEW: every post now also has position, author, likes and comments.
// likes/comments moved OUT of PostCard and INTO the post itself (see EXPLANATION.md -> "lifting state up")
const INITIAL_POSTS = [
  {
    id: '1',
    author: 'ria',
    spotName: 'Quiet Rooftop Library Cafe',
    category: 'lowkey',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600',
    caption: 'Super peaceful spot for studying on weekdays with affordable coffee.',
    position: [28.6129, 77.2295],
    likes: 0,
    comments: [],
  },
  {
    id: '2',
    author: 'sam',
    spotName: 'Central City Plaza',
    category: 'popular',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600',
    caption: 'Always packed on weekends! Great street food vendors around.',
    position: [28.6139, 77.209],
    likes: 0,
    comments: [],
  },
  {
    id: '3',
    author: 'ria',
    spotName: 'Sunset Point',
    category: 'lowkey',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    caption: 'Almost nobody comes here. Go 30 minutes before sunset.',
    position: [28.628, 77.219],
    likes: 0,
    comments: [],
  },
];

function App() {
  // ---------- STATE: everything that changes and that more than one component needs ----------
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'posts' | 'add' | 'saved' | 'account'
  const [savedIds, setSavedIds] = useState([]); // only the IDs of saved posts, not copies of posts
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER); // where the map should look
  const [userLocation, setUserLocation] = useState(null); // the blue "you are here" dot (null = unknown)

  useEffect(() => {
     getCurrentLocation(
       (coords) => {
         setUserLocation(coords);
         setMapCenter(coords);
       },
       () => {} // denied or unavailable: ignore
     );
   }, []);

  // ---------- HANDLERS: the only functions allowed to change the state above ----------
  // Children receive these as props and CALL them; they never touch the state directly.

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
    setMapCenter(newPost.position); // make the map look at the new pin
    setActiveTab('map'); // and jump to the map so you can see it
  };

  // .map() builds a NEW array. For the post we want, we return a NEW object with likes + 1.
  // All other posts are returned untouched. (React needs new arrays/objects to notice a change!)
  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  // Answer to the question in your old code: put the NEW comment at the END of the list
  // => [...post.comments, text]   (your old version [text, ...comments] put it at the start)
  const handleAddComment = (postId, text) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, text] } : post
      )
    );
  };

  // If the id is already saved -> remove it (filter keeps everything EXCEPT that id). Otherwise add it.
  const handleToggleSave = (postId) => {
    if (savedIds.includes(postId)) {
      setSavedIds(savedIds.filter((id) => id !== postId));
    } else {
      setSavedIds([...savedIds, postId]);
    }
  };

  const handleLocateMe = () => {
    getCurrentLocation(
      (coords) => {
        setUserLocation(coords);
        setMapCenter(coords);
      },
      (message) => alert(message)
    );
  };

  // ---------- DERIVED DATA: calculated from state each render, so it is NOT stored in state ----------
  const savedPosts = posts.filter((post) => savedIds.includes(post.id));
  const myPostCount = posts.filter((post) => post.author === CURRENT_USER).length;

  // ---------- LAYOUT ----------
  const shellStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column', // header on top, content in the middle, nav at the bottom
  };

  const mainStyle = {
    flex: 1, // take all the leftover height
    position: 'relative', // so the map can be positioned inside it
    overflowY: 'auto', // long pages (feed) scroll inside here, header/nav stay put
  };

  return (
    <div style={shellStyle}>
      <Header userId={CURRENT_USER} />

      <main style={mainStyle}>
        {/* Conditional rendering: `condition && <Thing />` shows Thing only when condition is true */}
        {activeTab === 'map' && (
          <MapView
            posts={posts}
            center={mapCenter}
            userLocation={userLocation}
            onLocateMe={handleLocateMe}
          />
        )}

        {activeTab === 'posts' && (
          <PostsFeed
            title="Posts from friends"
            posts={posts}
            savedIds={savedIds}
            onLike={handleLike}
            onAddComment={handleAddComment}
            onToggleSave={handleToggleSave}
            showFilters={true}
            emptyMessage="No posts yet."
          />
        )}

        {activeTab === 'add' && (
          <div style={{ padding: '16px' }}>
            <AddPostForm
              onAddPost={handleAddPost}
              author={CURRENT_USER}
              fallbackPosition={mapCenter}
            />
          </div>
        )}

        {activeTab === 'saved' && (
          <PostsFeed
            title="Saved spots"
            posts={savedPosts}
            savedIds={savedIds}
            onLike={handleLike}
            onAddComment={handleAddComment}
            onToggleSave={handleToggleSave}
            showFilters={false}
            emptyMessage="Nothing saved yet. Tap 🔖 on a post to keep it here."
          />
        )}

        {activeTab === 'account' && (
          <AccountView
            userId={CURRENT_USER}
            postCount={myPostCount}
            savedCount={savedIds.length}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}

export default App;
