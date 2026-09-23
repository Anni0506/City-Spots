import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet'; // the plain Leaflet library, we need it to build custom pin icons
import 'leaflet/dist/leaflet.css'; // REQUIRED: without this the map tiles show up scrambled

const ZOOM = 14; // bigger number = more zoomed in

// ---------- Pin icons ----------
// Leaflet's default pin image often fails to load with Vite, so we draw our own pins
// with a tiny bit of HTML instead. divIcon = "use this HTML as the marker".
// These are created ONCE here (outside the component) so they aren't rebuilt on every render.
const makePinIcon = (emoji, color) =>
  L.divIcon({
    className: '', // removes Leaflet's default white square behind divIcons
    html: `<div style="width:36px;height:36px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;font-size:16px;">${emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18], // which point of the icon sits exactly on the coordinates (its center)
    popupAnchor: [0, -18], // popup opens just above the pin
  });

const pinIcons = {
  lowkey: makePinIcon('🔒', '#2e7d32'),
  popular: makePinIcon('🔥', '#d32f2f'),
};

const youIcon = L.divIcon({
  className: '',
  html: '<div style="width:18px;height:18px;border-radius:50%;background:#1a73e8;border:3px solid #fff;box-shadow:0 0 0 3px rgba(26,115,232,.35);"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// ---------- RecenterMap ----------
// <MapContainer center={...}> only reads `center` ONCE, when the map is first created.
// So when `center` changes later (e.g. you press "Near me"), we have to tell the map manually.
// This component draws nothing (returns null). Its only job is a side effect.
function RecenterMap({ center }) {
  const map = useMap(); // react-leaflet hook: gives us the actual Leaflet map object

  // useEffect(fn, [deps]) = "run fn AFTER rendering, and again whenever something in [deps] changes"
  useEffect(() => {
    map.flyTo(center, ZOOM);
  }, [center, map]);

  return null;
}

// ---------- MapView ----------
function MapView({ posts, center, userLocation, onLocateMe }) {
  const overlayStyle = {
    position: 'absolute',
    top: '12px',
    zIndex: 1000, // Leaflet's own layers use z-index up to ~700, so we must be higher to sit on top
    padding: '8px 12px',
    borderRadius: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,.25)',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  return (
    // position: 'absolute' + inset: 0 = "fill the whole <main> area". A Leaflet map needs a real
    // height to show up, and this is the most reliable way to give it one.
    <div style={{ position: 'absolute', inset: 0, isolation: 'isolate' }}>
      <MapContainer center={center} zoom={ZOOM} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={center} />

        {/* One <Marker> per post: same .map() pattern as before, but the output is a pin */}
        {posts.map((post) => (
          <Marker key={post.id} position={post.position} icon={pinIcons[post.category]}>
            <Popup>
              {/* This is the "Posted ex..." label from your sketch: it opens when you tap a pin */}
              <div style={{ width: '190px' }}>
                <img
                  src={post.imageUrl}
                  alt={post.spotName}
                  style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <strong style={{ display: 'block', marginTop: '6px' }}>{post.spotName}</strong>
                <span style={{ color: '#666', fontSize: '12px' }}>@{post.author}</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>{post.caption}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* userLocation is null until "Near me" works. null && <Marker/> renders nothing. */}
        {userLocation && (
          <Marker position={userLocation} icon={youIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Floating labels on top of the map (the "MAP (Near You)" title in your sketch) */}
      <button onClick={onLocateMe} style={{ ...overlayStyle, right: '12px', border: 'none', cursor: 'pointer' }}>
        📍 Near me
      </button>
    </div>
  );
}

export default MapView;
