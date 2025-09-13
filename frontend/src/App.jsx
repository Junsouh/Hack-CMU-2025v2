import React, { useEffect, useState } from 'react'
import { listItems, addItem, updateItem, deleteItem } from './api'

function App() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', quantity: 1, unit: 'pcs', calories_per_unit: 0 })

  useEffect(() => { fetchList() }, [])

  function fetchList() {
    listItems().then(setItems).catch(console.error)
  }

  function handleAdd(e) {
    e.preventDefault()
    addItem(form).then(() => { setForm({ name: '', quantity: 1, unit: 'pcs', calories_per_unit: 0 }); fetchList() })
  }

  function handleDelete(id) {
    deleteItem(id).then(fetchList)
  }

  function totalCalories() {
    return items.reduce((s, it) => s + (it.total_calories || 0), 0)
  }

  return (
    <div className="container">
      <h1>Grocery Inventory</h1>
      <div className="grid">
        <div className="card">
          <h2>Add item</h2>
          <form onSubmit={handleAdd} className="form">
            <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input type="number" step="any" placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            <input placeholder="Unit (eg. pcs, g)" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} />
            <input type="number" step="any" placeholder="Calories per unit" value={form.calories_per_unit} onChange={e => setForm({...form, calories_per_unit: e.target.value})} />
            <button type="submit">Add</button>
          </form>
        </div>

        <div className="card">
          <h2>Inventory</h2>
          <div className="list">
            {items.map(it => (
              <div key={it.id} className="row">
                <div>
                  <strong>{it.name}</strong>
                  <div className="muted">{it.quantity} {it.unit} — {it.total_calories} kcal</div>
                </div>
                <div className="actions">
                  <button onClick={() => handleDelete(it.id)}>Delete</button>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="muted">No items yet</div>}
          </div>

          <div className="summary">Total calories: <strong>{totalCalories()}</strong></div>
        </div>
      </div>
    </div>
  )
}

export default App
