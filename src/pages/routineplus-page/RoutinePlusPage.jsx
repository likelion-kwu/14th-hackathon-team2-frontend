import { useEffect, useState } from 'react'

import { createRoutine, getVerificationObjects } from '../../api/routineApi'

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
    code: 'SKIN',
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
    code: 'WELL_BEING',
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
    code: 'HEALTH_FIT',
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
    code: 'DIET',
    name: 'Diet',
    defaultImage: dietDefault,
    activeImage: dietActive,
    characterImage: dietCharacter,
    color: '#7952e8',
    softColor: '#f5f1ff',
    placeholder: '샐러드 섭취하기',
  },
]

const DAY_OPTIONS = [
  {
    code: 'MON',
    label: '월',
  },
  {
    code: 'TUE',
    label: '화',
  },
  {
    code: 'WED',
    label: '수',
  },
  {
    code: 'THU',
    label: '목',
  },
  {
    code: 'FRI',
    label: '금',
  },
  {
    code: 'SAT',
    label: '토',
  },
  {
    code: 'SUN',
    label: '일',
  },
]

const ALL_DAY_CODES = DAY_OPTIONS.map((day) => day.code)

const VERIFICATION_OBJECT_LABELS = {
  CUP: '컵',
  WATER_BOTTLE: '물병',
  COSMETIC_CONTAINER: '화장품 용기',
  TOWEL: '수건',
  TOOTHBRUSH: '칫솔',
  SUPPLEMENT_CONTAINER: '영양제 용기',
}

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

function findInitialCategory(initialRoutine) {
  if (!initialRoutine) return null

  const categoryCode = initialRoutine.categoryCode ?? initialRoutine.category

  return CATEGORY_LIST.find((category) => category.code === categoryCode) ?? null
}

function getVerificationObjectLabel(code) {
  return VERIFICATION_OBJECT_LABELS[code] ?? code
}

function normalizeVerificationObjects(response) {
  let objects = []

  if (Array.isArray(response)) {
    objects = response
  } else if (Array.isArray(response?.data)) {
    objects = response.data
  } else if (Array.isArray(response?.items)) {
    objects = response.items
  } else if (Array.isArray(response?.verificationObjects)) {
    objects = response.verificationObjects
  }

  return objects
    .map((item) => {
      if (typeof item === 'string') {
        return {
          code: item,
          label: getVerificationObjectLabel(item),
        }
      }

      const code = item.code ?? item.value

      if (!code) return null

      return {
        code,
        label: item.displayName ?? item.label ?? item.name ?? getVerificationObjectLabel(code),
      }
    })
    .filter(Boolean)
}

function getRepeatPayload(selectedDays) {
  const orderedDays = DAY_OPTIONS.map((day) => day.code).filter((code) =>
    selectedDays.includes(code),
  )

  if (orderedDays.length === ALL_DAY_CODES.length) {
    return {
      repeatType: 'DAILY',
    }
  }

  return {
    repeatType: 'DAYS_OF_WEEK',
    daysOfWeek: orderedDays,
  }
}

function isValidTimeRange(startTime, endTime) {
  return startTime && endTime && startTime < endTime
}

