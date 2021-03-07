import './TechnologyList.scss'

type Props = {
  technologies: string[]
}

const TechnologyList: React.FC<Props> = ({ technologies }) => (
  <ul className="technology-list">
    {technologies.map(t => (
      <li key={t}>{t}</li>
    ))}
  </ul>
)

export default TechnologyList
