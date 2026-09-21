// The "Acc" tab. Nothing is stored here: the counts are CALCULATED in App from `posts` and
// `savedIds` and passed in. (If you also stored them in state you'd have two copies to keep in sync.)

function AccountView({ userId, postCount, savedCount }) {
  const statStyle = {
    flex: 1,
    padding: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    textAlign: 'center',
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            margin: '0 auto 8px auto',
            borderRadius: '50%',
            border: '2px solid #222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
          }}
        >
          👤
        </div>
        <h2 style={{ margin: 0 }}>{userId}</h2>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={statStyle}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{postCount}</div>
          <div style={{ color: '#666', fontSize: '13px' }}>Your post
          </div>
        </div>
        <div style={statStyle}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{savedCount}</div>
          <div style={{ color: '#666', fontSize: '13px' }}>Saved spots</div>
        </div>
      </div>
    </div>
  );
}

export default AccountView;
