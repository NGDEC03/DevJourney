import React from "react";

export function InputOutputFormat({ inputFormat = "", outputFormat = "" }) {
  // console.log("Received Props - inputFormat:", inputFormat);
  // console.log("Received Props - outputFormat:", outputFormat);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold mb-2 text-xl">Input Format:</h4>
        {inputFormat ? (
          <ul className="list-disc list-inside">
            {inputFormat.split("\n").map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No input format provided.</p>
        )}
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-2 text-xl">Output Format:</h4>
        {outputFormat ? (
          <ul className="list-disc list-inside">
            {outputFormat.split("\n").map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No output format provided.</p>
        )}
      </div>
    </div>
  );
}
