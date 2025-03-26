const Dropdown = ({ id, options, onChange, value }) => (
  <select
    value={value}
    onChange={(e) => onChange(id, e.target.value)}
    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
    <option value="">Select an option</option>
    {options.options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);
export default Dropdown;
