import Advertisement from "../components/Advertisement";
import Announcement from "../components/Announcement"
import Feature from "../components/Feature";
import Footer from "../components/Footer";
import Header from "../components/Header"
import Navbar from "../components/Navbar"


const Home = () => {
    return (
        <div>
            <Announcement/>
            <Navbar/>
            <Header/>
            <Advertisement/>
            <Feature/>
            <Footer/>
        </div>
    )
}

export default Home