import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    type: 'Book',
    category: '',
    location: ''
  });

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/items');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch items', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ title: '', authors: '', type: 'Book', category: '', location: '' });
        fetchItems();
      }
    } catch (error) {
      console.error('Failed to create item', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/items/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Personal Library
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your collection with style</p>
      </header>

      <div className="library-container">

        {/* Form Section */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Add New Item</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Title</label>
              <input
                className="form-input"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. The Hobbit"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Authors</label>
              <input
                className="form-input"
                name="authors"
                value={formData.authors}
                onChange={handleChange}
                placeholder="e.g. J.R.R. Tolkien"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Type</label>
                <select
                  className="form-input"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Book">Book</option>
                  <option value="E-Book">E-Book</option>
                  <option value="Audiobook">Audiobook</option>
                  <option value="Article">Article</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Category</label>
                <input
                  className="form-input"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Fantasy"
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Location</label>
              <input
                className="form-input"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Shelf A, Row 2"
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
              Add to Library
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="items-list">
          <h2 style={{ marginBottom: '1.5rem' }}>Collection ({items.length})</h2>
          <div className="items-grid">
            {items.map((item) => (
              <div key={item.id} className="glass-panel item-card">
                <div>
                  <div className="item-title">{item.title}</div>
                  <div style={{ color: '#fff', fontWeight: 500 }}>{item.authors}</div>
                </div>
                <div style={{ margin: '0.5rem 0' }}>
                  <span className="tag" style={{ color: '#38bdf8' }}>{item.type}</span>
                  <span className="tag" style={{ color: '#a78bfa' }}>{item.category}</span>
                </div>
                <div className="item-meta">
                  <span>📍 {item.location}</span>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleDelete(item.id)} className="btn-danger">
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                No items found. Start adding some!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
