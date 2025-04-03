import { useState } from 'react';
import './Chat.css';
import Navbar from '../navbar/navbar';
import Footer from "../Footer/index";

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  isSentByMe: boolean;
}

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  avatar: string;
  isOnline: boolean;
}

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'Harry',
      lastMessage: 'Hello',
      avatar: '/avatars/harry.jpg',
      isOnline: true
    },
    {
      id: 2,
      name: 'Jenny',
      lastMessage: 'Hello',
      avatar: '/avatars/jenny.jpg',
      isOnline: false
    },
    {
      id: 3,
      name: 'Contact Name',
      lastMessage: 'hello',
      avatar: '/avatars/default.jpg',
      isOnline: false
    }
  ]);

  const messages: Message[] = [
    {
      id: 1,
      text: 'Hello!',
      sender: 'Harry',
      timestamp: '00:08',
      isSentByMe: false
    },
    {
      id: 2,
      text: 'Hi',
      sender: 'Me',
      timestamp: '00:08',
      isSentByMe: true
    },
    {
      id: 3,
      text: "How're you doing?",
      sender: 'Harry',
      timestamp: '00:08',
      isSentByMe: false
    },
    {
      id: 4,
      text: "I'm fine, and you?",
      sender: 'Me',
      timestamp: '00:08',
      isSentByMe: true
    },
    {
      id: 5,
      text: "I'm cool too! Let's go camping tomorrow? Everybody will be there!",
      sender: 'Harry',
      timestamp: '00:08',
      isSentByMe: false
    },
    {
      id: 6,
      text: "That's would be nice!",
      sender: 'Me',
      timestamp: '00:08',
      isSentByMe: true
    },
    {
      id: 7,
      text: "I'm in.",
      sender: 'Me',
      timestamp: '00:08',
      isSentByMe: true
    }
  ];

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // TODO: Implement sending message functionality
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  const handleAddContact = () => {
    if (!newContactName.trim()) return;
    
    const newContact: Contact = {
      id: Math.max(...contacts.map(contact => contact.id)) + 1,
      name: newContactName,
      lastMessage: 'New contact added',
      avatar: '/avatars/default.jpg',
      isOnline: false
    };
    
    setContacts(prevContacts => [...prevContacts, newContact]);
    setNewContactName('');
    setShowAddContact(false);
  };

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <div className="contacts-sidebar">
          <div className="contacts-header">
            <h2>Messages</h2>
          </div>
          
          {showAddContact && (
            <div className="add-contact-form">
              <input
                type="text"
                placeholder="Enter contact name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
              />
              <div className="add-contact-buttons">
                <button onClick={handleAddContact}>Add</button>
                <button onClick={() => {
                  setShowAddContact(false);
                  setNewContactName('');
                }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="contacts-list">
            {contacts.map(contact => (
              <div
                key={contact.id}
                className={`contact-item ${selectedContact?.id === contact.id ? 'selected' : ''}`}
                onClick={() => handleContactSelect(contact)}
              >
                <div className="contact-avatar">
                  <img src={contact.avatar} alt={contact.name} />
                  {contact.isOnline && <span className="online-indicator"></span>}
                </div>
                <div className="contact-info">
                  <h3>{contact.name}</h3>
                  <p>{contact.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="add-contact-btn floating"
            onClick={() => setShowAddContact(true)}
          >
            <i className="fas fa-plus"></i>
          </button>
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