import * as React from 'react';
import { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { useIsFocused } from "@react-navigation/native";

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

export default function MenuItemsScreen({ navigation, route  }) {
  const MENU_PATH = "http://127.0.0.1:8000/api/menus/" + route.params.menuId + "/menu-item";
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const isFocused = useIsFocused();

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
          console.log('hete');
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [isFocused]);

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
        <ListItem 
          key={0} 
          bottomDivider
          onPress={() => {
            navigation.navigate({
              name: 'Menu Item',
              params: {menuId: route.params.menuId},
              merge: true, 
            })
          }} 
        >
          <ListItem.Content>
            <ListItem.Title><Text>Add Menu Item</Text></ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <FlatList
          data={items}
          renderItem={({item}) => (
            <ListItem 
              key={item.id} 
              bottomDivider 
              onPress={() => {
                navigation.navigate({
                  name: 'Menu Item',
                  params: {menuId: item.menu_id, menuItemId: item.id},
                  merge: true, 
                })
              }} 
            >
              <ListItem.Content>
                <Avatar 
                  size={150} 
                  source={{uri: item.image}} 
                  overlayContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
                <ListItem.Title>{item.title} - ${item.price}</ListItem.Title>
                <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
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
