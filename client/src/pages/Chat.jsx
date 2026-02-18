import { useContext } from "react";
import { Container, Stack, Spinner, Alert } from "react-bootstrap";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import UserChat from "../components/chat/UserChat";
import ChatBox from "../components/chat/ChatBox";
import PotentialChats from "../components/chat/PotentialChats";

const Chat = () => {
    const { user } = useContext(AuthContext);

    const {
        userChats,
        isUserChatsLoading,
        userChatsError,
        currentChat,
        updateCurrentChat,
    } = useContext(ChatContext);

    if (!user) {
        return (
            <Container className="py-4">
                <Alert variant="warning">
                    Please log in to view your chats.
                </Alert>
            </Container>
        );
    }

    return (

        <Container className="py-4">
            <PotentialChats />
            {isUserChatsLoading && (
                <div className="d-flex justify-content-center my-4">
                    <Spinner animation="border" variant="light" />
                </div>
            )}

            {userChatsError && (
                <Alert variant="danger" className="my-2">
                    {userChatsError}
                </Alert>
            )}

            {!isUserChatsLoading && !userChatsError && userChats?.length === 0 && (
                <Alert variant="info" className="my-2">
                    You don&apos;t have any chats yet. Start a conversation from
                    the users list.
                </Alert>
            )}

            {userChats?.length > 0 && (
                <Stack direction="horizontal" gap={3}>
                    {/* Chats list */}
                    <Stack className="messages-box pe-3 border-end">
                        {userChats.map((chat) => (
                            <UserChat
                                key={chat._id}
                                chat={chat}
                                user={user}
                            />
                        ))}
                    </Stack>

                    {/* Chat box */}
                    <ChatBox />
                </Stack>
            )}
        </Container>
    );
};

export default Chat;