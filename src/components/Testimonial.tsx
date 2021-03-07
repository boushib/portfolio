import './Testimonial.scss'
import Star from '../assets/img/star.svg'
import Quote from '../assets/img/quote.svg'

const avatar = 'http://1.bp.blogspot.com/-iEmdF04n3KY/ToCoBLlvUvI/AAAAAAAACyU/_N8nZ1gQBVU/s1600/Tom+cruise.jpg'

const Testimonial: React.FC = () => (
  <div className="testimonial">
    <img src={Quote} className="quote-icon" alt="quote" />
    <div className="user-info">
      <div className="avatar" style={{ backgroundImage: `url('${avatar}')` }}></div>
      <div>
        <div className="username">John Smith</div>
        <div className="rating">
          <img src={Star} className="star-icon" alt="star" />
          <img src={Star} className="star-icon" alt="star" />
          <img src={Star} className="star-icon" alt="star" />
          <img src={Star} className="star-icon" alt="star" />
          <img src={Star} className="star-icon" alt="star" />
        </div>
      </div>
    </div>
    <div className="message">
      Tincidunt ut euismod facilisi semper mattis id posuere suscipit. Mi vivamus porttitor tincidunt tempor, vitae quis
      commodo. Dolor, cursus vitae, eu tincidunt massa.
    </div>
  </div>
)

export default Testimonial
