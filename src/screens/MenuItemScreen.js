import * as React from 'react';
import { useState, useEffect } from 'react';
import { Alert, Button, View, Text, TextInput, StyleSheet } from 'react-native';

const Section = ({children, title}): Node => {
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[styles.sectionTitle]}>
        {title}
      </Text>
      {children}
    </View>
  );
};

export default function MenuItemsScreen({ navigation, route  }) {
  const MENU_PATH_EDIT = "http://127.0.0.1:8000/api/menus/" + 
    route.params.menuId + "/menu-item/" + route.params.menuItemId;
  const MENU_PATH_ADD = "http://127.0.0.1:8000/api/menus/" + 
    route.params.menuId + "/menu-item";
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [item, setItem] = useState({});
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    if (!route.params.menuItemId) {
      setIsLoaded(true);
      return;
    }
    fetch(MENU_PATH_EDIT)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItem(result);
          setImage(result.image);
          setTitle(result.title);
          setDescription(result.description);
          setPrice(result.price);
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

  onPressSave = () => {
    // POST request using fetch with error handling
    item.title = title;
    item.description = description;
    item.image = image;
    item.price = price;

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    };

    let postRoute = MENU_PATH_ADD
    if (item.id > 0) {
      postRoute = MENU_PATH_EDIT;
    }

    fetch(postRoute, requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
        })
        .catch(error => {
            setError(error);
        })
        .finally(() => {
          let message = 'Success';
          if (error) {
            message = 'Error';
          }
      
          Alert.alert(
            message,
            error ? error.message : 'Changes saved successfully',
            [
              {
                text: "Done",
                onPress: () => {
                  navigation.navigate({
                    name: 'Menu Items',
                    params: {menuId: route.params.menuId},
                    merge: true, 
                  })
                },
                style: "cancel",
              },
            ],
            {
              cancelable: true,
              onDismiss: () => navigation.navigate({
                name: 'Menu Items',
                params: {menuId: route.params.menuId},
                merge: true, 
              }),
            }
          );
        });
    
  }

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
        <Section title="Title">
          <TextInput
            onChangeText={setTitle}
            style={styles.input}
            value={title}
            placeholder="Title"
          />
        </Section>
        <Section title="Description">
          <TextInput
            onChangeText={setDescription}
            style={styles.input}
            value={description}
            placeholder="Description"
          />
        </Section>
        <Section title="Price">
          <TextInput
            onChangeText={setPrice}
            style={styles.input}
            value={price}
            placeholder="Price"
          />
        </Section>
        <Section title="Image Path">
          <TextInput
            onChangeText={setImage}
            style={styles.input}
            value={image}
            placeholder="Image Path"
          />
        </Section>
        <View style={styles.saveButton}>
          <Button
            onPress={onPressSave}
            title="Save"
            color="#841584"
          />
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
   flex: 1
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  input: {
    height: 40,
    margin: 3,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 3,
    fontSize: 18,
    fontWeight: '400',
  },
  saveButton: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '400',
  }
});