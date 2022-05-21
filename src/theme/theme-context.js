//in file theme-context.js
import React from 'react'

export const themes = {
  light: {
    tab_view: '#F2F2F2',
    tab_text: '#000',
    tab_selected_text: '#05C25E',
    base_view: '#ededed',
    base_body: '#fff',
    link_color: '#00474f',
    text1: '#111', //主要
    text2: '#888888', //次要
    border_color: '#DDDDE1',
    // link_color_2: '',
    green_color: '#73d13d',
    line: '#f0f0f0',
    off_line_view: '#ffccc7',
    off_line_text: '#1f1f1f',
    icon_view: '#d9d9d9',
    QR_code_view: '#fff',
    QR_code_text: '#000',
    split_line: '#f0f0f0'
  },
  dark: {
    tab_view: '#141414',
    tab_text: '#fff',
    tab_selected_text: '#05C25E',
    base_view: '#111',
    base_body: '#181818',
    link_color: '#08979c',
    text1: '#fafafa',
    text2: '#888888',
    border_color: '#595959',
    green_color: '#73d13d',
    line: '#262626',
    off_line_view: '#f5222d',
    off_line_text: '#fff1f0',
    icon_view: '#262626',
    QR_code_view: '#000',
    QR_code_text: '#fff',
    split_line: '#434343'
  }
}

const initialState = {
  status: 'light',
  theme: themes.light,
  toggle: () => { }
}

const ThemeContext = React.createContext(initialState)

function ThemeProvider({ children, defaultTheme = 'light' }) {
  // console.log('查看主题传入', defaultTheme)
  const [status, setStatus] = React.useState(defaultTheme) // Default theme is light

  React.useEffect(() => {
    toggle(defaultTheme)
  }, [defaultTheme])

  const toggle = (value) => {
    setStatus(value)
  }

  const theme = status === 'light' ? themes.light : themes.dark
  // console.log('最终展示主题:', status)
  return (
    <ThemeContext.Provider value={{ theme, status, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
export { ThemeProvider, ThemeContext }