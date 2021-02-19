import Navbar from './Navbar'
import './HomePageHeader.scss'
import Rocket from '../assets/img/rocket.svg'
import CloudsForeground from '../assets/img/clouds-foreground.svg'
import CloudsBackground from '../assets/img/clouds-background.svg'

const HomePageHeader = () => (
  <header>
    <Navbar />
    <div className="container">
      <div className="hero">
        <h2>👋 El Hassane here</h2>
        <h1>
          I’m a Software engineer <br />
          &amp; Open Source enthusiast
        </h1>
        <p>
          I have over 7 years of experience in the industry, <br />
          with small, medium & large businesses.
        </p>
        <div className="btn-group">
          <button className="btn">Hire me</button>
          <button className="btn outlined">Resume</button>
        </div>
      </div>
      <img className="rocket" src={Rocket} alt="rocket" />
      <img className="clouds background" src={CloudsBackground} alt="clouds" />
      <img className="clouds foreground" src={CloudsForeground} alt="clouds" />
    </div>
  </header>
)

export default HomePageHeader
