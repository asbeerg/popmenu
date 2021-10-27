import * as React from 'react';
import { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
   flex: 1
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default function MenusScreen({ navigation }) {
  const MENU_PATH = 'http://127.0.0.1:8000/api/menus';
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch(MENU_PATH)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);

  if (error) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Error: {error.message}</Text>
    </View>;
  } else if (!isLoaded) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading...</Text>
    </View>;
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={({item}) => (
            <ListItem key={item.id} bottomDivider onPress={() => {
                navigation.navigate({
                  name: 'Menu Items',
                  params: {menuId: item.id},
                  merge: true, 
                })
              }} >
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}
