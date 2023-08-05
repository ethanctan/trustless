import { ISubmissionTable } from "../utils/components";

function SubmissionTable({headings, submissions, RowGenerator} : ISubmissionTable){
    return (
        <div className="w-fit border rounded-lg overflow-hidden bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md border-gray-700">
          <table className="divide-y divide-gray-200 divide-gray-700 table-auto">
          <thead>
              <tr>
              {headings.map((heading : string) => (
                  <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                      {heading}
                  </th>
              ))}
              </tr>
          </thead>
            <tbody className="divide-y divide-gray-200 divide-gray-700 font-mono">
              {submissions.map(RowGenerator)}
            </tbody>
          </table>
          {submissions.length === 0 && (
            <p className="p-6 py-4 whitespace-nowrap text-sm font-medium text-white poppins">No entries found. Submit a rating!</p>
          )}
        </div>
    )
}



export {SubmissionTable}