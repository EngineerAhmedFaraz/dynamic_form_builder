const Checkbox = ({ id, options, onChange, value }) => (
  <label className="flex items-center">
    <input
      type="checkbox"
      checked={value === "yes"}
      onChange={(e) => onChange(id, e.target.checked ? "yes" : "no")}
      className="mr-2"
    />
    {options.label}
  </label>
);
export default Checkbox;
