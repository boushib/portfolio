import HomePageHeader from './components/HomePageHeader'
import './App.scss'
import WhyChooseMe from './components/WhyChooseMe'
import Technologies from './components/Technologies'
import Projects from './components/Projects'

const App = () => (
  <div className="app">
    <HomePageHeader />
    <WhyChooseMe />
    <Technologies />
    <Projects />
  </div>
)

export default App
