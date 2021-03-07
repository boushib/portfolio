import Testimonial from './Testimonial'
import './Testimonials.scss'

const Testimonials: React.FC = () => (
  <div className="testimonials">
    <div className="container">
      <h2>Happy Clients</h2>
      <div className="testimonials-list">
        <Testimonial />
        <Testimonial />
        <Testimonial />
      </div>
    </div>
  </div>
)

export default Testimonials
