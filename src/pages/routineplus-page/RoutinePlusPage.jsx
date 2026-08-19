import { useEffect, useState } from 'react'

import skinDefault from '../../assets/icons/icons-track/image-skin-default.svg'
import skinActive from '../../assets/icons/icons-track/image-skin-active.svg'
import wellbeingDefault from '../../assets/icons/icons-track/image-wellbeing-default.svg'
import wellbeingActive from '../../assets/icons/icons-track/image-wellbeing-active.svg'
import healthDefault from '../../assets/icons/icons-track/image-health-default.svg'
import healthActive from '../../assets/icons/icons-track/image-health-active.svg'
import dietDefault from '../../assets/icons/icons-track/image-diet-default.svg'
import dietActive from '../../assets/icons/icons-track/image-diet-active.svg'

import skinCharacter from '../../assets/home-bottom-sheet/character/image-skin.svg'
import wellbeingCharacter from '../../assets/home-bottom-sheet/character/image-wellbeing.svg'
import healthCharacter from '../../assets/home-bottom-sheet/character/image-health.svg'
import dietCharacter from '../../assets/home-bottom-sheet/character/image-diet.svg'

import './RoutinePlusPage.css'

const CATEGORY_LIST = [
  {
    id: 'skin',
    name: 'Skin',
    defaultImage: skinDefault,
    activeImage: skinActive,
    characterImage: skinCharacter,
    color: '#5270e7',
    softColor: '#f2f4ff',
    placeholder: '세안 후 보습제 바르기',
  },
  {
    id: 'wellbeing',
    name: 'Well-being',
    defaultImage: wellbeingDefault,
    activeImage: wellbeingActive,
    characterImage: wellbeingCharacter,
    color: '#ec7a3d',
    softColor: '#fff5f0',
    placeholder: '잠들기 전 명상하기',
  },
  {
    id: 'health',
    name: 'Health & Fit',
    defaultImage: healthDefault,
    activeImage: healthActive,
    characterImage: healthCharacter,
    color: '#d45072',
    softColor: '#fff1f5',
    placeholder: '일어나서 스트레칭하기',
  },
  {
    id: 'diet',
    name: 'Diet',
    defaultImage: dietDefault,
    activeImage: dietActive,
    characterImage: dietCharacter,
    color: '#7952e8',
    softColor: '#f5f1ff',
    placeholder: '샐러드 섭취하기',
  },
]

function SettingSelect({ label, value, onChange, children, required = false }) {
  return (
    <label className='routinePlus__settingRow'>
      <span className='routinePlus__settingLabel'>{label}</span>

      <span className='routinePlus__settingControl'>
        <select value={value} aria-label={label} required={required} onChange={onChange}>
          <option value=''>선택</option>
          {children}
        </select>

        <span className='routinePlus__arrow' aria-hidden='true'>
          ›
        </span>
      </span>
    </label>
  )
}

