const DatePicker = ({ id, options, onChange, value }) => (
  <input
    type="date"
    placeholder={options.placeholder}
    value={value}
    onChange={(e) => onChange(id, e.target.value)}
    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);
export default DatePicker;
