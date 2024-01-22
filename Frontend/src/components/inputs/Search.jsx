import React from 'react'
import useAxios from '../../hooks/useAxios';
import axios from '../../api/fetchUserStartWith';
import Input from './Input';
import useDebounce from '../../hooks/useDebounce';
import ListUser from '../User/ListUser';

const Search = () => {
    const [searchValue, setSearchValue] = React.useState('');

    const debouncedSearchValue = useDebounce(searchValue, 1000);

    return (
        <>
            <Input inputType='text' inputClassName='py-3 form-control'
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder='Search'
                autoFocus
            />

            <ListUser searchTerm={debouncedSearchValue}></ListUser>


        </>
    )
}

export default Search