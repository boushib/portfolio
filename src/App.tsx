import HomePageHeader from './components/HomePageHeader'
import WhyChooseMe from './components/WhyChooseMe'
import Technologies from './components/Technologies'
import Projects from './components/Projects'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

import './App.scss'

const App = () => (
  <div className="app">
    <HomePageHeader />
    <WhyChooseMe />
    <Technologies />
    <Projects />
    <Testimonials />
    <Footer />
  </div>
)

export default App
