import { View, FlatList, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-native';
import Text from './Text';
import { GET_ME } from '../graphql/queries';
import { DELETE_REVIEW } from '../graphql/mutations';
import { format } from 'date-fns';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.mainBackground,
  },
  reviewItem: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  repositoryName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  rating: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  createdAt: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  reviewText: {
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  viewButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const UserReviews = () => {
  const navigate = useNavigate();
  const { data, loading, refetch } = useQuery(GET_ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network',
  });
  const [deleteReview] = useMutation(DELETE_REVIEW);

  if (loading) return <Text>Loading...</Text>;
  if (!data?.me) return <Text>Please sign in</Text>;

  const reviews = data.me.reviews?.edges?.map(edge => edge.node) || [];

  const handleViewRepository = (repositoryId) => {
    navigate(`/repository/${repositoryId}`);
  };

  const performDelete = async (reviewId) => {
    try {
      await deleteReview({ variables: { id: reviewId } });
      await refetch();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message || 'Deletion failed');
    }
  };

  const handleDelete = (reviewId) => {
    if (Platform.OS === 'web') {
      performDelete(reviewId);
    } else {
      Alert.alert(
        'Delete review',
        'Are you sure you want to delete this review?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => performDelete(reviewId) },
        ]
      );
    }
  };

  const renderReview = ({ item }) => {
    const formattedDate = format(new Date(item.createdAt), 'dd MMM yyyy');

    return (
      <View style={styles.reviewItem}>
        <View style={styles.header}>
          <Text style={styles.repositoryName}>{item.repository.fullName}</Text>
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.createdAt}>{formattedDate}</Text>
        {item.text && <Text style={styles.reviewText}>{item.text}</Text>}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.viewButton]}
            onPress={() => handleViewRepository(item.repository.id)}
          >
            <Text style={styles.buttonText}>View repository</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.buttonText}>Delete review</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={<Text>No reviews yet</Text>}
      />
    </View>
  );
};

export default UserReviews;