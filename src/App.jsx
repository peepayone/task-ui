import { useState, useEffect } from 'react'

// 從 Vite 環境變數讀取 API 位址
const API_URL = import.meta.env.VITE_API_URL

function App() {
  // 任務列表資料
  const [tasks, setTasks] = useState([])
  // 表單欄位狀態
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Todo')
  // 目前是否處於編輯模式，null 代表新增模式
  const [editingId, setEditingId] = useState(null)
  // 目前列表篩選條件，空字串代表顯示全部
  const [filterStatus, setFilterStatus] = useState('')
  // 提示訊息內容
  const [message, setMessage] = useState('')
  // 提示訊息種類：success / danger
  const [messageType, setMessageType] = useState('success')

  // 讀取任務列表，若有 filterStatus 則帶上 query string
  const loadTasks = () => {
    const url = filterStatus
      ? `${API_URL}?status=${filterStatus}`
      : API_URL

    fetch(url)
    .then(response => response.json())
    .then(data => setTasks(data))
    .catch(error => console.error('Error fetching tasks: ', error))
  }

  // 頁面載入抓資料，當 filterStatus 改變時，重新載入列表
  useEffect(() => {
    loadTasks()
  }, [filterStatus])

  // 重設表單狀態，回到新增模式
  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setStatus('Todo')
  }

  // 新增或更新任務
  const handleSubmit = async (e) => {
    e.preventDefault()

    const taskData = {
      title,
      description,
      status
    }

    try {
      // 如果 editingId 有值，代表目前是更新模式，使用 PUT
      // 否則就是新增模式，使用 POST
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
        }
      )

      if(!response.ok) throw new Error(editingId ? 'Failed to update task' : 'Failed to create task')
      
      showMessage(editingId ? 'Task updated successfully.' : 'Task created successfully.', 'success')

      // 成功後重設表單並重新載入列表
      resetForm()
      loadTasks()
    }catch (error) {
      console.error('Error submitting task: ', error)
      showMessage('Failed to submit task.', 'danger')
    }
  }

  // 點擊 Edit 時，把該筆 task 的資料帶入表單
  const handleEdit = (task) => {
    setEditingId(task.id)
    setTitle(task.title)
    setDescription(task.description || '')
    setStatus(task.status)
  }

  // 刪除任務
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`,{
        method: 'DELETE'
      })

      if(!response.ok) throw new Error('Failed to delete task')

      showMessage('Task deleted successfully.', 'success')
      
      loadTasks()
    }catch(error) {
      console.error('Error deleting task: ', error)
      showMessage('Failed to delete task.', 'danger')
    }
  }

  // 顯示提示訊息，幾秒後自動清除
  const showMessage = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)

    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  return (
    <div className="container py-3 py-md-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          {/* 頁面標題 */}
          <div className="mb-3 mb-md-4">
            <h1 className="fw-bold fs-3 fs-md-2">Task Management UI</h1>
            <p className="text-muted mb-0 small small-md-normal">
              Simple React frontend integrated with ASP.NET Core Task API.
            </p>
          </div>

          {/* 操作提示訊息 */}
          {message && (
            <div className={`alert alert-${messageType} mt-3`} role="alert">
              {message}
            </div>
          )}

          <div className="row g-3 g-md-4">
            {/* 左側：表單區 */}
            <div className="col-12 col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="card-title mb-3">
                    {editingId ? 'Edit Task' : 'Add Task'}
                  </h4>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="Todo">Todo</option>
                        <option value="Doing">Doing</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>

                    <div className="d-grid gap-2 d-md-flex">
                      <button type="submit" className="btn btn-primary">
                        {editingId ? 'Update Task' : 'Add Task'}
                      </button>

                      {editingId && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={resetForm}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* 右側：列表區 */}
            <div className="col-12 col-md-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
                    <div>
                      <h4 className="card-title mb-0">Task List</h4>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      {/*狀態篩選 */}
                      <select
                        className="form-select form-select-sm"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{maxWidthwidth: '140px'}}>
                        <option value="">All</option>
                        <option value="Todo">Todo</option>
                        <option value="Doing">Doing</option>
                        <option value="Done">Done</option>
                      </select>
                      <span className="badge text-bg-secondary">
                        Total: {tasks.length}
                      </span>
                    </div>
                  </div>

                  {tasks.length === 0 ? (
                    <p className="text-muted mb-0">No tasks found.</p>
                  ) : (
                    <div className="list-group">
                      {tasks.map(task => (
                        <div
                          key={task.id}
                          className="list-group-item list-group-item-action"
                        >
                          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                            <div className="w-100">
                              <h5 className="mb-1">{task.title}</h5>
                              <p className="mb-2 text-muted">
                                {task.description || 'No description'}
                              </p>
                              <span className="badge text-bg-light border">
                                {task.status}
                              </span>
                            </div>

                            <div className="d-flex gap-2 w-100 w-md-auto">
                              <button
                                className="btn btn-sm btn-outline-primary flex-fill"
                                onClick={() => handleEdit(task)}
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger flex-fill"
                                onClick={() => handleDelete(task.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App;