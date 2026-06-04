import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link, useNavigate } from 'react-router-native';
import { useQuery, useApolloClient } from '@apollo/client';
import Constants from 'expo-constants';
import Text from './Text';
import theme from '../theme';
import { GET_ME } from '../graphql/queries';
import useAuthStorage from '../hooks/useAuthStorage';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBarBackground,
  },
  scrollView: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

const AppBar = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const navigate = useNavigate();
  const { data } = useQuery(GET_ME);

  const handleSignOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
    navigate('/');
  };

  const isSignedIn = data?.me;

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.scrollView}>
        <Link to="/" component={Pressable} style={styles.tab}>
          <Text style={styles.tabText}>Repositories</Text>
        </Link>
        {isSignedIn ? (
          <>
            <Link to="/create-review" component={Pressable} style={styles.tab}>
              <Text style={styles.tabText}>Create a review</Text>
            </Link>
            <Link to="/my-reviews" component={Pressable} style={styles.tab}>
              <Text style={styles.tabText}>My reviews</Text>
            </Link>
            <Pressable onPress={handleSignOut} style={styles.tab}>
              <Text style={styles.tabText}>Sign out</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Link to="/signin" component={Pressable} style={styles.tab}>
              <Text style={styles.tabText}>Sign in</Text>
            </Link>
            <Link to="/signup" component={Pressable} style={styles.tab}>
              <Text style={styles.tabText}>Sign up</Text>
            </Link>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;