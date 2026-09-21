// The top strip from your sketch: the circle + "user_id".
// It has NO state and NO logic - it just displays whatever userId it is given.
// A component like this is called a "presentational" (or "dumb") component.

function Header({ userId }) {
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    borderBottom: '1px solid #e0e0e0',
  };

  const avatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%', // 50% radius on a square = circle
    border: '2px solid #222',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <header style={headerStyle}>
      <div style={avatarStyle}>👤</div>
      <strong>{userId}</strong>
      {/* marginLeft: 'auto' pushes this to the far right of the flex row */}
      <span style={{ marginLeft: 'auto', color: '#666', fontSize: '14px' }}>🌆 City Spots</span>
    </header>
  );
}

export default Header;