function RoutinePlusPage({ onClose, onAddRoutine, onAddTodo }) {
  const [screen, setScreen] = useState('select')
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const [routineName, setRoutineName] = useState('')
  const [routineDay, setRoutineDay] = useState('')
  const [routineTime, setRoutineTime] = useState('')
  const [routineVerification, setRoutineVerification] = useState('')

  const [todoName, setTodoName] = useState('')
  const [todoDate, setTodoDate] = useState('')
  const [todoTime, setTodoTime] = useState('')
  const [todoVerification, setTodoVerification] = useState('')

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setScreen('routine')
  }

  const handleRoutineSubmit = (event) => {
    event.preventDefault()

    const newRoutine = {
      category: selectedCategory.id,
      name: routineName.trim(),
      day: routineDay,
      time: routineTime,
      verification: routineVerification,
    }

    onAddRoutine?.(newRoutine)
    onClose()
  }

  const handleTodoSubmit = (event) => {
    event.preventDefault()

    const newTodo = {
      name: todoName.trim(),
      date: todoDate,
      time: todoTime,
      verification: todoVerification,
    }

    onAddTodo?.(newTodo)
    onClose()
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className='routinePlus__layer'
      role='dialog'
      aria-modal='true'
      aria-label='루틴 추가'
      onPointerDown={handleBackdropClick}
    >
      {screen === 'select' && (
        <section className='routinePlus__sheet routinePlus__selectSheet'>
          <button
            type='button'
            className='routinePlus__dragHandle'
            aria-label='팝업 닫기'
            onClick={onClose}
          />

          <h2 className='routinePlus__selectTitle'>추가할 항목 선택하기</h2>

          <div className='routinePlus__categoryGrid'>
            {CATEGORY_LIST.map((category) => {
              const isHovered = hoveredCategory === category.id

              return (
                <button
                  key={category.id}
                  type='button'
                  className='routinePlus__categoryButton'
                  aria-label={`${category.name} 루틴 추가`}
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onFocus={() => setHoveredCategory(category.id)}
                  onBlur={() => setHoveredCategory(null)}
                  onClick={() => handleCategoryClick(category)}
                >
                  <img
                    src={isHovered ? category.activeImage : category.defaultImage}
                    alt=''
                    className='routinePlus__categoryImage'
                  />
                </button>
              )
            })}
          </div>

          <button
            type='button'
            className='routinePlus__todoSelectButton'
            onClick={() => setScreen('todo')}
          >
            투두 추가하기
          </button>
        </section>
      )}

      {screen === 'routine' && selectedCategory && (
        <section
          className='routinePlus__sheet routinePlus__detailSheet'
          style={{
            '--routine-accent': selectedCategory.color,
            '--routine-soft': selectedCategory.softColor,
          }}
        >
          <button
            type='button'
            className='routinePlus__dragHandle'
            aria-label='팝업 닫기'
            onClick={onClose}
          />

          <form className='routinePlus__form' onSubmit={handleRoutineSubmit}>
            <h2 className='routinePlus__detailTitle'>
              <span>{selectedCategory.name}</span> 루틴 추가하기
            </h2>

            <div className='routinePlus__characterArea'>
              <img
                src={selectedCategory.characterImage}
                alt={`${selectedCategory.name} 캐릭터`}
                className='routinePlus__characterImage'
              />

              <p className='routinePlus__speechBubble'>
                현재 지정되어 있는
                <br />
                시간대의 루틴이 대체돼
              </p>
            </div>

            <div className='routinePlus__inputSection'>
              <label htmlFor='routine-name' className='routinePlus__sectionTitle'>
                추가할 루틴
              </label>

              <div className='routinePlus__textField'>
                <input
                  id='routine-name'
                  type='text'
                  value={routineName}
                  placeholder={selectedCategory.placeholder}
                  required
                  onChange={(event) => setRoutineName(event.target.value)}
                />

                {routineName && (
                  <button
                    type='button'
                    className='routinePlus__clearButton'
                    aria-label='루틴 내용 지우기'
                    onClick={() => setRoutineName('')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className='routinePlus__settingSection'>
              <h3 className='routinePlus__sectionTitle'>루틴 세부 설정</h3>

              <div className='routinePlus__settingList'>
                <SettingSelect
                  label='요일'
                  value={routineDay}
                  required
                  onChange={(event) => setRoutineDay(event.target.value)}
                >
                  <option value='everyday'>매일</option>
                  <option value='weekday'>평일</option>
                  <option value='weekend'>주말</option>
                  <option value='monday'>월요일</option>
                  <option value='tuesday'>화요일</option>
                  <option value='wednesday'>수요일</option>
                  <option value='thursday'>목요일</option>
                  <option value='friday'>금요일</option>
                  <option value='saturday'>토요일</option>
                  <option value='sunday'>일요일</option>
                </SettingSelect>

                <SettingSelect
                  label='시간대'
                  value={routineTime}
                  required
                  onChange={(event) => setRoutineTime(event.target.value)}
                >
                  <option value='morning'>아침</option>
                  <option value='afternoon'>낮</option>
                  <option value='evening'>저녁</option>
                  <option value='night'>밤</option>
                </SettingSelect>

                <SettingSelect
                  label='루틴 인증'
                  value={routineVerification}
                  required
                  onChange={(event) => setRoutineVerification(event.target.value)}
                >
                  <option value='photo'>사진으로 인증</option>
                  <option value='check'>직접 완료하기</option>
                </SettingSelect>
              </div>
            </div>

            <button type='submit' className='routinePlus__submitButton'>
              루틴 추가하기
            </button>
          </form>
        </section>
      )}

      {screen === 'todo' && (
        <section className='routinePlus__sheet routinePlus__detailSheet routinePlus__todoSheet'>
          <button
            type='button'
            className='routinePlus__dragHandle'
            aria-label='팝업 닫기'
            onClick={onClose}
          />

          <form className='routinePlus__form' onSubmit={handleTodoSubmit}>
            <h2 className='routinePlus__detailTitle'>투두 추가하기</h2>

            <div className='routinePlus__inputSection routinePlus__todoInputSection'>
              <label htmlFor='todo-name' className='routinePlus__sectionTitle'>
                추가할 투두
              </label>

              <div className='routinePlus__textField'>
                <input
                  id='todo-name'
                  type='text'
                  value={todoName}
                  placeholder='샐러드 섭취하기'
                  required
                  onChange={(event) => setTodoName(event.target.value)}
                />

                {todoName && (
                  <button
                    type='button'
                    className='routinePlus__clearButton'
                    aria-label='투두 내용 지우기'
                    onClick={() => setTodoName('')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className='routinePlus__settingSection'>
              <h3 className='routinePlus__sectionTitle'>루틴 세부 설정</h3>

              <div className='routinePlus__settingList'>
                <label className='routinePlus__settingRow'>
                  <span className='routinePlus__settingLabel'>날짜</span>

                  <input
                    type='date'
                    value={todoDate}
                    aria-label='날짜'
                    required
                    onChange={(event) => setTodoDate(event.target.value)}
                  />
                </label>

                <label className='routinePlus__settingRow'>
                  <span className='routinePlus__settingLabel'>시간</span>

                  <input
                    type='time'
                    value={todoTime}
                    aria-label='시간'
                    required
                    onChange={(event) => setTodoTime(event.target.value)}
                  />
                </label>

                <SettingSelect
                  label='투두 인증'
                  value={todoVerification}
                  required
                  onChange={(event) => setTodoVerification(event.target.value)}
                >
                  <option value='photo'>사진으로 인증</option>
                  <option value='check'>직접 완료하기</option>
                </SettingSelect>
              </div>
            </div>

            <button
              type='submit'
              className='routinePlus__submitButton routinePlus__todoSubmitButton'
            >
              투두 추가하기
            </button>
          </form>
        </section>
      )}
    </div>
  )
}

export default RoutinePlusPage
