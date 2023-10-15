import React from 'react'
import { UserProfile } from './types/UserType'
import { CategoryType } from './types/CategoryType'
import { DistrictType } from './types/DistrictType'

type AppState = {
  user: UserProfile | null
  category: CategoryType
  district: DistrictType
  logoutModalOpen?: boolean
}

type Action =
  | { type: 'USER_SIGNIN'; payload: UserProfile }
  | { type: 'USER_SIGNOUT' }
  | { type: 'CATEGORY_CHANGE'; payload: CategoryType }
  | { type: 'DISTRICT_CHANGE'; payload: DistrictType }
  | { type: 'TOGGLE_LOGOUT_MODAL' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'USER_SIGNIN':
      localStorage.setItem('user', JSON.stringify(action.payload))
      return { ...state, user: action.payload }
    case 'USER_SIGNOUT':
      localStorage.removeItem('user')
      return { ...state, user: null }
    case 'CATEGORY_CHANGE':
      localStorage.setItem('category', action.payload)
      localStorage.setItem('district', 'norge')
      return { ...state, category: action.payload, district: 'norge' }
    case 'DISTRICT_CHANGE':
      localStorage.setItem('district', action.payload)
      localStorage.setItem('category', 'alle')
      return { ...state, district: action.payload, category: 'alle' }
    case 'TOGGLE_LOGOUT_MODAL':
      localStorage.setItem(
        'logoutModalOpen',
        JSON.stringify(!state.logoutModalOpen)
      )
      return { ...state, logoutModalOpen: !state.logoutModalOpen }
    default:
      return state
  }
}

const initialState: AppState = {
  category: (localStorage.getItem('category') as CategoryType) || 'alle',
  district: (localStorage.getItem('district') as DistrictType) || 'norge',
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '{}')
    : null,
  logoutModalOpen: localStorage.getItem('logoutModalOpen') === 'true' || false,
}

const defaultDispatch = (): never => {
  throw new Error('Forgot to wrap component in a StoreProvider')
}

type StoreContextValue = {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const NewsContext = React.createContext<StoreContextValue>({
  state: initialState,
  dispatch: defaultDispatch,
})

function NewsProvider(props: React.PropsWithChildren<object>) {
  const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
    reducer,
    initialState
  )
  return <NewsContext.Provider value={{ state, dispatch }} {...props} />
}

export { NewsContext, NewsProvider }
