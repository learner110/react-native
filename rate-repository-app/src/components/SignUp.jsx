import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client';
import { Alert } from 'react-native';
import { CREATE_USER } from '../graphql/mutations';
import useSignIn from '../hooks/useSignIn';
import SignUpForm from './SignUpForm';

const SignUp = () => {
  const navigate = useNavigate();
  const [createUser] = useMutation(CREATE_USER);
  const [signIn] = useSignIn();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      const { data } = await createUser({
        variables: {
          user: { username, password },
        },
      });

      console.log('User created:', data);

      const { data: signInData } = await signIn({ username, password });
      console.log('Signed in:', signInData);
      navigate('/');
    } catch (error) {
      console.log('Sign up error:', error);
      Alert.alert(
        'Sign up failed',
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  return <SignUpForm onSubmit={onSubmit} />;
};

export default SignUp;