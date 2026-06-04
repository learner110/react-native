import { View, StyleSheet } from 'react-native';
import Text from './Text';
import theme from '../theme';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  ratingContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  createdAt: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  reviewText: {
    marginTop: 8,
    color: theme.colors.textPrimary,
  },
});

const ReviewItem = ({ review }) => {
  const formattedDate = format(new Date(review.createdAt), 'dd MMM yyyy');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{review.rating}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{review.user.username}</Text>
          <Text style={styles.createdAt}>{formattedDate}</Text>
        </View>
      </View>
      {review.text && <Text style={styles.reviewText}>{review.text}</Text>}
    </View>
  );
};

export default ReviewItem;