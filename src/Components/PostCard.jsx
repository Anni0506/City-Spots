import { useState } from 'react';

// CHANGED: PostCard used to keep likes and comments in its OWN useState.
// Problem: switching tabs removes the card from the screen, and React throws away a component's
// state when that happens => all likes/comments would vanish. So that data now lives in the post
// (owned by App), and PostCard only DISPLAYS it and CALLS functions (onLike, ...) to change it.
//
// Props:
//   post          -> the data to show
//   isSaved       -> true/false, is this post in the saved list?
//   onLike(id)    -> ask App to add a like
//   onAddComment(id, text)
//   onToggleSave(id)
function PostCard({ post, isSaved, onLike, onAddComment, onToggleSave }) {
  // Only UI-only state stays here: nobody else cares whether THIS card's comments box is open
  // or what half-typed text is in its input.
  // (Renamed to the usual convention: camelCase, and setX for the setter.)
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const cardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  };

  const tagStyle = {
    display: 'inline-block',
    padding: '4px 10px', // FIXED: was '20px 10px', which made the tag super tall
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#fff',
    backgroundColor: post.category === 'lowkey' ? '#2e7d32' : '#d32f2f',
  };

  // A small style object reused by the three action buttons
  const actionButtonStyle = {
    padding: '6px 10px',
    borderRadius: '7px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const handleSubmitComment = (e) => {
    e.preventDefault(); // same trick as in AddPostForm: don't reload the page

    const cleaned = commentText.trim(); // trim() removes spaces at both ends
    if (!cleaned) return; // ignore empty / spaces-only comments

    onAddComment(post.id, cleaned); // hand the comment UP to App
    setCommentText(''); // clear the input (this one is our own UI state)
  };

  return (
    <div style={cardStyle}>
      <img
        src={post.imageUrl}
        alt={post.spotName}
        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
      />

      <div style={{ padding: '16px' }}>
        <span style={tagStyle}>
          {post.category === 'lowkey' ? '🔒 Lowkey Gem' : '🔥 Popular Spot'}
        </span>

        <h3 style={{ margin: '10px 0 2px 0' }}>{post.spotName}</h3>
        <span style={{ color: '#888', fontSize: '12px' }}>@{post.author}</span>

        <p style={{ margin: '8px 0 12px 0', color: '#555', fontSize: '14px' }}>{post.caption}</p>

        {/* Action row: like | comments | save */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onLike(post.id)}
            style={{ ...actionButtonStyle, backgroundColor: '#f30020', color: '#fff', borderColor: '#000' }}
          >
            ❤️ {post.likes}
          </button>

          {/* Toggle: flip true <-> false with the opposite value */}
          <button onClick={() => setShowComments(!showComments)} style={actionButtonStyle}>
            💬 {post.comments.length}
          </button>

          <button onClick={() => onToggleSave(post.id)} style={actionButtonStyle}>
            {isSaved ? '🔖 Saved' : '🔖 Save'}
          </button>
        </div>

        {showComments && (
          <div style={{ border: '1px solid #ddd', padding: '10px', marginTop: '12px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Comments</h4>

            {post.comments.length === 0 && <p style={{ color: '#888', margin: '0 0 8px 0' }}>Be the first to comment.</p>}

            {/* key={index} is OK here because comments are only ever added at the end and never
                reordered or deleted. If you add "delete comment", give each comment an id instead. */}
            {post.comments.map((comment, index) => (
              <p key={index} style={{ margin: '0 0 6px 0' }}>
                {comment}
              </p>
            ))}

            {/* A <form> lets the Enter key submit too, just like your AddPostForm */}
            <form onSubmit={handleSubmitComment} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input
                type="text"
                placeholder="Enter comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <button type="submit" style={actionButtonStyle}>
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;
