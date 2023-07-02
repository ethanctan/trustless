


//@ts-ignore
function TableHeading({headings}){
    return(
        <thead>
            <tr>
            {headings.map((heading : string) => (
                <th scope="col" className="p-6 py-3 text-center text-xs font-medium text-white uppercase poppins">
                    {heading}
                </th>
            ))}
            </tr>
        </thead>
    )
}


//@ts-ignore
function SubmissionTable({submissions}){
    const headings = ["Protocol", "Number of Ratings", "Average Score"]
    return (
        <div className="border rounded-lg overflow-hidden bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 divide-gray-700">

                  <TableHeading headings={headings}/>
                  <tbody className="divide-y divide-gray-200 divide-gray-700">
                    {submissions.slice(0, 10).map((protocol : any, rowIndex : number) => (

                      <tr
                        key={protocol._id}
                        className={`${
                          rowIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-600'
                        } bg-opacity-50 backdrop-filter backdrop-blur-md`}
                        style={{ marginBottom: '10px', height: '50px' }}
                      >
                        <td className="p-6 py-4 whitespace-nowrap text-sm font-medium text-white poppins">
                          {protocol.protocolName}
                        </td>
                        <td className="p-6 py-4 whitespace-nowrap text-sm text-white poppins">
                          {protocol.disputeCount}
                        </td>
                        <td className="p-6 py-4 whitespace-nowrap text-sm text-white poppins">
                          {protocol.averageScore.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {submissions.length === 0 && (
                  <p className="p-6 py-4 whitespace-nowrap text-sm font-medium text-white poppins">No protocols found.</p>
                )}
              </div>
    )
}

export {SubmissionTable, TableHeading}