const Country = ({ id, options, onChange, value }) => (
  <select
    value={value}
    onChange={(e) => onChange(id, e.target.value)}
    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
    <option value="">Select a country</option>
    {options.countries.map((country) => (
      <option key={country.code} value={country.name}>
        {country.name}
      </option>
    ))}
  </select>
);
export default Country;
