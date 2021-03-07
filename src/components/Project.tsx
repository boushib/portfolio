import './Project.scss'

type Props = {
  id: string
  title: string
  imageURL: string
  description: string
}

const Project: React.FC<Props> = ({ id, title, imageURL, description }) => {
  const image = require(`../assets/img/${id}.jpg`)
  return (
    <div className="project" style={{ backgroundImage: `url('${image.default}')` }}>
      <div className="overlay">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default Project
