import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";

// Data dummy awal
const INITIAL_POSTS = [
  {
    id: '1',
    userName: 'R Clara Angelica Surya',
    avatarUrl: '#',
    timestamp: '2 jam yang lalu',
    postText: 'kemeja untuk outfit ngampus nih',
    postLink: 's.shopee.co.id/AA9HtcEpl5'
  },
  {
    id: '2',
    userName: 'R Clara Angelica Surya',
    avatarUrl: '#',
    timestamp: '2 jam yang lalu',
    postText: 'parfum nya nihh',
    postLink: 's.shopee.co.id/AUm8Ibx36V'
  },
  {
    id: '3',
    userName: 'R Clara Angelica Surya',
    avatarUrl: '#',
    timestamp: '2 jam yang lalu',
    postText: 'nih siapa yang butuh sunscreen',
    postLink: 's.shopee.co.id/2vjqlOCfmo'
  },
  {
    id: '4',
    userName: 'R Clara Angelica Surya',
    avatarUrl: '#',
    timestamp: '2 jam yang lalu',
    postText: 'nih siapa yang butuh sunscreen',
    postLink: 's.shopee.co.id/2vjqlOCfmo'
  },
  {
    id: '5',
    userName: 'R Clara Angelica Surya',
    avatarUrl: '#',
    timestamp: '2 jam yang lalu',
    postText: 'nih siapa yang butuh sunscreen',
    postLink: 's.shopee.co.id/2vjqlOCfmo'
  },
];

const Community = () => {

  // State agar memenuhi syarat: menggunakan state untuk data
  const [posts] = useState(INITIAL_POSTS);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      {/* HEADER */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Komunitas</Text>
      </View>

      {/* LIST POSTINGAN */}
      <ScrollView style={{ paddingHorizontal: 10 }}>
        {posts.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: "#f8f8f8",
              padding: 16,
              marginBottom: 15,
              borderRadius: 10,
              elevation: 1,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.userName}</Text>
            <Text style={{ color: "#777" }}>{item.timestamp}</Text>

            <Text style={{ marginTop: 8 }}>{item.postText}</Text>

            <Text style={{ color: "blue", marginTop: 6 }}>
              {item.postLink}
            </Text>

            <View
              style={{
                borderBottomWidth: 1,
                borderColor: "#ccc",
                marginVertical: 10,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 5,
              }}
            >
              <Text>Suka</Text>
              <Text>Komentar</Text>
              <Text>Bagi</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* TOMBOL POST */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#007bff",
          paddingVertical: 15,
          paddingHorizontal: 22,
          borderRadius: 50,
          elevation: 5,
        }}
        onPress={() => Alert.alert("Masukkan content yang ingin anda post")}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          + Post
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default Community;
