import { useState } from 'react';
import { FlatList, View, StyleSheet, Text, Pressable } from 'react-native';
import { useNavigate } from 'react-router-native';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';
import SortingMenu from './SortingMenu';
import SearchBar from './SearchBar';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

export const RepositoryListContainer = ({ repositories, onEndReached, onPressItem }) => {
  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  if (!repositories) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <Pressable onPress={() => onPressItem(item.id)}>
          <RepositoryItem repository={item} />
        </Pressable>
      )}
      keyExtractor={(item) => item.id}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

const RepositoryList = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('latest');
  const [searchKeyword, setSearchKeyword] = useState('');

  const getSortVariables = (sort) => {
    switch (sort) {
      case 'highest':
        return { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
      case 'lowest':
        return { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
      default:
        return { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
    }
  };

  const { repositories, fetchMore } = useRepositories({
    first: 8,
    ...getSortVariables(sortBy),
    searchKeyword: searchKeyword || undefined,
  });

  const onPressItem = (id) => {
    navigate(`/repository/${id}`);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchBar onSearch={handleSearch} />
      <SortingMenu selectedSort={sortBy} onSortChange={handleSortChange} />
      <RepositoryListContainer
        repositories={repositories}
        onEndReached={fetchMore}
        onPressItem={onPressItem}
      />
    </View>
  );
};

export default RepositoryList;