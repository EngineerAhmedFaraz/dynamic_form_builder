const RadioButton = ({ id, options, onChange, value }) => (
  <div className="flex space-x-4">
    {options.options.map((opt) => (
      <label key={opt} className="flex items-center">
        <input
          type="radio"
          name={`radio_${id}`}
          value={opt}
          checked={value === opt}
          onChange={(e) => onChange(id, e.target.value)}
          className="mr-2"
        />
        {opt}
      </label>
    ))}
  </div>
);
export default RadioButton;
