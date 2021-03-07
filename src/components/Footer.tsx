import './Footer.scss'

import LinkedIn from '../assets/img/linkedin.svg'
import GitHub from '../assets/img/github.svg'
import Twitter from '../assets/img/twitter.svg'
import Facebook from '../assets/img/facebook.svg'
import Instagram from '../assets/img/instagram.svg'
import Whatsapp from '../assets/img/whatsapp.svg'

const Footer: React.FC = () => (
  <footer>
    <div className="container">
      <h2>Do you have a project? Let's talk</h2>
      <p>Got a project in mind? Drop me a line and let's make something awesome together.</p>
      <form>
        <input type="text" name="name" placeholder="Full name" />
        <input type="email" name="email" placeholder="Email address" />
        <input type="text" name="timeframe" placeholder="Choose a timeframe" />
        <input type="text" name="budget" placeholder="Choose a budget" />
        <textarea name="message" placeholder="How can I help you?"></textarea>
        <button className="btn">Let's work together</button>
      </form>
      <div className="social">
        <img src={LinkedIn} alt="linkedin" />
        <img src={GitHub} alt="github" />
        <img src={Twitter} alt="twitter" />
        <img src={Facebook} alt="facebook" />
        <img src={Instagram} alt="instagram" />
        <img src={Whatsapp} alt="whatsapp" />
      </div>
      <div className="copy">All rights reserved &copy; 2021 ElB</div>
    </div>
  </footer>
)

export default Footer
