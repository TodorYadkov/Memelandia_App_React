import { Routes, Route, Outlet } from 'react-router-dom';

import { AuthProvider } from './components/core/contexts/AuthContext';

import { RouteGuardPublic } from './components/core/guards/RouteGuardPublic';
import { RoutGuardAuthenticated } from './components/core/guards/RouteGuardAuthenticated';

import About from './components/features/about/About';
import Footer from './components/features/footer/Footer';
import Header from './components/features/header/Header';
import Home from './components/features/home/Home';
import DetailsMeme from './components/features/meme/details-meme/DetailsMeme';
import ListMemes from './components/features/meme/list-memes/ListMemes';
import Login from './components/features/users/login/Login';
import Profile from './components/features/users/profile/Profile';
import Register from './components/features/users/register/Register';
import ListUserMemes from './components/features/meme/list-user-memes/ListUserMemes';
import Logout from './components/features/users/logout/Logout';
import NotFound404 from './components/features/not-found-404/NotFound404';


function App() {

    return (
        <AuthProvider>
            <Header />
            <main className="site-main container">
                <div className="site-main-background-wrapper">
                    <Routes>
                        <Route path='/' element={<Home />} />

                        {/* Public routes */}
                        <Route element={<RouteGuardPublic />}>
                            <Route path='/login' element={<Login />} />
                            <Route path='/register' element={<Register />} />
                            <Route path='/about' element={<About />} />
                        </Route>

                        {/* Private routes */}
                        <Route element={<RoutGuardAuthenticated />}>
                            <Route path='/logout' element={<Logout />} />
                            <Route path='/profile' element={<Profile />} />
                        </Route>
                        {/* Main meme route */}
                        <Route path='/memes/' element={<Outlet />}>
                            <Route path='catalog' element={<ListMemes />} />
                            <Route path='user-memes/:userId' element={<ListUserMemes />} />
                            <Route path='details/:memeId' element={<DetailsMeme />} />

                            {/* Private meme routes */}
                            <Route element={<RoutGuardAuthenticated />}>
                                {/*<Route path='create' element={< />} />
                                <Route path='edit/:memeId' element={< />} />
                                <Route path='delete/:memeId' element={< />} /> */}
                            </Route>
                        </Route>

                        <Route path='*' element={<NotFound404 />} />
                    </Routes>
                </div >
            </main >
            <Footer />
        </AuthProvider>
    );
}

export default App;
