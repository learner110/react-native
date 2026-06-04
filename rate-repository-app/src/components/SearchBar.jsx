import { TextInput, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    padding: 12,
    margin: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 16,
  },
});

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <TextInput
      style={styles.input}
      placeholder="Search repositories..."
      value={searchTerm}
      onChangeText={setSearchTerm}
    />
  );
};

export default SearchBar;