function RoutinePlusPage({ initialRoutine = null, onClose, onCreated }) {
  const initialCategory = findInitialCategory(initialRoutine)

  const [screen, setScreen] = useState(initialCategory ? 'routine' : 'select')

  const [hoveredCategory, setHoveredCategory] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  const [routineName, setRoutineName] = useState(
    initialRoutine?.content ?? initialRoutine?.title ?? '',
  )

  const [selectedDays, setSelectedDays] = useState([])
  const [routineStartTime, setRoutineStartTime] = useState('')
  const [routineEndTime, setRoutineEndTime] = useState('')

  const [routineVerificationObject, setRoutineVerificationObject] = useState(
    initialRoutine?.recommendedVerificationObject ?? '',
  )

  const [todoName, setTodoName] = useState('')
  const [todoDate, setTodoDate] = useState('')
  const [todoStartTime, setTodoStartTime] = useState('')
  const [todoEndTime, setTodoEndTime] = useState('')
  const [todoVerificationObject, setTodoVerificationObject] = useState('')

  const [verificationObjects, setVerificationObjects] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isSubmitting, onClose])

  useEffect(() => {
    let isMounted = true

    const loadVerificationObjects = async () => {
      try {
        const response = await getVerificationObjects()

        if (!isMounted) return

        setVerificationObjects(normalizeVerificationObjects(response))
      } catch (error) {
        console.error('인증 물건 목록을 불러오지 못했습니다.', error)
      }
    }

    loadVerificationObjects()

    return () => {
      isMounted = false
    }
  }, [])

  const getVerificationOptions = (selectedValue) => {
    if (!selectedValue || verificationObjects.some((item) => item.code === selectedValue)) {
      return verificationObjects
    }

    return [
      {
        code: selectedValue,
        label: getVerificationObjectLabel(selectedValue),
      },
      ...verificationObjects,
    ]
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setSubmitError('')
    setScreen('routine')
  }
  const handleDayClick = (dayCode) => {
    setSelectedDays((previousDays) => {
      if (previousDays.includes(dayCode)) {
        return previousDays.filter((code) => code !== dayCode)
      }

      return [...previousDays, dayCode]
    })

    setSubmitError('')
  }

  const handleEverydayClick = () => {
    setSelectedDays((previousDays) => {
      if (previousDays.length === ALL_DAY_CODES.length) {
        return []
      }

      return [...ALL_DAY_CODES]
    })

    setSubmitError('')
  }
  const handleRoutineSubmit = async (event) => {
    event.preventDefault()

    const trimmedRoutineName = routineName.trim()

    if (!trimmedRoutineName) {
      setSubmitError('추가할 루틴을 입력해 주세요.')
      return
    }

    if (selectedDays.length === 0) {
      setSubmitError('루틴을 진행할 요일을 선택해 주세요.')
      return
    }

    if (!isValidTimeRange(routineStartTime, routineEndTime)) {
      setSubmitError('종료 시간은 시작 시간보다 늦어야 합니다.')
      return
    }

    if (!routineVerificationObject) {
      setSubmitError('인증 물건을 선택해 주세요.')
      return
    }

    const repeatPayload = getRepeatPayload(selectedDays)

    const newRoutine = {
      category: selectedCategory.code,
      content: trimmedRoutineName,
      startTime: routineStartTime,
      endTime: routineEndTime,
      ...repeatPayload,
      verificationObject: routineVerificationObject,
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const createdRoutine = await createRoutine(newRoutine)

      onCreated?.(createdRoutine)
      onClose()

      if (createdRoutine?.appliedToCurrentServiceDate === false) {
        const effectiveFrom = createdRoutine.effectiveFrom

        window.setTimeout(() => {
          window.alert(
            effectiveFrom
              ? `루틴이 추가되었습니다. 오늘의 루틴은 이미 시작되어 ${effectiveFrom}부터 적용됩니다.`
              : '루틴이 추가되었습니다. 오늘의 루틴은 이미 시작되어 다음 반복일부터 적용됩니다.',
          )
        }, 0)
      }
    } catch (error) {
      console.error('루틴을 추가하지 못했습니다.', error)

      setSubmitError(error.message ?? '루틴을 추가하지 못했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleTodoSubmit = async (event) => {
    event.preventDefault()

    if (!isValidTimeRange(todoStartTime, todoEndTime)) {
      setSubmitError('종료 시간은 시작 시간보다 늦어야 합니다.')
      return
    }

    const newTodo = {
      category: 'TO_DO',
      content: todoName.trim(),
      scheduledDate: todoDate,
      startTime: todoStartTime,
      endTime: todoEndTime,
      repeatType: 'ONCE',
      daysOfWeek: [],
      verificationObject: todoVerificationObject,
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const createdTodo = await createRoutine(newTodo)

      setIsSubmitting(false)
      onCreated?.(createdTodo)
      onClose()
    } catch (error) {
      console.error('투두를 추가하지 못했습니다.', error)

      setSubmitError(error.message ?? '투두를 추가하지 못했습니다.')

      setIsSubmitting(false)
    }
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose()
    }
  }

  const routineVerificationOptions = getVerificationOptions(routineVerificationObject)

  const todoVerificationOptions = getVerificationOptions(todoVerificationObject)

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
            onClick={() => {
              setSubmitError('')
              setScreen('todo')
            }}
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
            disabled={isSubmitting}
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
                시간과 요일을 확인한 뒤
                <br />
                루틴을 추가해 주세요
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
                <div className='routinePlus__daySetting'>
                  <div className='routinePlus__dayHeader'>
                    <span className='routinePlus__settingLabel'>요일</span>

                    <button
                      type='button'
                      className={`routinePlus__everydayButton ${
                        selectedDays.length === ALL_DAY_CODES.length
                          ? 'routinePlus__everydayButton--selected'
                          : ''
                      }`}
                      aria-pressed={selectedDays.length === ALL_DAY_CODES.length}
                      onClick={handleEverydayClick}
                    >
                      매일
                    </button>
                  </div>

                  <div className='routinePlus__dayButtons'>
                    {DAY_OPTIONS.map((day) => {
                      const isSelected = selectedDays.includes(day.code)

                      return (
                        <button
                          key={day.code}
                          type='button'
                          className={`routinePlus__dayButton ${
                            isSelected ? 'routinePlus__dayButton--selected' : ''
                          }`}
                          aria-pressed={isSelected}
                          onClick={() => handleDayClick(day.code)}
                        >
                          {day.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <label className='routinePlus__settingRow'>
                  <span className='routinePlus__settingLabel'>시작 시간</span>

                  <input
                    type='time'
                    value={routineStartTime}
                    aria-label='시작 시간'
                    required
                    onChange={(event) => setRoutineStartTime(event.target.value)}
                  />
                </label>

                <label className='routinePlus__settingRow'>
                  <span className='routinePlus__settingLabel'>종료 시간</span>

                  <input
                    type='time'
                    value={routineEndTime}
                    aria-label='종료 시간'
                    required
                    onChange={(event) => setRoutineEndTime(event.target.value)}
                  />
                </label>

                <SettingSelect
                  label='인증 물건'
                  value={routineVerificationObject}
                  required
                  onChange={(event) => setRoutineVerificationObject(event.target.value)}
                >
                  {routineVerificationOptions.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </SettingSelect>
              </div>
            </div>

            {submitError && (
              <p className='routinePlus__error' role='alert'>
                {submitError}
              </p>
            )}

            <button type='submit' className='routinePlus__submitButton' disabled={isSubmitting}>
              {isSubmitting ? '추가 중...' : '루틴 추가하기'}
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
            disabled={isSubmitting}
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
                  placeholder='영양제 챙기기'
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
              <h3 className='routinePlus__sectionTitle'>투두 세부 설정</h3>

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
                  <span className='routinePlus__settingLabel'>시작 시간</span>

                  <input
                    type='time'
                    value={todoStartTime}
                    aria-label='시작 시간'
                    required
                    onChange={(event) => setTodoStartTime(event.target.value)}
                  />
                </label>

                <label className='routinePlus__settingRow'>
                  <span className='routinePlus__settingLabel'>종료 시간</span>

                  <input
                    type='time'
                    value={todoEndTime}
                    aria-label='종료 시간'
                    required
                    onChange={(event) => setTodoEndTime(event.target.value)}
                  />
                </label>

                <SettingSelect
                  label='인증 물건'
                  value={todoVerificationObject}
                  required
                  onChange={(event) => setTodoVerificationObject(event.target.value)}
                >
                  {todoVerificationOptions.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </SettingSelect>
              </div>
            </div>

            {submitError && (
              <p className='routinePlus__error' role='alert'>
                {submitError}
              </p>
            )}

            <button
              type='submit'
              className='routinePlus__submitButton routinePlus__todoSubmitButton'
              disabled={isSubmitting}
            >
              {isSubmitting ? '추가 중...' : '투두 추가하기'}
            </button>
          </form>
        </section>
      )}
    </div>
  )
}

export default RoutinePlusPage
