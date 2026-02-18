import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, postRequest, getRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [userChatsError, setUserChatsError] = useState(null);
    const [messages, setMessages] = useState([]);

    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [potentialChats, setPotentialChats] = useState([]);

    // Online users placeholder (can be updated when you add sockets)
    const [onlineUsers, setOnlineUsers] = useState([]);

    // Users you can start a conversation with (no existing chat yet)
    const userId = user?._id ?? user?.id;

    useEffect(() => {
        const fetchPotentialChats = async () => {
            if (!userId) {
                setPotentialChats([]);
                return;
            }

            const response = await getRequest(`${baseUrl}/users`);

            if (response?.error) {
                setPotentialChats([]);
                return;
            }

            const users = Array.isArray(response) ? response : response?.users ?? [];
            const pChats = users.filter((u) => {
                if (u._id === userId) return false; // exclude yourself
                const alreadyHasChat = userChats?.some(
                    (chat) =>
                        (chat.members?.[0] === u._id || chat.members?.[1] === u._id)
                );
                return !alreadyHasChat;
            });

            setPotentialChats(pChats);
        };

        fetchPotentialChats();
    }, [userId, userChats]);

    const updateCurrentChat = useCallback((chat) =>{
        setCurrentChat(chat)
    }, []);

    // ==============================
    // 1️⃣ CREATE CHAT
    // ==============================
    const createChat = useCallback(async (firstUserId, secondUserId) => {
        const response = await postRequest(`${baseUrl}/chats`, {
            firstId: firstUserId,
            secondId: secondUserId,
        });

        if (response?.error) {
            return;
        }
        // Backend returns the chat object directly
        const newChat = response?.chat ?? response;
        if (newChat?._id) {
            setUserChats((prev) => [...prev, newChat]);
            setCurrentChat(newChat);
        }
    }, []);

    // ==============================
    // 2️⃣ GET USER CHATS
    // ==============================
    useEffect(() => {
        const getUserChats = async () => {
            if (!userId) return;

            setIsUserChatsLoading(true);
            setUserChatsError(null);

            const response = await getRequest(`${baseUrl}/chats/${userId}`);

            setIsUserChatsLoading(false);

            if (response.error) {
                setUserChatsError(response.message);
                return;
            }

            setUserChats(response);
        };

        getUserChats();
    }, [userId]);

    // ==============================
    // 3️⃣ GET MESSAGES
    // ==============================
    useEffect(() => {
        const getChatMessages = async () => {
            if (!currentChat?._id) {
                setMessages([]);
                return;
            }

            setIsMessagesLoading(true);
            setMessages([]);

            const response = await getRequest(
                `${baseUrl}/messages/${currentChat._id}`
            );

            setIsMessagesLoading(false);

            if (response?.error) {
                setMessages([]);
                return;
            }

            const list = Array.isArray(response) ? response : response?.messages ?? [];
            setMessages(list);
        };

        getChatMessages();
    }, [currentChat]);

    // ==============================
    // 4️⃣ SEND MESSAGE
    // ==============================
    const sendMessage = useCallback(
        async (text) => {
            if (!currentChat?._id || !userId) return;

            const response = await postRequest(`${baseUrl}/messages`, {
                chatId: currentChat._id,
                senderId: userId,
                text,
            });

            if (!response.error) {
                setMessages((prev) => [...prev, response.message]);
            }
        },
        [currentChat, userId]
    );

    return (
        <ChatContext.Provider
            value={{
                user,
                userChats,
                isUserChatsLoading,
                userChatsError,
                currentChat,
                setCurrentChat,
                messages,
                isMessagesLoading,
                createChat,
                sendMessage,
                onlineUsers,
                setOnlineUsers,
                potentialChats,
                updateCurrentChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
