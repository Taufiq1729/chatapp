import { useContext, useRef, useEffect, useState } from "react";
import { Stack, Spinner, Form, Button } from "react-bootstrap";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import avatarImg from "../../assets/avatar.svg";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChat,
    messages,
    isMessagesLoading,
    sendMessage,
  } = useContext(ChatContext);

  const { recipientUser } = useFetchRecipient(currentChat, user);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = text?.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setText("");
  };

  if (!currentChat) {
    return (
      <Stack className="chat-box flex-grow-1 align-items-center justify-content-center p-4">
        <p className="text-secondary mb-0">
          Select a chat from the list to start messaging.
        </p>
      </Stack>
    );
  }

  return (
    <Stack className="chat-box flex-grow-1">
      {/* Chat header */}
      <div className="chat-header rounded-top">
        <div className="d-flex align-items-center gap-2">
          <div className="chat-header-avatar-wrapper">
            <img
              src={avatarImg}
              height="36"
              width="36"
              alt=""
              className="rounded-circle chat-header-avatar-img"
            />
          </div>
          <span className="fw-semibold">{recipientUser?.name ?? "Loading…"}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="messages flex-grow-1">
        {isMessagesLoading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" variant="light" />
          </div>
        ) : (
          <>
            {messages?.length === 0 && (
              <p className="text-secondary text-center py-4 mb-0">
                No messages yet. Say hello!
              </p>
            )}
            {messages?.map((msg) => {
              const isSelf = msg.sender?._id === user?._id || msg.sender === user?._id;
              const createdAt = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "";
              return (
                <Stack
                  key={msg._id}
                  direction="horizontal"
                  className={`message-wrapper ${isSelf ? "justify-content-end" : "justify-content-start"}`}
                >
                  <div className={`message ${isSelf ? "self" : ""}`}>
                    <div className="message-text">{msg.text}</div>
                    <div className="message-footer">{createdAt}</div>
                  </div>
                </Stack>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="chat-input">
        <Form onSubmit={handleSend}>
          <Stack direction="horizontal" gap={2}>
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-dark border-secondary text-white"
              aria-label="Message"
            />
            <Button
              type="submit"
              variant="primary"
              className="send-btn p-0 d-flex align-items-center justify-content-center"
              disabled={!text?.trim()}
              aria-label="Send"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
              </svg>
            </Button>
          </Stack>
        </Form>
      </div>
    </Stack>
  );
};

export default ChatBox;
