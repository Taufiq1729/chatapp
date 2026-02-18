import { Stack } from "react-bootstrap";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import avatarImg from "../../assets/avatar.svg";

const UserChat = ({ chat, user }) => {
  const { onlineUsers, updateCurrentChat, currentChat } = useContext(ChatContext);

  const { recipientUser } = useFetchRecipient(chat, user);

  const isOnline = onlineUsers?.some(
    (u) => u?.userId === recipientUser?._id
  );

  const isActive = currentChat?._id === chat?._id;

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className={`user-card align-items-center p-2 justify-content-between ${isActive ? "user-card-active" : ""}`}
      role="button"
      onClick={() => updateCurrentChat(chat)}
    >
      <div className="d-flex">
        <div className="me-2">
          <img
            src={avatarImg}
            height="35"
            width="35"
            alt=""
            className="rounded-circle user-chat-avatar"
          />
        </div>

        <div className="text-content">
          <div className="name">
            {recipientUser?.name}
          </div>
          <div className="text">
            {/* Last message preview here if needed */}
          </div>
        </div>
      </div>

      <div className="d-flex flex-column align-items-end">
        <div className="date">
          {/* Message date here */}
        </div>

        <div
          className={
            isOnline
              ? "user-online-indicator"
              : ""
          }
        ></div>
      </div>
    </Stack>
  );
};

export default UserChat;
