import './Technologies.scss'
import TechnologyList from './TechnologyList'

const technologies = [
  'HTML5',
  'CSS3/SCSS',
  'JavaScript',
  'TypeScript',
  'React.js',
  'Redux',
  'Vue.js',
  'Vuex',
  'Node.js',
  'Express.js',
  'PostgreSQL',
  'MongoDB',
  'Rest APIs',
  'Flutter',
  'Git',
  'GitHub',
]

const Technologies: React.FC = () => {
  const set1 = technologies.slice(0, 4)
  const set2 = technologies.slice(4, 8)
  const set3 = technologies.slice(8, 12)
  const set4 = technologies.slice(12, 16)
  return (
    <div className="technologies">
      <div className="container">
        <h2>Technologies</h2>
        <div className="technologies-list-group">
          <TechnologyList technologies={set1} />
          <TechnologyList technologies={set2} />
          <TechnologyList technologies={set3} />
          <TechnologyList technologies={set4} />
        </div>
      </div>
    </div>
  )
}

export default Technologies
