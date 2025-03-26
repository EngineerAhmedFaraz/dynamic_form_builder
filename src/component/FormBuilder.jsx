import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TextField from "./FieldTypes/TextField";
import Dropdown from "./FieldTypes/DropDown";
import RadioButton from "./FieldTypes/RadioButton";
import FileUpload from "./FieldTypes/FileUpload";
import Checkbox from "./FieldTypes/Checkbox";
import Country from "./FieldTypes/Country";
import DatePicker from "./FieldTypes/DatePicker";
import PhoneNumber from "./FieldTypes/PhoneNumber";
import fieldConfig from "../utils/formData.json";

const fieldTypes = {
  text: TextField,
  dropdown: Dropdown,
  radio: RadioButton,
  file: FileUpload,
  checkbox: Checkbox,
  country: Country,
  date: DatePicker,
  phone: PhoneNumber,
};

const defaultOptions = {
  label: "Unnamed Field",
  placeholder: "",
  options: [],
  acceptedTypes: "*",
  countries: [],
  countryCodes: {},
};

const FormBuilder = ({ fields, setFields }) => {
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [selectedDropdownValues, setSelectedDropdownValues] = useState(
    new Set()
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({});
    setSubmittedData({});
    setSelectedDropdownValues(new Set());
    setErrors({});
  }, [fields.length]);

  const getFieldOptions = (type) => {
    return fieldConfig.fieldOptions[type] || defaultOptions;
  };

  const validateField = (label, value, fieldType, options = {}) => {
    let error = null;

    switch (fieldType) {
      case "":
        error = `Please select a field type for ${label}!`;
        break;

      case "text":
        if (!value || value.trim() === "") {
          error = `${label} cannot be empty!`;
        } else if (value !== value.trim()) {
          error = `${label} cannot have leading or trailing whitespace!`;
        } else if (value.trim().length < 2) {
          error = `${label} must be at least 2 characters long!`;
        } else if (value.trim().length > 50) {
          error = `${label} cannot be longer than 50 characters!`;
        }
        break;

      case "dropdown":
        if (!value || value === "Select an option") {
          error = `Please select a ${label}!`;
        }
        break;

      case "radio":
        if (!value) {
          error = `Please select an option for ${label}!`;
        }
        break;

      case "file":
        if (!value || value === "No file chosen") {
          error = `Please upload a file for ${label}!`;
        } else if (options.acceptedTypes && options.acceptedTypes !== "*") {
          const acceptedTypes = options.acceptedTypes
            .split(",")
            .map((type) => type.trim().toLowerCase());
          const fileExtension = value.name.split(".").pop().toLowerCase();
          if (!acceptedTypes.includes(`.${fileExtension}`)) {
            error = `${label} must be one of the following types: ${options.acceptedTypes}!`;
          }
        }
        break;

      case "checkbox":
        break;

      case "country":
        if (!value || value === "Select Country") {
          error = `Please select a ${label}!`;
        }
        break;

      case "date":
        if (!value) {
          error = `Please select a ${label}!`;
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          error = `${label} must be in YYYY-MM-DD format!`;
        }
        break;

      case "phone":
        if (!value || value.trim() === "") {
          error = `${label} cannot be empty!`;
        } else if (value !== value.trim()) {
          error = `${label} cannot have leading or trailing whitespace!`;
        } else if (!/^\+\d{1,3}\d{10}$/.test(value.replace(/\s/g, ""))) {
          error = `${label} must be a valid phone number (e.g., +123456789012)!`;
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (label, value, fieldType, options) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }));

    if (fieldType === "dropdown") {
      setSelectedDropdownValues((prev) => {
        const newSet = new Set(prev);
        if (value) newSet.add(value);
        else newSet.delete(formData[label]);
        return newSet;
      });
    }

    const error = validateField(label, value, fieldType, options);
    setErrors((prev) => ({
      ...prev,
      [label]: error,
    }));

    if (error) {
      toast.error(error);
    }
  };

  const handleTypeChange = (id, newType, isTopLevel = false) => {
    const updateField = (fieldList, targetId = id, isRoot = isTopLevel) =>
      fieldList.map((field) => {
        if (field.id === targetId) {
          const newOptions = getFieldOptions(newType);
          if (isRoot) {
            return {
              ...field,
              type: newType,
              label: newOptions.label,
              options: newOptions,
              children: field.children.filter(
                (child) => child.type !== newType && child.type !== ""
              ),
            };
          } else {
            const changedIndex = fieldList.findIndex((f) => f.id === targetId);
            return {
              ...field,
              type: newType,
              label: newOptions.label,
              options: newOptions,
              children: field.children.filter(
                (child, childIndex) =>
                  childIndex <= changedIndex || child.type !== newType
              ),
            };
          }
        }
        if (field.children.length > 0) {
          return {
            ...field,
            children: updateField(field.children, targetId, false),
          };
        }
        return field;
      });

    setFields((prev) => updateField(prev, id, isTopLevel));
  };

  const addNestedField = (parentId) => {
    const findParentField = (fieldList, id) =>
      fieldList.find((field) => field.id === id) ||
      fieldList
        .flatMap((field) => findParentField(field.children, id))
        .filter(Boolean)[0];

    const parentField = findParentField(fields, parentId);
    const parentType = parentField ? parentField.type : null;

    const usedTypes = new Set();
    if (parentType) usedTypes.add(parentType);

    const newField = {
      id: Date.now(),
      type: "",
      label: "Nested Field",
      children: [],
      options: {},
      excludedTypes: [...usedTypes],
    };

    const updateField = (fieldList) =>
      fieldList.map((field) => {
        if (field.id === parentId) {
          return { ...field, children: [newField] };
        }
        if (field.children.length > 0) {
          return { ...field, children: updateField(field.children) };
        }
        return field;
      });

    setFields((prev) => updateField(prev));
  };

  const countAllFields = (fieldList) => {
    return fieldList.reduce((count, field) => {
      return (
        count +
        1 +
        (field.children.length > 0 ? countAllFields(field.children) : 0)
      );
    }, 0);
  };

  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;

    const validateFieldRecursive = (fieldList) => {
      fieldList.forEach((field) => {
        if (field.type === "") {
          const error = `Please select a field type for ${field.label}!`;
          newErrors[field.label] = error;
          isValid = false;
        } else {
          const value = formData[field.label] || "";
          const error = validateField(
            field.label,
            value,
            field.type,
            field.options
          );
          if (error) {
            newErrors[field.label] = error;
            isValid = false;
          }
        }
        if (field.children.length > 0) {
          validateFieldRecursive(field.children);
        }
      });
    };

    validateFieldRecursive(fields);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    const totalFields = countAllFields(fields);
    if (totalFields === 0) {
      toast.error("No fields to submit!");
      return;
    }

    const isValid = validateAllFields();
    if (!isValid) {
      Object.values(errors).forEach((error) => {
        if (error) toast.error(error);
      });
      return;
    }

    setSubmittedData(formData);
    toast.success("Form submitted successfully!");
  };

  const renderField = (field, parentValue = null, isTopLevel = false) => {
    const FieldComponent = fieldTypes[field.type];
    const fieldOptions = field.options || getFieldOptions(field.type);

    const filteredOptions =
      field.type === "dropdown"
        ? {
            ...fieldOptions,
            options: fieldOptions.options.filter(
              (option) => option !== parentValue
            ),
          }
        : fieldOptions;

    const excludedTypes =
      field.excludedTypes || (field.excludedType ? [field.excludedType] : []);
    const availableFieldTypes = Object.keys(fieldTypes).filter(
      (type) => !excludedTypes.includes(type)
    );

    return (
      <div key={field.id} className="mt-4 w-full">
        <div className="flex flex-col space-y-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <div className="flex items-start space-x-4 w-full">
            <div className="flex justify-center items-center gap-3">
              <div className="w-80">
                {field.type && FieldComponent ? (
                  <FieldComponent
                    id={field.id}
                    options={filteredOptions}
                    onChange={(id, value) =>
                      handleChange(field.label, value, field.type, fieldOptions)
                    }
                    value={formData[field.label] || ""}
                  />
                ) : (
                  <p className="text-gray-500">Please select a field type</p>
                )}
              </div>
              <select
                value={field.type}
                onChange={(e) =>
                  handleTypeChange(field.id, e.target.value, isTopLevel)
                }
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-32">
                <option value="" disabled hidden></option>
                {availableFieldTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {isTopLevel && (
                <button
                  onClick={() => addNestedField(field.id)}
                  className="px-2 py-[.7rem] bg-gray-300 rounded hover:bg-gray-400 text-sm whitespace-nowrap">
                  Add Nested
                </button>
              )}
            </div>
          </div>
          {errors[field.label] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.label]}</p>
          )}
        </div>
        {field.children.length > 0 && (
          <div className="mt-2 w-full">
            {field.children.map((child) =>
              renderField(child, formData[field.label], false)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-4 w-full max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Form Builder</h1>
      <div className="space-y-2 w-full">
        {fields.length > 0 ? (
          fields.map((field) => renderField(field, null, true))
        ) : (
          <p className="text-gray-500">No fields added yet.</p>
        )}
      </div>
      {fields.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Submit Form
        </button>
      )}
      <div className="mt-8 w-full">
        <h2 className="text-xl font-semibold mb-4">Submitted Data</h2>
        <pre className="bg-gray-100 p-4 rounded w-full overflow-x-auto">
          {JSON.stringify(submittedData || {}, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FormBuilder;
