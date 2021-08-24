import React, {
  useLayoutEffect,
  useCallback,
  useState,
  useEffect,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import { auth, db } from "../firebase";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import { GiftedChat } from "react-native-gifted-chat";
import Markdown from "react-native-markdown-display";
import Swipeable from "react-native-gesture-handler/Swipeable";

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);

  //   useEffect(() => {
  //     setMessages([
  //       {
  //         _id: 1,
  //         text: "Hello developer",
  //         createdAt: new Date(),
  //         user: {
  //           _id: 2,
  //           name: "React Native",
  //           avatar: "https://placeimg.com/140/140/any",
  //         },
  //       },
  //     ]);
  //   }, []);

  const LeftActions = () => {
    return (
      <View
        style={{ flex: 1, backgroundColor: "blue", justifyContent: "center" }}
      >
        <Text
          style={{
            color: "white",
            paddingHorizontal: 10,
            fontWeight: "600",
          }}
        >
          Left Action
        </Text>
      </View>
    );
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          }))
        )
      );
    return unsubscribe;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, createdAt, text, user } = messages[0];
    db.collection("chats").add({
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        <View style={{ marginTop: 130, marginLeft: 20 }}>
          <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
        </View>;
      },
      headerRight: () => {
        <TouchableOpacity style={{ marginRight: 30 }} onPress={signOut}>
          <AntDesign name="logout" size={24} color="black" />
        </TouchableOpacity>;
      },
    });
  });

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        //sign out and navigate login
        navigation.replace("Login");
      })
      .catch((err) => console.log(err));
  };
  return (
    <View
      style={{
        marginTop: 1,
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <View
        style={{
          backgroundColor: "violet",
          justifyContent: "center",
          height: 60,
        }}
      >
        <View style={{ marginLeft: 20 }}>
          <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
        </View>
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 20,
          }}
          onPress={signOut}
        >
          <AntDesign name="logout" size={26} color="black" />
        </TouchableOpacity>
      </View>

      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: auth?.currentUser?.email,
          name: auth?.currentUser?.displayName,
          avatar: auth?.currentUser?.photoURL,
        }}
      />
    
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
