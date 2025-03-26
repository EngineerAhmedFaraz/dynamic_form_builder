const DisplayData = ({ data }) => {
  return (
    <>
      <div className="p-4 max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Submitted Data</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </>
  );
};

export default DisplayData;
