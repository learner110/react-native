import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  picker: {
    color: theme.colors.textPrimary,
  },
});

const SortingMenu = ({ selectedSort, onSortChange }) => {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedSort}
        onValueChange={(itemValue) => onSortChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Latest repositories" value="latest" />
        <Picker.Item label="Highest rated" value="highest" />
        <Picker.Item label="Lowest rated" value="lowest" />
      </Picker>
    </View>
  );
};

export default SortingMenu;