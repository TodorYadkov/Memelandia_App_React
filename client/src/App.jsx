import { Routes, Route, Outlet } from 'react-router-dom';

import About from './components/features/about/About';
import Footer from './components/features/footer/Footer';
import Header from './components/features/header/Header';
import Home from './components/features/home/Home';
import DetailsMeme from './components/features/meme/details-meme/DetailsMeme';
import ListMemes from './components/features/meme/list-memes/ListMemes';
import Login from './components/features/users/login/Login';
import Profile from './components/features/users/profile/Profile';
import Register from './components/features/users/register/Register';


function App() {

    return (
        <>
            <Header />
            <main className="site-main container">
                <div className="site-main-background-wrapper">
                    <Routes>
                        <Route path='/' element={<Home />} />

                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/profile' element={<Profile />} />

                        <Route path='/memes/' element={<Outlet />}>
                            <Route path='catalog' element={<ListMemes />} />
                            <Route path='details/:memeId' element={<DetailsMeme />} />
                            {/* <Route path='edit/:memeId' element={< />} />
                            <Route path='delete/:memeId' element={< />} /> */}
                        </Route>

                        <Route path='/about' element={<About />} />
                    </Routes>
                </div >
            </main >
            <Footer />
        </>
    );
}

export default App;
