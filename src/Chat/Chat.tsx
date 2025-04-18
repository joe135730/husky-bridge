import { useEffect, useState } from 'react';
import './Chat.css';
import Navbar from '../navbar/navbar';
import Footer from "../Footer/index";

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


  // Replace it with session-based fetch logic
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const loadProfileAndContacts = async () => {
      try {
        const profileRes = await fetch("/api/users/profile", {
          method: "POST",
          credentials: "include"
        });
        const currentUser = await profileRes.json();
        setCurrentUserId(currentUser._id); // Save for message check later

        const usersRes = await fetch("/api/users", {
          credentials: "include"
        });
        const users = await usersRes.json();

        const formattedContacts = users.map((user: any) => ({
          id: user._id,
          name: user.firstName || user.email || "Unknown",
          lastMessage: '',
          isOnline: false
        }));

        setContacts(formattedContacts);
      } catch (err) {
        console.error("Failed to load user data", err);
      }
    };

    loadProfileAndContacts();
  }, []);


  // Load all users from DB (excluding current user)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        console.log("Trying to get the contact list...");
        const res = await fetch("/api/users", { credentials: "include" });
        console.log("API response status:", res.status);
        const data = await res.json();
        console.log("Received user information:", data);

        // Make sure the data is in array format
        const userArray = Array.isArray(data) ? data : [];
        console.log("Processed user array:", userArray);

        const contactList: Contact[] = userArray.map((user: any) => ({
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

  const handleContactSelect = async (contact: Contact) => {
    setSelectedContact(contact);
    const generatedRoomId = `room-${[currentUserId, contact.id].sort().join("-")}`;
    setRoomId(generatedRoomId);

    try {
      const res = await fetch(`/api/chat/${generatedRoomId}`, {
        credentials: "include"
      });
      const data = await res.json();
      setMessages(data.map((msg: any) => ({
        id: msg._id,
        text: msg.message,
        sender: msg.senderId,
        timestamp: new Date(msg.timestamp).toLocaleTimeString(),
        isSentByMe: msg.senderId === currentUserId
      })));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !roomId || !selectedContact) return;

    const newMessage = {
      roomId,
      message: messageInput,
      receiverId: selectedContact.id
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newMessage)
      });

      const saved = await res.json();
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
    <>
      <Navbar />
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
                  <p>{contact.lastMessage}</p>
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
      <Footer />
    </>
  );
}
