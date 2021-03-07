import './Feature.scss'

type FeatureType = {
  title: string
  icon: string
  description: string
}

const Feature: React.FC<FeatureType> = ({ icon, title, description }) => {
  const image = require(`../assets/img/${icon}.svg`)
  return (
    <div className="feature">
      <img src={image.default} alt={icon} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default Feature
