// The bottom bar from your sketch: Map | Posts/Friends | Add Post | Saved | Acc
// It does NOT own the "which tab is open" state. App owns it and passes it down.

// The tabs are DATA, so we describe them once in an array and let .map() draw the buttons.
// (Same idea as posts.map(...) -> <PostCard />, just for buttons.)
const TABS = [
  { id: 'map', icon: '📍', label: 'Map' },
  { id: 'posts', icon: '📰', label: 'Posts' },
  { id: 'add', icon: '➕', label: 'Add Post' },
  { id: 'saved', icon: '🔖', label: 'Saved' },
  { id: 'account', icon: '👤', label: 'Account' },
];

// activeTab      -> string, the id of the open tab (data flows DOWN)
// onChangeTab    -> function, we call it with a tab id when a button is clicked (events flow UP)
function BottomNav({ activeTab, onChangeTab }) {
  const navStyle = {
    display: 'flex',
    borderTop: '1px solid #ddd',
    backgroundColor: '#fff',
  };

  return (
    <nav style={navStyle}>
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            style={{
              flex: 1, // every button takes an equal share of the width
              padding: '8px 0',
              border: 'none',
              borderTop: isActive ? '3px solid #0070f3' : '3px solid transparent',
              backgroundColor: isActive ? '#eef4ff' : 'transparent',
              fontSize: '11px',
              fontWeight: isActive ? 'bold' : 'normal',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '20px' }}>{tab.icon}</div>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
