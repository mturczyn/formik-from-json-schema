import viteLogo from '/vite.svg'
import './App.css'
import { SignupForm } from './formik-pilot/signup'

function App() {
    return (
        <>
            <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <SignupForm />
        </>
    )
}

export default App
