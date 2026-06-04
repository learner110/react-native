import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client';
import { Alert } from 'react-native';
import { CREATE_REVIEW } from '../graphql/mutations';
import ReviewForm from './ReviewForm';

const CreateReview = () => {
  const navigate = useNavigate();
  const [createReview, { loading }] = useMutation(CREATE_REVIEW);

  const onSubmit = async (values) => {
    const { ownerName, repositoryName, rating, text } = values;
    const ratingNumber = parseInt(rating, 10);

    try {
      const { data } = await createReview({
        variables: {
          review: {
            ownerName,
            repositoryName,
            rating: ratingNumber,
            text: text || '',
          },
        },
      });

      const repositoryId = data?.createReview?.repositoryId;
      if (repositoryId) {
        navigate(`/repository/${repositoryId}`);
      } else {
        Alert.alert('Error', 'Repository ID not found.');
      }
    } catch (error) {
      Alert.alert(
        'Review creation failed',
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  return <ReviewForm onSubmit={onSubmit} loading={loading} />;
};

export default CreateReview;