function toInputDateFormat(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';
  return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
}

function toDisplayDateFormat(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';
  return `${parts[1]}-${parts[2]}-${parts[0]}`;
}

function DateFieldInput({ label, value, onChange, disabled }) {
  return (
    <div className="mb-6">
      <label
        htmlFor="date-input"
        className="block mb-2 text-lg font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {label}
      </label>
      <input
        id="date-input"
        type="date"
        value={toInputDateFormat(value)}
        disabled={disabled}
        placeholder="MM/DD/YYYY"
        onChange={e => onChange(toDisplayDateFormat(e.target.value))}
        className="custom-input form-input"
        style={{ boxShadow: disabled ? 'none' : undefined }}
      />
    </div>
  );
}


export default DateFieldInput;
