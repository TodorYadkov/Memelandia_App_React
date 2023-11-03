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
                    {/* <Home /> */}
                    {/* <Login /> */}
                    {/* <Register /> */}
                    {/* <ListMemes /> */}
                    {/* <DetailsMeme /> */}
                    {/* <About /> */}
                    {/* <Profile /> */}
                </div >
            </main >
            <Footer />
        </>
    );
}

export default App;
