import Project from './Project'
import './Projects.scss'

const projects = [
  {
    id: 'p1',
    title: 'Sage',
    imageURL: '../assets/img/project-1.jpg',
    description: 'Sage is a leage of legends coaching mobile app built using Flutter framework.',
  },
  {
    id: 'p2',
    title: 'Sage',
    imageURL: '../assets/img/project-2.jpg',
    description: 'Sage is a leage of legends coaching mobile app built using Flutter framework.',
  },
  {
    id: 'p3',
    title: 'Sage',
    imageURL: '../assets/img/project-3.jpg',
    description: 'Sage is a leage of legends coaching mobile app built using Flutter framework.',
  },
  {
    id: 'p4',
    title: 'Sage',
    imageURL: '../assets/img/project-4.jpg',
    description: 'Sage is a leage of legends coaching mobile app built using Flutter framework.',
  },
  {
    id: 'p5',
    title: 'Sage',
    imageURL: '../assets/img/project-5.jpg',
    description: 'Sage is a leage of legends coaching mobile app built using Flutter framework.',
  },
  {
    id: 'p6',
    title: 'Sage',
    imageURL: '../assets/img/project-6.jpg',
    description: 'Sage is a leage of legends coaching mobile app built using Flutter framework.',
  },
]

const Projects: React.FC = () => (
  <div className="projects">
    <div className="container">
      <h2>Projects</h2>
      <div className="projects-list">
        {projects.map(p => (
          <Project id={p.id} title={p.title} imageURL={p.imageURL} description={p.description} key={p.id} />
        ))}
      </div>
    </div>
  </div>
)

export default Projects
