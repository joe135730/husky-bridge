import { useEffect, useState, useCallback } from 'react';
import './Chat.css';
import { axiosWithCredentials } from '../api/client';
import { useSelector } from 'react-redux';
import { StoreType } from '../store';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isSentByMe: boolean;
}

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  isOnline: boolean;
}

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const currentUser = useSelector((state: StoreType) => state.accountReducer.currentUser);

  // Add authentication debugging
  useEffect(() => {
    console.log("Chat Component - Auth State:", {
      isLoggedIn: !!currentUser,
      userId: currentUser?._id,
      role: currentUser?.role
    });
  }, [currentUser]);

  const handleContactSelect = useCallback(async (contact: Contact) => {
    setSelectedContact(contact);
    const generatedRoomId = `room-${[currentUserId, contact.id].sort().join("-")}`;
    setRoomId(generatedRoomId);

    try {
      const res = await axiosWithCredentials.get(`/chat/${generatedRoomId}`);
      const data = res.data;

      const formattedMessages = data.map((msg: { _id: string; message: string; senderId: string; timestamp: string | Date }) => ({
        id: msg._id,
        text: msg.message,
        sender: msg.senderId,
        timestamp: new Date(msg.timestamp).toLocaleString([], {
          dateStyle: "medium",
          timeStyle: "short"
        }),
        isSentByMe: msg.senderId === currentUserId
      }));

      setMessages(formattedMessages);

      // 🟡 Set lastMessage in sidebar contact list
      const lastMsg = formattedMessages.at(-1);
      if (lastMsg) {
        setContacts(prev =>
          prev.map(c =>
            c.id === contact.id
              ? { ...c, lastMessage: `${lastMsg.text.slice(0, 30)} · ${lastMsg.timestamp}` }
              : c
          )
        );
      }

    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, [currentUserId]);

  // Check for focused user from PendingOffers
  useEffect(() => {
    const focusUserId = localStorage.getItem('chatFocusUser');
    if (focusUserId && contacts.length > 0) {
      const contactToFocus = contacts.find(contact => contact.id === focusUserId);
      if (contactToFocus) {
        handleContactSelect(contactToFocus);
      }
      // Clear the stored ID after focusing
      localStorage.removeItem('chatFocusUser');
    }
  }, [contacts, handleContactSelect]);

  useEffect(() => {
    const loadProfileAndContacts = async () => {
      try {
        const profileRes = await axiosWithCredentials.post("/users/profile");
        const currentUser = profileRes.data;
        setCurrentUserId(currentUser._id);

        const usersRes = await axiosWithCredentials.get("/users");
        const users = usersRes.data;

        const formattedContacts = users.map((user: { _id: string; firstName?: string; email?: string }) => ({
          id: user._id,
          name: user.firstName || user.email || "Unknown",
          lastMessage: '',
          isOnline: false
        }));

        setContacts(formattedContacts);
      } catch (err: unknown) {
        console.error("Failed to load user data", err);
        const error = err as { response?: { status?: number } };
        
        // Check for auth errors
        if (error.response?.status === 401) {
          console.log("Authentication required. User session may have expired.");
        } else if (error.response?.status === 403) {
          console.log("Access forbidden. User may not have correct permissions.");
        }
      }
    };

    loadProfileAndContacts();
  }, []);

  // Load all users from DB (excluding current user)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        console.log("Trying to get the contact list...");
        const res = await axiosWithCredentials.get("/users");
        console.log("API response status:", res.status);
        const data = res.data;
        console.log("Received user information:", data);

        // Make sure the data is in array format
        const userArray = Array.isArray(data) ? data : [];
        console.log("Processed user array:", userArray);

        const contactList: Contact[] = userArray.map((user: { _id: string; firstName?: string; username?: string; email?: string }) => ({
          id: user._id,
          name: user.firstName || user.username || user.email || "Unknown",
          lastMessage: '',
          isOnline: false
        }));
        setContacts(contactList);
      } catch (err) {
        console.error("Failed to load contacts:", err);
      }
    };

    fetchContacts();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !roomId || !selectedContact) return;

    const newMessage = {
      roomId,
      message: messageInput,
      receiverId: selectedContact.id
    };

    try {
      const res = await axiosWithCredentials.post("/chat", newMessage);
      const saved = res.data;
      setMessages(prev => [...prev, {
        id: saved._id,
        text: saved.message,
        sender: currentUserId,
        timestamp: new Date(saved.timestamp).toLocaleTimeString(),
        isSentByMe: true
      }]);
      setMessageInput('');
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="contacts-sidebar">
        <div className="contacts-header">
          <h2>Messages</h2>
        </div>

        <div className="contacts-list">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`contact-item ${selectedContact?.id === contact.id ? 'selected' : ''}`}
              onClick={() => handleContactSelect(contact)}
            >
              <div className="contact-info">
                <h3>{contact.name}</h3>
                <p className="last-message-preview">{contact.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <h2>{selectedContact.name}</h2>
                {selectedContact.isOnline && <span className="status">Online</span>}
              </div>
              <button className="more-options">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>

            <div className="messages-container">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`message ${message.isSentByMe ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="timestamp">{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            <form className="message-input-container" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Text here..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button type="submit">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
