const Chat = () => {

    const { userChats, 
        isUserChatsLoading,
        userChatsError, } = useContext(ChatContext);

        console.log("UserChats", userChats);
    return <>Chat</>
};

export default Chat;