import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './Search.css';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      toast.info('Please enter a phone number or name', { autoClose: 3000 });
      return;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/search?q=${searchQuery}`);
        setSearchResults(response.data.results);

        if (response.data.results.length === 0) {
          toast.info('No results found', { autoClose: 3000 });
        }
      } catch (error) {
        toast.error('Error occurred while searching', { autoClose: 3000 });
      }
    };

    fetchData();
  }, [searchQuery]);

  return (
    <div className="container-Search mt-5">
      <ToastContainer />
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control-Search"
          placeholder="Search by name or phone number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary-Search" type="button" onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} /> Search
        </button>
      </div>
      {searchResults.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>PHONE</th>
                <th>EMAIL</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <tr key={result._id}>
                  <td>{result.name}</td>
                  <td>{result.phone}</td>
                  <td>{result.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;