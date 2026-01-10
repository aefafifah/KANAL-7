import React, { useEffect, useState } from "react";
import { Alert, Modal } from "react-native";
import {
  Box,
  Text,
  ScrollView,
  VStack,
  HStack,
  Pressable,
  Avatar,
  AvatarFallbackText,
  Input,
  InputField,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { Heart, MessageCircle, Plus } from "lucide-react-native";
import { onValue, off, push, ref, remove, set } from "firebase/database";
import { db } from "../../src/config/firebase";
import { getData } from "../../src/utils/localStorage";

/* ===================== DATA DUMMY ===================== */
const INITIAL_POSTS = [
  {
    id: "1",
    userName: "R Clara Angelica Surya",
    timestamp: "2 jam yang lalu",
    postText: "Kemeja untuk outfit ngampus nih ✨",
    postLink: "s.shopee.co.id/AA9HtcEpl5",
  },
  {
    id: "2",
    userName: "R Clara Angelica Surya",
    timestamp: "2 jam yang lalu",
    postText: "Parfum nya nihh 🌸",
    postLink: "s.shopee.co.id/AUm8Ibx36V",
  },
  {
    id: "3",
    userName: "R Clara Angelica Surya",
    timestamp: "2 jam yang lalu",
    postText: "Siapa yang butuh sunscreen? ☀️",
    postLink: "s.shopee.co.id/2vjqlOCfmo",
  },
];

/* ===================== CONSTANT WARNA ===================== */
const PRIMARY = "#2563EB";
const SOFT_BG = "#EEF2FF";

const Community = () => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [postLink, setPostLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentPostId, setCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    const diffMs = Date.now() - timestamp;
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes} menit yang lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari yang lalu`;
  };

  useEffect(() => {
    const postsRef = ref(db, "communityPosts");
    const handler = (snapshot) => {
      if (!snapshot.exists()) {
        setPosts(INITIAL_POSTS);
        return;
      }

      const data = snapshot.val();
      const list = Object.entries(data)
        .map(([id, post]) => ({
          id,
          userName: post.userName || "Anonim",
          timestamp:
            post.timestamp ||
            formatRelativeTime(post.createdAt) ||
            "Baru saja",
          postText: post.postText || "",
          postLink: post.postLink || "",
          createdAt: post.createdAt || 0,
          likes: post.likes || {},
          comments: post.comments || {},
        }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setPosts(list);
    };

    onValue(postsRef, handler);
    return () => off(postsRef, "value", handler);
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const user = await getData("user");
      if (isMounted) setCurrentUser(user);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenComposer = () => {
    setPostText("");
    setPostLink("");
    setIsComposerOpen(true);
  };

  const handleSubmitPost = async () => {
    if (!postText.trim()) {
      Alert.alert("Post", "Konten post tidak boleh kosong.");
      return;
    }

    const user = currentUser || (await getData("user"));
    if (!user?.uid) {
      Alert.alert("Post", "Silakan login terlebih dahulu.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        userName: user.displayName || user.username || "Anonim",
        postText: postText.trim(),
        postLink: postLink.trim(),
        createdAt: Date.now(),
      };

      await push(ref(db, "communityPosts"), payload);
      setIsComposerOpen(false);
      setPostText("");
      setPostLink("");
    } catch (error) {
      Alert.alert("Post", "Gagal membuat post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserOrAlert = async (label) => {
    const user = currentUser || (await getData("user"));
    if (!user?.uid) {
      Alert.alert(label, "Silakan login terlebih dahulu.");
      return null;
    }

    if (!currentUser) setCurrentUser(user);
    return user;
  };

  const handleToggleLike = async (postId, isLiked) => {
    const user = await getUserOrAlert("Suka");
    if (!user) return;

    try {
      const likeRef = ref(db, `communityPosts/${postId}/likes/${user.uid}`);
      if (isLiked) {
        await remove(likeRef);
      } else {
        await set(likeRef, true);
      }
    } catch (error) {
      Alert.alert("Suka", error?.message || "Gagal memberi suka.");
    }
  };

  const handleOpenComment = (postId) => {
    setCommentPostId(postId);
    setCommentText("");
    setIsCommentOpen(true);
  };

  const handleOpenCommentsList = (postId) => {
    setActiveCommentsPostId(postId);
    setIsCommentsOpen(true);
  };

  const handleCloseCommentsList = () => {
    setIsCommentsOpen(false);
    setActiveCommentsPostId(null);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("Komentar", "Komentar tidak boleh kosong.");
      return;
    }

    const user = await getUserOrAlert("Komentar");
    if (!user) return;

    try {
      setIsCommentSubmitting(true);
      const payload = {
        uid: user.uid,
        userName: user.displayName || user.username || "Anonim",
        text: commentText.trim(),
        createdAt: Date.now(),
      };

      await push(
        ref(db, `communityPosts/${commentPostId}/comments`),
        payload
      );
      setIsCommentOpen(false);
      setCommentPostId(null);
      setCommentText("");
    } catch (error) {
      Alert.alert("Komentar", error?.message || "Gagal mengirim komentar.");
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  return (
    <Box flex={1} bg={SOFT_BG}>
      {/* ===== HEADER ===== */}
      <Box bg="$white" px="$4" py="$4" shadow="$1">
        <Text fontSize="$2xl" fontWeight="$bold" color="#1E293B">
          Komunitas
        </Text>
        <Text fontSize="$sm" color="$gray500">
          Berbagi tips & rekomendasi bareng
        </Text>
      </Box>

      {/* ===== FEED ===== */}
      <ScrollView>
        <VStack space="lg" p="$4">
          {posts.map((item) => {
            const isLiked =
              !!currentUser?.uid && !!item.likes?.[currentUser.uid];
            const likeCount = Object.keys(item.likes || {}).length;
            const commentCount = Object.keys(item.comments || {}).length;
            const commentList = Object.values(item.comments || {}).sort(
              (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
            );
            return (
            <Box
              key={item.id}
              bg="$white"
              rounded="$2xl"
              p="$4"
              shadow="$1"
            >
              {/* HEADER POST */}
              <HStack space="md" alignItems="center">
                <Avatar size="sm" bg="#DBEAFE">
                  <AvatarFallbackText>
                    {item.userName.charAt(0)}
                  </AvatarFallbackText>
                </Avatar>

                <VStack>
                  <Text fontWeight="$bold" color="#1E293B">
                    {item.userName}
                  </Text>
                  <Text fontSize="$xs" color="$gray500">
                    {item.timestamp}
                  </Text>
                </VStack>
              </HStack>

              {/* CONTENT */}
              <Text mt="$3" color="#334155">
                {item.postText}
              </Text>

              <Text mt="$2" color={PRIMARY} fontSize="$sm">
                {item.postLink}
              </Text>

              {/* ACTION */}
              <HStack
                justifyContent="space-between"
                mt="$4"
                pt="$3"
                borderTopWidth={1}
                borderColor="$gray200"
              >
                <ActionButton
                  icon={Heart}
                  label={`Suka (${likeCount})`}
                  active={isLiked}
                  activeColor="#EF4444"
                  onPress={() => handleToggleLike(item.id, isLiked)}
                />
                <ActionButton
                  icon={MessageCircle}
                  label={`Komentar (${commentCount})`}
                  onPress={() => handleOpenComment(item.id)}
                />
              </HStack>

              {commentCount > 0 && (
                <Pressable
                  mt="$3"
                  alignSelf="flex-start"
                  onPress={() => handleOpenCommentsList(item.id)}
                >
                  <Text fontSize="$sm" color={PRIMARY}>
                    Lihat semua komentar
                  </Text>
                </Pressable>
              )}
            </Box>
            );
          })}

          <Box h="$10" />
        </VStack>
      </ScrollView>

      {/* ===== FAB POST ===== */}
      <Pressable
        position="absolute"
        bottom={24}
        right={24}
        bg={PRIMARY}
        p="$4"
        rounded="$full"
        shadow="$4"
        onPress={handleOpenComposer}
      >
        <Plus size={24} color="white" />
      </Pressable>

      <Modal
        visible={isComposerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsComposerOpen(false)}
      >
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          bg="rgba(0,0,0,0.4)"
          px="$4"
        >
          <Box bg="$white" rounded="$xl" w="100%" p="$4">
            <Text fontSize="$lg" fontWeight="$bold" mb="$2">
              Buat Postingan
            </Text>
            <Text fontSize="$sm" color="$gray500" mb="$4">
              Bagikan tips atau rekomendasi kamu.
            </Text>

            <VStack space="md">
              <Input>
                <InputField
                  placeholder="Tulis konten post..."
                  value={postText}
                  onChangeText={setPostText}
                />
              </Input>
              <Input>
                <InputField
                  placeholder="Link (opsional)"
                  value={postLink}
                  onChangeText={setPostLink}
                  autoCapitalize="none"
                />
              </Input>
            </VStack>

            <HStack mt="$4" space="sm" justifyContent="flex-end">
              <Pressable onPress={() => setIsComposerOpen(false)}>
                <Text color="$gray600">Batal</Text>
              </Pressable>
              <Button
                bg={PRIMARY}
                onPress={handleSubmitPost}
                isDisabled={isSubmitting}
              >
                <ButtonText color="$white">
                  {isSubmitting ? "Mengirim..." : "Kirim"}
                </ButtonText>
              </Button>
            </HStack>
          </Box>
        </Box>
      </Modal>

      <Modal
        visible={isCommentOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCommentOpen(false)}
      >
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          bg="rgba(0,0,0,0.4)"
          px="$4"
        >
          <Box bg="$white" rounded="$xl" w="100%" p="$4">
            <Text fontSize="$lg" fontWeight="$bold" mb="$2">
              Tulis Komentar
            </Text>
            <Text fontSize="$sm" color="$gray500" mb="$4">
              Berikan komentar kamu.
            </Text>

            <Input>
              <InputField
                placeholder="Tulis komentar..."
                value={commentText}
                onChangeText={setCommentText}
              />
            </Input>

            <HStack mt="$4" space="sm" justifyContent="flex-end">
              <Pressable onPress={() => setIsCommentOpen(false)}>
                <Text color="$gray600">Batal</Text>
              </Pressable>
              <Button
                bg={PRIMARY}
                onPress={handleSubmitComment}
                isDisabled={isCommentSubmitting}
              >
                <ButtonText color="$white">
                  {isCommentSubmitting ? "Mengirim..." : "Kirim"}
                </ButtonText>
              </Button>
            </HStack>
          </Box>
        </Box>
      </Modal>

      <Modal
        visible={isCommentsOpen}
        transparent
        animationType="fade"
        onRequestClose={handleCloseCommentsList}
      >
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          bg="rgba(0,0,0,0.4)"
          px="$4"
        >
          <Box bg="$white" rounded="$xl" w="100%" p="$4">
            <Text fontSize="$lg" fontWeight="$bold" mb="$2">
              Semua Komentar
            </Text>
            <Text fontSize="$sm" color="$gray500" mb="$4">
              Diskusi di postingan ini.
            </Text>

            <VStack space="sm" maxHeight="$80">
              {(posts.find((post) => post.id === activeCommentsPostId)
                ?.comments
                ? Object.values(
                    posts.find((post) => post.id === activeCommentsPostId)
                      .comments
                  )
                : []
              )
                .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
                .map((comment, index) => (
                  <Box key={index} bg="#F8FAFC" p="$3" rounded="$lg">
                    <Text fontWeight="$bold">
                      {comment.userName || "Anonim"}
                    </Text>
                    <Text color="#334155">{comment.text}</Text>
                  </Box>
                ))}
              {(!posts.find((post) => post.id === activeCommentsPostId)
                ?.comments ||
                Object.keys(
                  posts.find((post) => post.id === activeCommentsPostId)
                    ?.comments || {}
                ).length === 0) && (
                <Text color="$gray500" textAlign="center">
                  Belum ada komentar.
                </Text>
              )}
            </VStack>

            <HStack mt="$4" justifyContent="flex-end">
              <Pressable onPress={handleCloseCommentsList}>
                <Text color="$gray600">Tutup</Text>
              </Pressable>
            </HStack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

/* ===================== ACTION BUTTON ===================== */
function ActionButton({
  icon: Icon,
  label,
  onPress,
  active = false,
  activeColor,
}) {
  const iconTint = active ? activeColor || "#64748B" : "#64748B";
  return (
    <Pressable onPress={onPress}>
      <HStack space="xs" alignItems="center">
        <Icon size={18} color={iconTint} />
        <Text fontSize="$sm" color="#64748B">
          {label}
        </Text>
      </HStack>
    </Pressable>
  );
}

export default Community;
