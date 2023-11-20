import { Routes, Route, Outlet } from 'react-router-dom';

import { AuthProvider } from './components/core/contexts/AuthContext';

import { RouteGuardPublic } from './components/core/guards/RouteGuardPublic';
import { RoutGuardAuthenticated } from './components/core/guards/RouteGuardAuthenticated';

import Home from './components/features/home/Home';
import About from './components/features/about/About';
import Header from './components/features/header/Header';
import Footer from './components/features/footer/Footer';
import Login from './components/features/users/login/Login';
import Logout from './components/features/users/logout/Logout';
import Profile from './components/features/users/profile/Profile';
import Register from './components/features/users/register/Register';
import ListMemes from './components/features/meme/list-memes/ListMemes';
import NotFound404 from './components/features/not-found-404/NotFound404';
import CreateMeme from './components/features/meme/create-meme/CreateMeme';
import DetailsMeme from './components/features/meme/details-meme/DetailsMeme';
import ListUserMemes from './components/features/meme/list-user-memes/ListUserMemes';

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
                                <Route path='create' element={<CreateMeme />} />
                                {/*<Route path='edit/:memeId' element={< />} />
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
