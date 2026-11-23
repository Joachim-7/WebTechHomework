import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8082'

function Offices() {
  const [offices, setOffices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    let active = true

    async function loadOffices() {
      try {
        const response = await axios.get(`${API_URL}/api/offices`)
        if (active) setOffices(response.data)
      } catch (error) {
        if (active) {
          setMessage({
            type: 'error',
            text: error.response?.data?.message || 'Offices could not be loaded.',
          })
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadOffices()
    return () => {
      active = false
    }
  }, [])

  async function deleteOffice(id) {
    try {
      await axios.delete(`${API_URL}/api/offices/${encodeURIComponent(id)}`)
      setOffices((currentOffices) =>
        currentOffices.filter((office) => office.id !== id),
      )
      setMessage({ type: 'success', text: 'Office deleted successfully.' })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Office could not be deleted.',
      })
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredOffices = offices.filter((office) => {
    if (!normalizedSearch) return true

    return (
      office.name.toLowerCase().includes(normalizedSearch) ||
      String(office.officeNumber).includes(normalizedSearch)
    )
  })

  return (
    <section className="offices-page">
      <h1 className="section-title">Available Offices</h1>

      <div className="office-search">
        <label htmlFor="officeSearch">Search:</label>
        <input
          id="officeSearch"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name or number"
        />
      </div>

      {message.text && (
        <p className={`save-status ${message.type}`} role="status">
          {message.text}
        </p>
      )}

      {loading ? (
        <p className="office-empty">Loading offices...</p>
      ) : (
        <table className="offices-table">
          <thead>
            <tr>
              <th>Office Name</th>
              <th>Office Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffices.length > 0 ? (
              filteredOffices.map((office) => (
                <tr key={office.id}>
                  <td>{office.name}</td>
                  <td>{office.officeNumber}</td>
                  <td className="office-actions">
                    <button
                      className="table-button update-button"
                      type="button"
                      disabled
                    >
                      Update
                    </button>
                    <button
                      className="table-button delete-button"
                      type="button"
                      onClick={() => deleteOffice(office.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="office-empty" colSpan="3">
                  No offices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default Offices
