import { useState } from 'react';
import PostCard from './PostCard';

// This is the "list + filter buttons" part that used to live inside App.jsx.
// It is used TWICE: once for the Posts tab, once for the Saved tab (same component, different props).

// Filters described as data, so we don't copy-paste the same <button> three times
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'lowkey', label: '🔒 Lowkey Gems' },
  { id: 'popular', label: '🔥 Popular Spots' },
];

// `showFilters = true` is a DEFAULT VALUE: if the parent doesn't pass showFilters, it is true
function PostsFeed({
  title,
  posts,
  savedIds,
  onLike,
  onAddComment,
  onToggleSave,
  showFilters = true,
  emptyMessage,
}) {
  // The filter is only a UI detail of THIS screen. Nobody else needs it,
  // so it stays here instead of in App (keep state as low as possible).
  const [filter, setFilter] = useState('all');

  const displayedPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    return post.category === filter;
  });

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      {showFilters && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: filter === f.id ? 'bold' : 'normal',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* "Empty state": tell the user what to do instead of showing a blank screen */}
      {displayedPosts.length === 0 && <p style={{ color: '#666' }}>{emptyMessage}</p>}

      {displayedPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isSaved={savedIds.includes(post.id)}
          onLike={onLike}
          onAddComment={onAddComment}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}

export default PostsFeed;
