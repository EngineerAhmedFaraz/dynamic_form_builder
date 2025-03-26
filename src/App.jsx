import { useState } from "react";
import FormBuilder from "./component/FormBuilder";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fieldConfig from "./utils/formData.json";

function App() {
  const [isAddingField, setIsAddingField] = useState(false);
  const [fields, setFields] = useState([]);

  const handleAddField = (type) => {
    if (!type) {
      setFields([]);
      return;
    }

    const options = fieldConfig.fieldOptions[type] || {
      label: "Unnamed Field",
    };
    setFields([
      {
        id: Date.now(),
        type,
        label: options.label,
        children: [],
        options: options,
      },
    ]);
    setIsAddingField(false);
  };

  const toggleAddField = () => {
    if (!isAddingField) {
      handleAddField(null);
    }
    setIsAddingField(!isAddingField);
  };

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col items-center py-8">
      <div className="relative">
        <button
          onClick={toggleAddField}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Add Field
        </button>
        {isAddingField && (
          <div className="absolute mt-2 bg-white border rounded shadow-md p-2 z-10">
            {[
              "text",
              "dropdown",
              "radio",
              "file",
              "checkbox",
              "country",
              "date",
              "phone",
            ].map((type) => (
              <button
                key={type}
                onClick={() => handleAddField(type)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
      <FormBuilder fields={fields} setFields={setFields} />
      <ToastContainer />
    </div>
  );
}

export default App;
