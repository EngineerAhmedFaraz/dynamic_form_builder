const FileUpload = ({ id, options, onChange }) => (
  <input
    type="file"
    accept={options.acceptedTypes}
    onChange={(e) => onChange(id, e.target.files[0]?.name || "")}
    className="w-full p-2 border rounded"
  />
);
export default FileUpload;
