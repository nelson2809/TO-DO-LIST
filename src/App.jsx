import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const inputRef = useRef(null);

  useEffect(() => {
    let todoString = localStorage.getItem('todos');
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem('todos'));
      setTodos(todos);
    }
  }, []);

  const saveToLS = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  const handleEdit = (e, id, todo, date) => {
    e.preventDefault();
    e.stopPropagation();
    setTodo(todo);
    setSelectedDate(new Date(date));
    if (inputRef.current) {
      inputRef.current.focus();
    }
    saveToLS();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    let newTodos = todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS();
  };

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, date: selectedDate, isCompleted: false }]);
    setTodo('');
    saveToLS();
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex((item) => {
      return item.id === id;
    });
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS();
  };

  // Filter pending tasks
  const pendingTasks = todos.filter((item) => !item.isCompleted);

  // Filter completed tasks
  const completedTasks = todos.filter((item) => item.isCompleted);

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-3xl">TCARE - Manage Your ToDO List</h1>

        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <div className="flex gap-2">
            <input ref={inputRef} onChange={handleChange} value={todo} type="text" className="w-full rounded-full px-5 py-1" />
            <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} className="rounded-full px-5 py-1" />
            <button onClick={handleAdd} disabled={todo.length <= 3} className="bg-violet-800 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white">
              Save
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Pending Tasks</h2>
          <div className="todos">
            {pendingTasks.length === 0 && <div className="m-5">No pending tasks</div>}
            {pendingTasks.map((item) => (
              <div key={item.id} className={"todo flex my-3 justify-between"}>
                <div className="flex gap-5">
                  <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} id="" />
                  <div className={item.isCompleted ? 'line-through' : ''}>{item.todo}</div>
                  <div>{item.date.toLocaleDateString()}</div>
                </div>
                <div className="buttons flex h-full">
                  <button onClick={(e) => handleEdit(e, item.id, item.todo, item.date)} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1">
                    <FaEdit />
                  </button>
                  <button onClick={(e) => handleDelete(e, item.id)} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1">
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Completed Tasks</h2>
          <div className="todos">
            {completedTasks.length === 0 && <div className="m-5">No completed tasks</div>}
            {completedTasks.map((item) => (
              <div key={item.id} className={"todo flex my-3 justify-between"}>
                <div className="flex gap-5">
                  <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} id="" />
                  <div className={item.isCompleted ? 'line-through' : ''}>{item.todo}</div>
                  <div>{item.date.toLocaleDateString()}</div>
                </div>
                <div className="buttons flex h-full">
                  <button onClick={(e) => handleEdit(e, item.id, item.todo, item.date)} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1">
                    <FaEdit />
                  </button>
                  <button onClick={(e) => handleDelete(e, item.id)} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1">
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
