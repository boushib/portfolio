import Feature from './Feature'
import './WhyChooseMe.scss'

const features = [
  {
    icon: 'code',
    title: 'clean Code',
    description:
      'Proin varius cum sapien hendrerit massa purus pretium, porta pharetra. Diam eget eu congue tristique ullamcorper ',
  },
  {
    icon: 'documentation',
    title: 'Well Documented',
    description:
      'Proin varius cum sapien hendrerit massa purus pretium, porta pharetra. Diam eget eu congue tristique ullamcorper ',
  },
  {
    icon: 'rating',
    title: '5 Stars Rated',
    description:
      'Proin varius cum sapien hendrerit massa purus pretium, porta pharetra. Diam eget eu congue tristique ullamcorper ',
  },
  {
    icon: 'support',
    title: 'Support',
    description:
      'Proin varius cum sapien hendrerit massa purus pretium, porta pharetra. Diam eget eu congue tristique ullamcorper ',
  },
]

const WhyChooseMe: React.FC = () => (
  <div className="why-choose-me">
    <div className="container">
      <h2>Why Choose Me</h2>
      <div className="features">
        {features.map(f => (
          <Feature icon={f.icon} title={f.title} description={f.description} key={f.icon} />
        ))}
      </div>
    </div>
  </div>
)

export default WhyChooseMe
