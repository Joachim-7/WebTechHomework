import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8082'

function OfficeForm() {
  const [officeName, setOfficeName] = useState('')
  const [officeNumber, setOfficeNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await axios.post(`${API_URL}/api/offices/save`, {
        name: officeName,
        officeNumber: Number.parseInt(officeNumber, 10),
      })

      setMessage({ type: 'success', text: 'Office saved successfully!' })
      setOfficeName('')
      setOfficeNumber('')
    } catch (error) {
      const data = error.response?.data
      const text =
        typeof data === 'string'
          ? data
          : data?.message || 'Error saving office.'
      setMessage({ type: 'error', text })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="office-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <label htmlFor="officeName">Office Name:</label>
        <input
          id="officeName"
          type="text"
          value={officeName}
          placeholder="Enter office name"
          onChange={(event) => setOfficeName(event.target.value)}
          required
        />
      </div>

      <div className="field-row">
        <label htmlFor="officeNumber">Office Number:</label>
        <input
          id="officeNumber"
          type="number"
          value={officeNumber}
          placeholder="Enter office number"
          onChange={(event) => setOfficeNumber(event.target.value)}
          required
        />
      </div>

      <button className="submit-button" type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Office'}
      </button>

      {message.text && (
        <p className={`save-status ${message.type}`} role="status">
          {message.text}
        </p>
      )}
    </form>
  )
}

export default OfficeForm
