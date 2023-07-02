


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
function SubmissionTable({headings, submissions, RowGenerator}){
    console.log("\n\n\nSubmissions: ", submissions)
    return (
        <div className="border rounded-lg overflow-hidden bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 divide-gray-700">

                  <TableHeading headings={headings}/>
                  <tbody className="divide-y divide-gray-200 divide-gray-700">
                    {submissions.slice(0, 10).map((protocol : any, rowIndex : number) => (

                      <RowGenerator protocol={protocol} rowIndex={rowIndex}/>
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