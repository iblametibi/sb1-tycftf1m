import React, { useState } from 'react';
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  completed: boolean;
}

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTime, setSelectedTime] = useState('09:00');

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        completed: false,
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setShowAddTask(false);
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate.getDate() === day;
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-12 border border-gray-200 flex items-center justify-center cursor-pointer transition-colors
            ${isToday ? 'bg-blue-100' : ''}
            ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const tasksForSelectedDate = tasks.filter(
    task => task.date === selectedDate.toISOString().split('T')[0]
  ).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 border-b flex items-center justify-between bg-blue-500 text-white">
            <div className="flex items-center space-x-2">
              <Calendar className="w-6 h-6" />
              <h1 className="text-xl font-semibold">Personal Calendar</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-blue-600 rounded">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-medium">
                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => changeMonth(1)} className="p-1 hover:bg-blue-600 rounded">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="h-8 flex items-center justify-center font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Tasks for {selectedDate.toLocaleDateString()}
              </h2>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>

            {showAddTask && (
              <div className="mb-4 flex space-x-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter task description"
                  className="flex-1 border rounded px-3 py-1"
                />
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="border rounded px-3 py-1"
                />
                <button
                  onClick={addTask}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="space-y-2">
              {tasksForSelectedDate.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tasks for this date</p>
              ) : (
                tasksForSelectedDate.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-3 p-2 border rounded hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="w-4 h-4 text-blue-500"
                    />
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">{task.time}</span>
                    <span className={task.completed ? 'line-through text-gray-400' : ''}>
                      {task.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;