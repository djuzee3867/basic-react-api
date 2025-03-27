import { useState, useEffect } from "react";
import axios from "axios";
import "/app.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null); 
  const [editFields, setEditFields] = useState({ id: "", name: "", county: "" }); 

  async function fetchTodo() {
    try {
      const response = await axios.get("https://67e40dcf2ae442db76d2d838.mockapi.io/todo");
      console.log("API Response:", response.data);
      setTodos(response.data); 
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTodo();
  }, []);

  const deleteTodo = async (id) => {
    setIsLoading(true);
    const deleteUrl = `https://67e40dcf2ae442db76d2d838.mockapi.io/todo/${id}`;

    try {
      const response = await axios.delete(deleteUrl);
      console.log("deleted", response.data);
      await fetchTodo(); 
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditFields({ id: todo.id, name: todo.name, county: todo.county });
  };

  const saveEdit = async (id) => {
    setIsLoading(true);
    const deleteUrl = `https://67e40dcf2ae442db76d2d838.mockapi.io/todo/${id}`;
    const createUrl = `https://67e40dcf2ae442db76d2d838.mockapi.io/todo`;

    try {
      await axios.delete(deleteUrl);

      const response = await axios.post(createUrl, {
        id: editFields.id, 
        name: editFields.name,
        county: editFields.county,
      });

      console.log("created", response.data);
      console.log("Saving edit:", editFields);
      console.log("API Response after creation:", response.data);

      setEditingTodo(null); 
      await fetchTodo(); 
    } catch (error) {
      console.log("Error saving edit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <table className="ul1">
        <thead>
          <tr>
            <th className="th1">ID</th>
            <th className="thname">Name</th>
            <th className="thname1">County</th>
            <th className="thb">Actions</th>
          </tr>
        </thead>
      </table>

      <div className="load"> {isloading && <div>Loading...</div>}</div>
      {!isloading && (
        <div className="app">
          {todos.map((todo) => (
            <div key={todo.id} className="container">
              <table className="ul">
                <tbody>
                  <tr>
                    <td className="th1">
                      {editingTodo === todo.id ? (
                        <input
                          type="text"
                          value={editFields.id}
                          onChange={(e) => handleFieldChange("id", e.target.value)}
                        />
                      ) : (
                        todo.id
                      )}
                    </td>
                    <td className="thname">
                      {editingTodo === todo.id ? (
                        <input
                          type="text"
                          value={editFields.name}
                          onChange={(e) => handleFieldChange("name", e.target.value)}
                        />
                      ) : (
                        todo.name
                      )}
                    </td>
                    <td className="thname1">
                      {editingTodo === todo.id ? (
                        <input
                          type="text"
                          value={editFields.county}
                          onChange={(e) => handleFieldChange("county", e.target.value)}
                        />
                      ) : (
                        todo.county
                      )}
                    </td>
                    <td className="thb">
                      {editingTodo === todo.id ? (
                        <button className="b1" onClick={() => saveEdit(todo.id)}>
                          Save
                        </button>
                      ) : (
                        <button className="b1" onClick={() => startEditing(todo)}>
                          Edit
                        </button>
                      )}
                      <button className="b1" onClick={() => deleteTodo(todo.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;