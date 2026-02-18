import { useContext } from "react";
import { Stack } from "react-bootstrap";
import { ChatContext } from "../../context/ChatContext";

const PotentialChats = () => {
  const { potentialChats, createChat, onlineUsers, user } =
    useContext(ChatContext);

  const currentUserId = user?._id ?? user?.id;
  if (!currentUserId) return null;

  return (
    <>
      {potentialChats?.length > 0 && (
        <div className="mb-3">
          <p className="text-secondary small mb-2">Start a conversation:</p>
          <Stack direction="horizontal" gap={2} className="flex-wrap">
            {potentialChats.map((u) => {
              const isOnline = onlineUsers?.some(
                (online) => online?.userId === u?._id
              );

              return (
                <div
                  className="single-user"
                  key={u._id}
                  role="button"
                  onClick={() => createChat(currentUserId, u._id)}
                >
                  {u.name}
                  {isOnline && (
                    <span className="user-online-indicator ms-1" />
                  )}
                </div>
              );
            })}
          </Stack>
        </div>
      )}
    </>
  );
};

export default PotentialChats;
