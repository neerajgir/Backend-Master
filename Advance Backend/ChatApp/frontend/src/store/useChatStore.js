import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { notifyNewMessage, updateAppTitle, getTotalUnread } from "../lib/notifications";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  onlineUsers: [],
  unreadCounts: {},

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  handleIncomingMessage: (newMessage) => {
    const { selectedUser, messages, unreadCounts, users } = get();

    if (selectedUser && newMessage.senderId === selectedUser._id) {
      set({ messages: [...messages, newMessage] });
      return;
    }

    const sender = users.find((u) => u._id === newMessage.senderId);
    const nextCounts = {
      ...unreadCounts,
      [newMessage.senderId]: (unreadCounts[newMessage.senderId] || 0) + 1,
    };
    set({ unreadCounts: nextCounts });
    updateAppTitle(getTotalUnread(nextCounts));
    notifyNewMessage(newMessage, sender);
  },

  setSelectedUser: (selectedUser) => {
    const { unreadCounts } = get();
    if (selectedUser?._id && unreadCounts[selectedUser._id]) {
      const nextCounts = { ...unreadCounts };
      delete nextCounts[selectedUser._id];
      set({ selectedUser, unreadCounts: nextCounts });
      updateAppTitle(getTotalUnread(nextCounts));
    } else {
      set({ selectedUser });
    }
  },

  resetChatState: () =>
    set({
      messages: [],
      users: [],
      selectedUser: null,
      isUsersLoading: false,
      isMessagesLoading: false,
      onlineUsers: [],
      unreadCounts: {},
    }),
}));