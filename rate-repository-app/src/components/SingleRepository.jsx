import { View, StyleSheet, Linking, Pressable, FlatList } from 'react-native';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-native';
import Text from './Text';
import RepositoryItem from './RepositoryItem';
import ReviewItem from './ReviewItem';
import { GET_REPOSITORY_WITH_REVIEWS } from '../graphql/queries';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    margin: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const SingleRepository = () => {
  const { id } = useParams();
  const { data, loading, fetchMore } = useQuery(GET_REPOSITORY_WITH_REVIEWS, {
    variables: { repositoryId: id, first: 3 },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const repository = data?.repository;

  if (!repository) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Repository not found</Text>
      </View>
    );
  }

  const handleOpenInGitHub = async () => {
    await Linking.openURL(repository.url);
  };

  const reviews = repository.reviews?.edges?.map(edge => edge.node) || [];
  const onEndReached = () => {
    if (repository.reviews?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: repository.reviews.pageInfo.endCursor,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={({ item }) => <ReviewItem review={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={() => (
          <>
            <RepositoryItem repository={repository} />
            <Pressable style={styles.button} onPress={handleOpenInGitHub}>
              <Text style={styles.buttonText}>Open in GitHub</Text>
            </Pressable>
          </>
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default SingleRepository;