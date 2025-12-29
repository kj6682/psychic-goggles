import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    type: 'Book',
    category: '',
    location: ''
  });

  const fetchItems = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/items?page=${currentPage}&size=5&query=${query}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch items', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, query]);

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ title: '', authors: '', type: 'Book', category: '', location: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem
        ? `http://localhost:8080/api/items/${editingItem.id}`
        : 'http://localhost:8080/api/items';

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        closeModal();
        fetchItems();
      }
    } catch (error) {
      console.error('Failed to save item', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
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

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div className="search-bar">
            <input
              className="form-input"
              placeholder="Search by title..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(0);
              }}
              style={{ width: '300px' }}
            />
          </div>
          <button className="btn-primary" onClick={() => openModal()}>
            + Add New Item
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Authors</th>
                <th>Type</th>
                <th>Category</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500, color: '#f8fafc' }}>{item.title}</td>
                  <td>{item.authors}</td>
                  <td><span className="tag" style={{ color: '#38bdf8' }}>{item.type}</span></td>
                  <td><span className="tag" style={{ color: '#a78bfa' }}>{item.category}</span></td>
                  <td>{item.location}</td>
                  <td>
                    <button onClick={() => openModal(item)} style={{ marginRight: '0.5rem', color: '#38bdf8', background: 'none' }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="btn-danger" style={{ padding: '0.25rem 0.5rem' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage + 1} of {totalPages === 0 ? 1 : totalPages}</span>
          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Title</label>
                <input className="form-input" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Authors</label>
                <input className="form-input" name="authors" value={formData.authors} onChange={handleChange} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Type</label>
                  <select className="form-input" name="type" value={formData.type} onChange={handleChange}>
                    <option value="Book">Book</option>
                    <option value="E-Book">E-Book</option>
                    <option value="Audiobook">Audiobook</option>
                    <option value="Article">Article</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Category</label>
                  <input className="form-input" name="category" value={formData.category} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Location</label>
                <input className="form-input" name="location" value={formData.location} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" onClick={closeModal} className="btn-danger" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
