import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import './App.css';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NavigationBar from "./components/NavigationBar";
import MoviesPage from "./pages/MoviesPage";
import RegistrationPage from "./pages/RegistrationPage";

function App() {
    const [ user, setUser ] = useState({
        id: null,
        isAdmin: false
    })
    const unsetUser = () => {
        localStorage.clear();
        setUser({
            id: null,
            isAdmin: null
        })
    }

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (token) {
        setUser(jwtDecode(token));
        console.log(user)
      } else {
        setUser({
          id: null,
          isAdmin: null
        })
      }
    }, [])


    return (
        <>
        <UserProvider value={{user, setUser,unsetUser}}>
          <Router>
            <Container>
              <NavigationBar/>
              <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegistrationPage/>}/>
                <Route path="/movies" element={<MoviesPage/>}/>
              </Routes>
            </Container>
          </Router>
        </UserProvider>
        </>
    )
}

export default App;
