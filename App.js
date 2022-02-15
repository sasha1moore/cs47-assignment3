import { Pressable, StyleSheet, Text, View, SafeAreaView, Image, FlatList } from "react-native";
import { useState, useEffect } from "react";
import Images from "./Themes/images";
import { AccessTokenRequest, ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors"
import { logToConsole } from "react-native/Libraries/Utilities/RCTLog";
import millisToMinutesAndSeconds from "./utils/millisToMinuteSeconds";
import { TouchableWithoutFeedback } from "react-native-web";
//import { Themes } from "../cs47-a2-starter/assets/Themes";

// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};

//looks like this is where you are styling -- custom component
const Song = ({imageURL, title, artist, album, duration, index}) => {
  return (
    <View style = {{flex: 1, flexDirection: "row"}}>
      <View style = {{width: 19, alignItems: "center", justifyContent: "center"}}>
        <Text style={{color: 'white'}}>{index+1}</Text>
      </View>
      <View>
        <Image source = {{uri: imageURL}} style = {styles.songImg} />
      </View>
      <View style = {{width: 150, flexDirection: "column", justifyContent:"center", alignItems: "left", marginRight: 5}}>
        <Text numberOfLines={1} style={{color: 'white', fontWeight: "bold"}}>{title} </Text>
        <Text style={{color: 'white'}}>{artist}</Text>
      </View>
      <View style = {{width: 110, justifyContent:"center", alignItems: "left"}}>
        <Text numberOfLines={1} style={{color: 'white', fontWeight: "bold"}}>{album}</Text>
      </View>
      <View style = {{justifyContent:"center", alignItems: "right"}}>
        <Text style={{color: 'white', marginRight: 5}}>{duration}</Text>
      </View>
    </View>
  );
};

//style = {{flex: 1}}


export default function App() {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  //console.log('\n', tracks[0]);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    const fetchTracks = async () => {
      // TODO: Comment out which one you don't want to use
      // myTopTracks or albumTracks

      const res = await myTopTracks(token);
      // const res = await albumTracks(ALBUM_ID, token);
      setTracks(res);
    };

    if (token) {
      // Authenticated, make API request
      fetchTracks();
    }
  }, [token]);


// this is where you have view and specify what the list looks like
  const renderItem = ({item, index}) => {
    return <Song 
    //song index on list
    //should be in their own view row direction
    index = {index}
    title = {item.name}
    artist = {item.album.artists[0].name}
    album = {item.album.name}
    imageURL = {item.album.images[0].url}
    duration = {millisToMinutesAndSeconds(item.duration_ms)}
    //should be in their own view column direction
      //title
      //artist
    //Album
    //duraction use millisToMinuteSeconds func

   />

 }

  if(token) {
    contentDisplayed = 
    //add in Mytoptracks
    //react fragment, a view box without the view component. 
    <> 
    <View style = {{flexDirection: "row", alignItems: "center"}}>
      <Image source={Images.spotify} style={styles.logo}/>
      <Text style = {styles.title}> My Top Tracks </Text>
    </View>
    <FlatList
      data={tracks} // the array of data that the FlatList displays
      renderItem={(item, index) => renderItem(item, index)} // function that renders each item
      keyExtractor={(item) => item.id} // unique key for each item
    />
    </>
    } else {
      contentDisplayed = 
      <Pressable onPress={promptAsync} style={styles.button}>
        <Image source={Images.spotify} style={styles.logo}/>
        <Text style = {{color: 'white', marginRight: 10}}>CONNECT WITH SPOTIFY</Text>
      </Pressable>

    }

  return (
    <SafeAreaView style={styles.container}>
      {contentDisplayed}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.spotify,
    borderRadius: 99999
  },
  songImg: {
    margin: 5,
    flex: 1,
    height: 60,
    width: 60,
    backgroundColor: "blue"
  },
  logo: {
    height: 24,
    width: 24,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: 'bold'
  }
});
