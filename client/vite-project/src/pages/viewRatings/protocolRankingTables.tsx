import {SubmissionTable} from '../../components/submissionTable.tsx';
import { useState, useEffect } from 'react';
import { GetProtocolResponse } from '../../utils/interfaces.ts'
import Axios from 'axios';
import { CountdownTimer } from '../../components/timer.tsx';


export default function ProtocolRankingTables(){

    enum ActiveButton {
        MostTrusted,
        LeastTrusted,
      }
    
    const [activeButton, setActiveButton] = useState<ActiveButton | null>(null);
    const [protocolData, setProtocolData] = useState<GetProtocolResponse[]>([]);
    const [protocolDataTop, setProtocolDataTop] = useState<GetProtocolResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState(''); // for searching submissions
    const protocolTableHeadings = ["PROTOCOL",	"NUMBER OF RATINGS", "AVERAGE SCORE"]
  
    const ascendingSortedProtocol = protocolDataTop.filter((protocol) =>
      protocol.protocolName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function listProtocols(protocol : any, rowIndex : number){
        return listProtocol({protocol, rowIndex})
    }
    
    
      //@ts-ignore
      function listProtocol({protocol, rowIndex}){
        return (
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
                TRUST ratings:
            </h3>
            <div className="poppins text-lg pb-1 rounded-b-lg duration-300 px-10">
                View the community's trust ratings below. 
            </div>
            <div className="poppins flex max-w-lg mx-auto items-center space-x-6">
                <button className={`toggle-button flex-1 bg-blue-700 hover:bg-blue-600 hover:border-white focus:outline-none mb-3 mt-3 px-4 py-2 hover:border-white focus:outline-none rounded-lg cursor-pointer ${activeButton === ActiveButton.MostTrusted ? 'active ring ring-slate-400' : ''}`} 
                onClick={() => handleButtonClick(ActiveButton.MostTrusted)}>
                Most Trusted
                </button>
                <button className={`toggle-button flex-1 bg-blue-700 hover:bg-blue-600 hover:border-white focus:outline-none mb-3 mt-3 px-4 py-2 hover:border-white focus:outline-none rounded-lg cursor-pointer ${activeButton === ActiveButton.LeastTrusted ? 'active ring ring-slate-400' : ''}`} 
                onClick={() => handleButtonClick(ActiveButton.LeastTrusted)}>
                Least Trusted
                </button>
            </div>

            <div className="p-4">
                <input
                type="text"
                placeholder="Search protocol..."
                className="poppins w-50 rounded-lg p-2 border bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md border-gray-800 hover:border-white focus:outline-none transition-all duration-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

        <div className="flex flex-col -m-1.5 overflow-x-auto p-1.5 min-w-full inline-block align-middle">

            {activeButton === ActiveButton.MostTrusted && (
                <SubmissionTable headings={protocolTableHeadings} 
                submissions={ascendingSortedProtocol.slice(0, 10)}
                RowGenerator={listProtocols}/>
            )}
            {activeButton === ActiveButton.LeastTrusted && (
                <SubmissionTable headings={protocolTableHeadings} 
                submissions={descendingSortedProtocol.slice(0, 10)}
                RowGenerator={listProtocols}/>
            )}
            </div>
        </div>
    )
}