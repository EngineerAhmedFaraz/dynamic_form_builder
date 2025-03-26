import { useState } from "react";

const PhoneNumber = ({ id, options, onChange, value }) => {
  const [countryCode, setCountryCode] = useState("US");
  const handlePhoneChange = (e) => {
    const phone = `${options.countryCodes[countryCode]}${e.target.value}`;
    onChange(id, phone);
  };

  return (
    <>
      <div className="flex space-x-2">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="p-2 border rounded">
          {Object.entries(options.countryCodes).map(([code, prefix]) => (
            <option key={code} value={code}>
              {prefix}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={value.replace(options.countryCodes[countryCode], "") || ""}
          onChange={handlePhoneChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );
};
export default PhoneNumber;
