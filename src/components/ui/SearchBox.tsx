import React, { useState } from "react";

interface SearchBoxProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search pallet(s)..."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-primary placeholder:italic text-sm"
      />
    </div>
  );
};

export default SearchBox;

const styles = {
  'italic-placeholder': {
    fontStyle: 'italic',
  },
};