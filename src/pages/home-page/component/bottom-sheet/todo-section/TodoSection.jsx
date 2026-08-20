import TodoCard from '../todo-card/TodoCard'

import './TodoSection.css'

function TodoSection({ todos, completedCount, onEdit }) {
  return (
    <section className='todoSection'>
      <div className='todoSection__header'>
        <h2 className='todoSection__title'>투두 리스트</h2>

        <p className='todoSection__description'>
          {todos.length}개 중 {completedCount}개를 완료했어요
        </p>
      </div>

      <div className='todoList'>
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onEdit={onEdit} />
        ))}
      </div>
    </section>
  )
}

export default TodoSection
