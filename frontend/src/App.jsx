import { useState, useEffect } from 'react';
import './index.css';
import { translations } from './translations';

function App() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [language, setLanguage] = useState('en');

  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    type: 'Book',
    category: '',
    location: ''
  });

  const t = (path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], translations[language]) || path;
  };

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
    if (!confirm(t('actions.confirmDelete'))) return;
    try {
      await fetch(`http://localhost:8080/api/items/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item', error);
    }
  };

  return (
    <div className="app">
      <div className="language-switcher">
        <button
          className={`lang-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
        >
          EN
        </button>
        <button
          className={`lang-btn ${language === 'es' ? 'active' : ''}`}
          onClick={() => setLanguage('es')}
        >
          ES
        </button>
      </div>

      <header className="app-header">
        <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('appTitle')}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('appSubtitle')}</p>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div className="search-bar">
            <input
              className="form-input"
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(0);
              }}
              style={{ width: '300px' }}
            />
          </div>
          <button className="btn-primary" onClick={() => openModal()}>
            {t('addBtn')}
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t('table.title')}</th>
                <th>{t('table.authors')}</th>
                <th>{t('table.type')}</th>
                <th>{t('table.category')}</th>
                <th>{t('table.location')}</th>
                <th>{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500, color: '#f8fafc' }}>{item.title}</td>
                  <td>{item.authors}</td>
                  <td><span className="tag" style={{ color: '#38bdf8' }}>{t(`types.${item.type.replace('-', '')}`) || item.type}</span></td>
                  <td><span className="tag" style={{ color: '#a78bfa' }}>{item.category}</span></td>
                  <td>{item.location}</td>
                  <td>
                    <button onClick={() => openModal(item)} style={{ marginRight: '0.5rem', color: '#38bdf8', background: 'none' }}>{t('actions.edit')}</button>
                    <button onClick={() => handleDelete(item.id)} className="btn-danger" style={{ padding: '0.25rem 0.5rem' }}>{t('actions.delete')}</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    {t('table.empty')}
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
            {t('pagination.previous')}
          </button>
          <span>{t('pagination.page')} {currentPage + 1} {t('pagination.of')} {totalPages === 0 ? 1 : totalPages}</span>
          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            {t('pagination.next')}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingItem ? t('modal.editTitle') : t('modal.addTitle')}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('modal.titleLabel')}</label>
                <input
                  className="form-input"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t('modal.placeholderTitle')}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('modal.authorsLabel')}</label>
                <input
                  className="form-input"
                  name="authors"
                  value={formData.authors}
                  onChange={handleChange}
                  placeholder={t('modal.placeholderAuthors')}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('modal.typeLabel')}</label>
                  <select className="form-input" name="type" value={formData.type} onChange={handleChange}>
                    <option value="Book">{t('types.Book')}</option>
                    <option value="E-Book">{t('types.EBook')}</option>
                    <option value="Audiobook">{t('types.Audiobook')}</option>
                    <option value="Article">{t('types.Article')}</option>
                    <option value="Other">{t('types.Other')}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('modal.categoryLabel')}</label>
                  <input
                    className="form-input"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder={t('modal.placeholderCategory')}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('modal.locationLabel')}</label>
                <input
                  className="form-input"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={t('modal.placeholderLocation')}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{t('modal.save')}</button>
                <button type="button" onClick={closeModal} className="btn-danger" style={{ flex: 1 }}>{t('modal.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
