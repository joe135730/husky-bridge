import "./LeftSideBar.css"; // Ensure this CSS file is updated

const LeftSideBar = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="left-sidebar">
      <button className="close-button" onClick={onClose}>✖</button>
      <ul>
        <li>Home</li>
        <li>Profile</li>
        <li>Messages</li>
        <li>My Post</li>
        <li>Settings</li>
        <li>Logout</li>
      </ul>
    </div>
  );
};

export default LeftSideBar;