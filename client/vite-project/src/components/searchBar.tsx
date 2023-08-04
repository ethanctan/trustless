import Select from 'react-select';
import React from 'react';
import { ISearchBar } from '../utils/components.ts';

function SearchBar({defiData, handleSetProtocol} : ISearchBar){
    const [menuIsOpen, setMenuIsOpen] = React.useState(false); //for search dropdown

    return (
        <>
        <Select
            className="mt-4 mb-4 poppins w-1/3 mx-auto"
            options={defiData.map((protocol : any) => ({
                value: protocol.name,
                label: protocol.name,
            }))}
            onInputChange={(input) => {
                if (input) {
                setMenuIsOpen(true);
                } else {
                setMenuIsOpen(false);
                }
            }}
            menuIsOpen={menuIsOpen}

            onChange={(selectedOption) => handleSetProtocol(selectedOption?.value || '')}
            placeholder="Search for a protocol..."
            isSearchable
            styles={{
                control: (provided, state) => ({
                ...provided,
                borderRadius: '4px',
                backgroundColor: 'rgba(25, 35, 65, 0.5)',
                backdropFilter: 'blur(8px)',
                borderColor: 'rgba(25, 35, 65, 0.3)',
                }),
                option: (provided, state) => ({
                ...provided,
                color: 'white',
                backgroundColor: 'rgba(25, 35, 65, 0.3)',
                borderColor: 'rgba(33, 33, 33, 0.3)',
                cursor: 'pointer',
                '&:active': {
                    backgroundColor: '#5c64d3',
                },
                }),
                singleValue: (provided) => ({
                ...provided,
                color: 'white',
                }),
                input: (provided) => ({
                ...provided,
                color: 'white',
                }),
                menu: (provided) => ({
                ...provided,
                backgroundColor: 'rgba(25, 35, 65, 0.3)',
                backdropFilter: 'blur(8px)',
                }),
                menuList: (provided) => ({
                ...provided,
                backgroundColor: 'rgba(25, 35, 65, 0.3)',
                backdropFilter: 'blur(8px)',
                }),
                indicatorSeparator: () => ({
                display: 'none',
                }),
            }}
        />
        </>
    )
}

export default SearchBar;