import { useEffect, useState } from 'react'

type Item = { id: number; name: string; created_at: string }

export function App() {
  const [items, setItems] = useState<Item[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/items')
      const data = await res.json()
      setItems(data)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function addItem(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed })
    })
    if (res.ok) {
      setName('')
      await load()
    } else {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Failed to add item')
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '2rem auto', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial' }}>
      <h1>Items</h1>
      <form onSubmit={addItem} aria-label="add-item-form" style={{ display: 'flex', gap: 8 }}>
        <input
          aria-label="item-name"
          placeholder="Add item"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Add</button>
      </form>
      {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {items.map((it) => (
            <li key={it.id}>
              <strong>{it.name}</strong>
              <span style={{ color: '#777', marginLeft: 8 }}>({new Date(it.created_at).toLocaleString()})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

