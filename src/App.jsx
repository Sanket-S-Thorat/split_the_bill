import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend() {
    setShowAddFriend((addFriend) => !addFriend);
  }

  function handleAddList(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend((friend) => !friend);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((curFriend) =>
      curFriend?.id == friend.id ? null : friend
    );
    setShowAddFriend(false);
  }

  function splitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddList={handleAddList} />}

        <Button onClick={handleAddFriend}>
          {showAddFriend ? `Close` : `Add Friend`}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBil selectedFriend={selectedFriend} onSplitBill={splitBill} />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  return (
    <li className={selectedFriend?.id === friend.id ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance == 0 && <p>You and {friend.name} are Even</p>}

      <Button onClick={() => onSelection(friend)}>
        {selectedFriend?.id == friend.id ? `Close` : `Select`}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddList }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const randomId = crypto.randomUUID;
    const newFriend = {
      name,
      image: `${image}?=${randomId}`,
      balance: 0,
      id: randomId,
    };

    onAddList(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫🏻 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>📎Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBil({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidbyUser] = useState(0);
  const paidByFriend = bill ? bill - paidByUser : 0;
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill) return;

    onSplitBill(whoIsPaying == "user" ? paidByFriend : -(bill + paidByFriend));
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍🏻‍♂️ Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) => setPaidbyUser(Number(e.target.value))}
      />

      <label>👫🏻 {selectedFriend.name}&apos;s Expense</label>
      <input
        type="text"
        disabled
        value={paidByFriend >= 0 ? paidByFriend : ""}
      />

      <label>🤑 Who&apos;s paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
