import React, { useEffect, useState } from 'react'
import { listItems, addItem, updateItem, deleteItem } from './api'

function App() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', quantity: 1, unit: 'pcs', calories_per_unit: 0 })
  const [activeFilter, setActiveFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => { fetchList() }, [])

  function fetchList() {
    listItems().then(setItems).catch(console.error)
  }

  function handleAdd(e) {
    e.preventDefault()
    addItem(form).then(() => { 
      setForm({ name: '', quantity: 1, unit: 'pcs', calories_per_unit: 0 })
      setShowAddModal(false)
      fetchList() 
    })
  }

  function handleDelete(id) {
    deleteItem(id).then(fetchList)
  }

  function totalCalories() {
    return items.reduce((s, it) => s + (it.total_calories || 0), 0)
  }

  function getItemStatus(item) {
    // Mock status based on item data - in real app this would be based on expiration dates
    const days = Math.floor(Math.random() * 10) + 1
    if (days <= 1) return { status: 'expired', days, color: '#FF6B6B' }
    if (days <= 3) return { status: 'expiring', days, color: '#FFA726' }
    if (days <= 5) return { status: 'soon', days, color: '#FFB74D' }
    return { status: 'fresh', days, color: '#4CAF50' }
  }

  function getFoodIcon(name) {
    const icons = {
      'milk': '🥛',
      'yogurt': '🥛',
      'cheese': '🧀',
      'egg': '🥚',
      'butter': '🧈',
      'lettuce': '🥬',
      'spinach': '🥬',
      'broccoli': '🥦',
      'carrot': '🥕',
      'tomato': '🍅',
      'cucumber': '🥒',
      'pepper': '🫑',
      'apple': '🍎',
      'banana': '🍌',
      'strawberry': '🍓',
      'grapes': '🍇',
      'orange': '🍊',
      'lemon': '🍋',
      'chicken': '🍗',
      'fish': '🐟',
      'shrimp': '🦐',
      'tofu': '⬜', 
      'bread': '🍞',
      'juice': '🧃',
      'water': '💧',
    }
    const lowerName = name.toLowerCase()
    for (const [key, icon] of Object.entries(icons)) {
      if (lowerName.includes(key)) return icon
    }
    return '🥘'
  }

  const filteredItems = items.filter(item => {
    if (activeFilter === 'all') return true
    const status = getItemStatus(item)
    return status.status === activeFilter
  })

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">FA</div>
            <div className="logo-text">
              <h1>Fridge Assistant</h1>
              <p className="tagline">Track leftovers • Reduce waste</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="notification-icon">🔔</div>
          <div className="profile-pic">👤</div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="dashboard">
        <div className="dashboard-left">
          <div className="greeting">
            <h2>Hello, Sarah</h2>
          </div>
          
          <div className="search-bar">
            <div className="search-icon">🔍</div>
            <input type="text" placeholder="Search items in your fridge..." />
          </div>

          <div className="status-filters">
            <button 
              className={`filter-btn ${activeFilter === 'fresh' ? 'active' : ''}`}
              onClick={() => setActiveFilter('fresh')}
            >
              Fresh
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'soon' ? 'active' : ''}`}
              onClick={() => setActiveFilter('soon')}
            >
              Soon
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'expiring' ? 'active' : ''}`}
              onClick={() => setActiveFilter('expiring')}
            >
              Expiring Today
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'expired' ? 'active' : ''}`}
              onClick={() => setActiveFilter('expired')}
            >
              Expired
            </button>
          </div>

          <div className="fridge-illustration">
            <div className="illustration">👩‍🍳🧊</div>
          </div>
        </div>

        <div className="dashboard-right">
          <div className="card expiring-card">
            <div className="card-header">
              <div className="warning-icon">⚠️</div>
              <div className="card-content">
                <h3>3 items</h3>
                <p>expiring soon</p>
              </div>
            </div>
            <button className="add-btn">Add to Fridge</button>
          </div>

          <div className="card expired-card">
            <h3>Recently Expired</h3>
            <div className="expired-list">
              <div className="expired-item">
                <span className="food-icon">🥦</span>
                <span className="item-name">Broccoli</span>
                <span className="days">4 days ago</span>
              </div>
              <div className="expired-item">
                <span className="food-icon">🥛</span>
                <span className="item-name">Yogurt</span>
                <span className="days">7 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fridge Items Section */}
      <section className="fridge-section">
        <div className="section-header">
          <h2>Fridge Items</h2>
          <button className="add-item-btn" onClick={() => setShowAddModal(true)}>
            + Add Item
          </button>
        </div>

        <div className="items-list">
          {filteredItems.map(item => {
            const status = getItemStatus(item)
            return (
              <div key={item.id} className="item-row">
                <div className="item-info">
                  <span className="food-icon">{getFoodIcon(item.name)}</span>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{item.quantity} {item.unit} — {item.total_calories} kcal</p>
                  </div>
                </div>
                <div className="item-actions">
                  <span className={`status-badge ${status.status}`} style={{backgroundColor: status.color}}>
                    {status.days} days
                  </span>
                  <button className="delete-btn" onClick={() => handleDelete(item.id)}>×</button>
                </div>
              </div>
            )
          })}
          {filteredItems.length === 0 && (
            <div className="empty-state">
              <p>No items found</p>
            </div>
          )}
        </div>

        <div className="summary-card">
          <h3>Total calories: <strong>{totalCalories()}</strong></h3>
        </div>
      </section>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add item</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleAdd} className="add-form">
              <input 
                placeholder="Item name" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
              />
              <input 
                type="number" 
                step="any" 
                placeholder="Quantity" 
                value={form.quantity} 
                onChange={e => setForm({...form, quantity: e.target.value})} 
              />
              <input 
                placeholder="Unit (eg. pcs, g)" 
                value={form.unit} 
                onChange={e => setForm({...form, unit: e.target.value})} 
              />
              <input 
                type="number" 
                step="any" 
                placeholder="Calories per unit" 
                value={form.calories_per_unit} 
                onChange={e => setForm({...form, calories_per_unit: e.target.value})} 
              />
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save to Fridge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
