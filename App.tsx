import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity, Image } from 'react-native';
import { Product } from "./interfaces";
import axios, { AxiosResponse } from "axios"
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { createStackNavigator, StackNavigationProp, } from "@react-navigation/stack";



type listItemProps = {
  item: Product,
  navigation: StackNavigationProp<StackParams, 'ProductList'>
}

type StackParams = {
  ProductList: undefined,
  ProductScreen: { id: number, title: string, image: string, description: string, category: string, price: number }
}

type FlatListScreenProps = {
  navigation: StackNavigationProp<StackParams, 'ProductList'>
}

type ProductsScreenProps = {
  navigation: StackNavigationProp<StackParams, 'ProductScreen'>
  route: RouteProp<StackParams, 'ProductScreen'>
}

//The screen their all my products are added
const ProductListScreen = ({ navigation }: FlatListScreenProps) => {
  const [userData, setUserData] = useState<Product[]>([]);
  console.clear();
  console.log('response', userData);

  //Api Call by using "axios"
  useEffect(() => {
    axios
      .get<Product[]>('https://fakestoreapi.com/products/')
      .then((response: AxiosResponse) => {
        setUserData(response.data);
      })
  }, []);

  //Flatlist whit all products
  return (
    <View>
      <FlatList
        data={userData}
        renderItem={({ item }) => (
          <TouchableOpacity
          onPress= {() => {
              setUserData(userData)
              console.log(item.title);
            }}>
            <ItemCard
              item={item}
              navigation={navigation}
            />      
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

//The screen how display pressed product
const ProductScreen = ({ route }: ProductsScreenProps) => {
  return (
    <View style={styles.containerProductInfo}>
      <Image style={styles.imageViewProductInfo} source={{ uri: route.params.image }} />
      <Text style= {styles.headlineProductInfo}>{route.params.title}</Text>
      <Text style={{...styles.priceProductInfo,
                ...DiscountColor(route.params.price) ? styles.textTrue : styles.textFalse}}>{DiscountPrice(route.params.price).toFixed(2)} €</Text>
      <Text style={styles.headlineProductInfo}>Description</Text>
      <Text style={styles.descriptionProductInfo}>{route.params.description}</Text>
      <Text style={styles.categoryProductInfo}>Category: {route.params.category}</Text>
      <TouchableOpacity
          onPress= {() => {
              console.log("item is added");
            }}>
          <Text style= {styles.addToCartButton}>Add to cart</Text>
          </TouchableOpacity>
    </View>
  );
};

//App//Navigatoin function
export default function App() {
  const Stack = createStackNavigator<StackParams>();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='ProductList'>
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{
            title: 'ProductList',
          }}
        />
        <Stack.Screen
          name="ProductScreen"
          component={ProductScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


//Select color for discount product if the price is over 50 €
function DiscountColor(productPrice: number ): boolean {
  if (productPrice > 50) {
    return false 
  } 
  else {
    return true
  }
}

//Select color for discount product if the price is over 50 €
function discountColordd(productPrice: number, color: String ) {
  if (productPrice > 50) {
      color='green'
  } 
  else {
    return true
  }
}


//Count price for discount product if the price is over 50 €
function DiscountPrice(productPrice: number ): number {
 if (productPrice > 50) {
    productPrice /= 1.25
    return productPrice 
  } 
  else {
    return productPrice
  }
}


//design and functionallity for my Product card
const ItemCard = ({ item, navigation }: listItemProps) => {

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductScreen', {
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        description: item.description,
        price:item.price
      })} >
     
      <View style={styles.mainViewCard}>
        <View style={styles.cardContainer}>
          <Image style={styles.imageViewCard} source={{ uri: item.image }} />
          <View>
          <Text style={styles.textCard}>{item.title}</Text>
          <Text style={{...styles.textCard,
                ...DiscountColor(item.price) ? styles.textTrue : styles.textFalse}}>
                {DiscountPrice(item.price).toFixed(2)} €
            </Text>
            
        </View>
        </View>
      </View>
      
    </TouchableOpacity>

  );
}


const styles = StyleSheet.create({

  //Styles  for my productListScreen
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTrue: {
    color:'black'
  },
  textFalse:  {
    color:'green'
  },
  cardContainer: {
    padding: 20,  
    borderRadius: 10,
    flexDirection: 'row',
   
  },
  mainViewCard: {
    padding: 10,
    width: '80%'
  },
  imageViewCard: {
    height: 100,
    width: 100
  },
  textCard: {
    fontWeight: 'bold',
    padding: 10
  },
  

  //styles for my productScreen

  containerProductInfo: {
    flex: 1,
    marginTop:20,
  },

  imageViewProductInfo: {
    height: 300,
    alignItems: 'center',
    alignSelf:'center',
    width: 300
  },
  headlineProductInfo: {
    fontWeight: 'bold',
    marginLeft:20,  
    marginTop:20,
    fontSize:20
  },
  priceProductInfo: {
    marginLeft:20,
    marginTop:20,
    fontSize:18,
    color:'green'
  },
  descriptionHeaderProductInfo: {
    marginLeft:20,
    fontSize:14,
    fontWeight: 'bold',
  },
  descriptionProductInfo: {
    padding: 20,
    fontSize:14,
  },
  categoryProductInfo: {
    marginLeft:20,
    fontSize:14,
    color:'grey'
  },
  addToCartButton: {
    marginTop:40,
    backgroundColor:'white',
    padding:10,
    width:200,
    textAlign:'center',
    alignItems: 'center',
    alignSelf:'center',
    color:'black',
    borderRadius:10,
    borderWidth: 3,
    borderColor: 'black'
  }

});
