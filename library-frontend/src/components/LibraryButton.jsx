function LibraryButton({ buttonLabel, actionButton }) {
  return (
    <button type="button" onClick={actionButton}>
      {buttonLabel}
    </button>
  )
}

export default LibraryButton
