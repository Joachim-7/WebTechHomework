function ClinicButton({ children, disabled = false }) {
  return (
    <button className="submit-button" type="submit" disabled={disabled}>
      {children}
    </button>
  )
}

export default ClinicButton
