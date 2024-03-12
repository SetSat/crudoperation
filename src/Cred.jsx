import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const Cred = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post(API_URL, { name, email });
      setUsers([...users, response.data]);
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const editUser = async (id) => {
    setIsEditing(true);
    setEditId(id);
    const userToEdit = users.find((user) => user.id === id);
    setName(userToEdit.name);
    setEmail(userToEdit.email);
  };

  const updateUser = async () => {
    try {
      await axios.put(`${API_URL}/${editId}`, { name, email });
      setUsers(
        users.map((user) =>
          user.id === editId ? { ...user, name, email } : user
        )
      );
      setName("");
      setEmail("");
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="App">
      <h1>User Management System</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {isEditing ? (
          <button onClick={updateUser}>Update User</button>
        ) : (
          <button onClick={addUser}>Add User</button>
        )}
      </div>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            <div className="actions">
              <button onClick={() => editUser(user.id)} className="edit-button">Edit</button>
              <button onClick={() => deleteUser(user.id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cred;
