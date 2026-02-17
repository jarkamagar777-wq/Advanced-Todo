import React from 'react'
import TodoApp from './component/TodoApp'
import { Provider } from 'react-redux'
import { store } from './store/store'

const App = () => {
  return (
    <Provider store={store}>
      <TodoApp />
    </Provider>
  )
}

export default App