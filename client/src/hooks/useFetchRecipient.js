import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipient = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const currentUserId = user?._id ?? user?.id;
  const recipientId = chat?.members?.find(
    (id) => String(id) !== String(currentUserId)
  );

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return;

      const response = await getRequest(
        `${baseUrl}/users/find/${recipientId}`
      );

      if (response?.error) {
        setError(response.message);
        return;
      }

      setRecipientUser(response?.user ?? response);
    };

    getUser();
  }, [recipientId]);

  return { recipientUser, error };
};
