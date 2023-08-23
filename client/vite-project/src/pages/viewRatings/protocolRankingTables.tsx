import {SubmissionTable} from '../../components/submissionTable.tsx';
import { useState, useEffect } from 'react';
import { GetProtocolResponse } from '../../utils/interfaces.ts'
import Axios from 'axios';

export default function ProtocolRankingTables(){

    enum ActiveButton {
        MostTrusted,
        LeastTrusted,
      }
    
    const [activeButton, setActiveButton] = useState<ActiveButton | null>(null);
    const [protocolData, setProtocolData] = useState<GetProtocolResponse[]>([]);
    const [protocolDataTop, setProtocolDataTop] = useState<GetProtocolResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState(''); // for searching submissions
    const protocolTableHeadings = ["PROTOCOL",	"NUM. OF RATINGS", "AVERAGE SCORE"]
  
    const ascendingSortedProtocol = protocolDataTop.filter((protocol) =>
      protocol.protocolName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function listProtocols(protocol : any){
        return listProtocol({protocol})
    }
    
    
      //@ts-ignore
      function listProtocol({protocol}){
        return (
            <tr
                key={protocol._id}
                className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md"
                style={{ marginBottom: '10px', height: '50px' }}
            >
            <td className="p-6 py-4 whitespace-nowrap text-sm font-medium text-white font-mono">
                {protocol.protocolName}
            </td>
            <td className="p-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                {protocol.disputeCount}
            </td>
            <td className="p-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                {protocol.averageScore.toFixed(1)}
            </td>
            </tr>
        )
    }

    useEffect(() => {
        Axios.get<GetProtocolResponse[]>('http://localhost:3001/protocols?order=ascending').then((response) => {
          setProtocolData(response.data);
        });
        Axios.get<GetProtocolResponse[]>('http://localhost:3001/protocols?order=descending').then((response) => {
          setProtocolDataTop(response.data);
        });
        
      }, []);
    

    const handleButtonClick = (button: ActiveButton) => {
        setActiveButton(button);
    };

    const descendingSortedProtocol = protocolData.filter((protocol) =>
    protocol.protocolName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h3 className="unbounded text-3xl my-5">
                TRUSTLESS protocol ratings
            </h3>
            <div className="poppins text-lg pb-1 rounded-b-lg duration-300 px-10">
                View the community's consensus on the most and least trustworthy protocols in crypto.
            </div>
            <div className="poppins flex flex-row max-w-lg mx-auto items-center space-x-6 justify-center p-5">

                <button
                    className={`relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg 
                    group bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-800/40
                    `}
                    onClick={() => handleButtonClick(ActiveButton.MostTrusted)}
                >
                    <span className={`relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md ${activeButton === ActiveButton.MostTrusted ? 'bg-slate-900/0' : 'bg-slate-900 hover:bg-slate-900/50'}`}>
                        Most Trusted
                    </span>
                </button>

                <button
                    className={`relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg 
                    group bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-800/40
                    `}
                    onClick={() => handleButtonClick(ActiveButton.LeastTrusted)}
                >
                    <span className={`relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md ${activeButton === ActiveButton.LeastTrusted ? 'bg-slate-900/0' : 'bg-slate-900 hover:bg-slate-900/50'}`}>
                        Least Trusted
                    </span>
                </button>

            </div>

            <div className="py-4 px-8">
                <input
                type="text"
                placeholder="Search protocol..."
                className="poppins w-96 rounded-md py-2 px-4 border bg-slate-900  border border-transparent focus:outline-none focus:hover:border-2 hover:border-white focus:border-blue-500 transition-all duration-150 ease-in-out"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

        <div className="flex -m-1.5 overflow-x-auto p-1.5 inline-block align-middle justify-center">

            {activeButton === ActiveButton.MostTrusted && (
                <SubmissionTable headings={protocolTableHeadings} 
                submissions={ascendingSortedProtocol.slice(0, 10)}
                RowGenerator={listProtocols}
                />
            )}
            {activeButton === ActiveButton.LeastTrusted && (
                <SubmissionTable headings={protocolTableHeadings} 
                submissions={descendingSortedProtocol.slice(0, 10)}
                RowGenerator={listProtocols}
                />
            )}
            </div>
        </div>
    )
}