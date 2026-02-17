import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, postRequest, getRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {

    const [userChats, setUserChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [userChatsError, setUserChatsError] = useState(false);
    const [messages, setMessages] = useState([]);

    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);


    // ==============================
    // 1️⃣ CREATE CHAT
    // ==============================
    const createChat = useCallback(async (firstUserId, secondUserId) => {
        const response = await postRequest(`${baseUrl}/chats`, {
            firstUserId,
            secondUserId,
        });

        if (!response.error) {
            setUserChats((prev) => [...prev, response.chat]);
        }
    }, []);

    // ==============================
    // 2️⃣ GET USER CHATS
    // ==============================
    useEffect(() => {
        const getUserChats = async () => {
            if (!user?._id) return;

            setIsUserChatsLoading(true);
            setUserChatsError(null);

            const response = await getRequest(
                `${baseUrl}/chats/${user._id}`
            );

            setIsUserChatsLoading(false);

            if (!response.error) {
                setUserChats(response);
            }
        };

     getUserChats();
    }, [user]);

    // ==============================
    // 3️⃣ GET MESSAGES
    // ==============================
    useEffect(() => {
        const getChatMessages = async () => {
            if (!currentChat?._id) return;

            setIsMessagesLoading(true);

            const response = await getRequest(
                `${baseUrl}/messages/${currentChat._id}`
            );

            setIsMessagesLoading(false);

            if (!response.error) {
                setMessages(response.messages);
            }
        };

        getChatMessages();
    }, [currentChat]);

    // ==============================
    // 4️⃣ SEND MESSAGE
    // ==============================
    const sendMessage = useCallback(async (text) => {
        if (!currentChat?._id || !user?._id) return;

        const response = await postRequest(`${baseUrl}/messages`, {
            chatId: currentChat._id,
            senderId: user._id,
            text,
        });

        if (!response.error) {
            setMessages((prev) => [...prev, response.message]);
        }
    }, [currentChat, user]);


    return (
        <ChatContext.Provider
            value={{
                userChats,
                isUserChatsLoading
    ,         // In lecture isUserChatsLoading
                currentChat,
                setCurrentChat,
                messages,
                isMessagesLoading,
                createChat,
                sendMessage,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
