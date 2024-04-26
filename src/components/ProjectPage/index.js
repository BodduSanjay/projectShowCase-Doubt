import {Component} from 'react'
import Loader from 'react-loader-spinner'

const currentStatus = {
  initial: 'initial',
  inProgress: 'inProgress',
  success: 'success',
  failure: 'failure',
}
class ProjectPage extends Component {
  constructor(props) {
    super(props)
    const {categoriesList} = props
    this.state = {
      projectsList: [],
      categoriesList,
      apiStatus: currentStatus.initial,
      category: categoriesList[0].id,
      activeCategory: categoriesList[0],
    }
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: currentStatus.inProgress})
    const {category} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    if (response.ok) {
      const formattedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: formattedData,
        apiStatus: currentStatus.success,
      })
    } else {
      this.setState({apiStatus: currentStatus.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="threeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We Cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getProjects}>
        Retry
      </button>
    </div>
  )

  handleChange = event => {
    const id = event.target.value
    const {categoriesList} = this.state
    const activeCategory = categoriesList.find(each => each.id === id)
    this.setState({category: id, activeCategory}, this.getProjects)
  }

  renderSuccess = () => {
    const {projectsList, categoriesList, activeCategory} = this.state

    return (
      <div>
        <select value={activeCategory.id} onChange={this.handleChange}>
          {categoriesList.map(item => (
            <option key={item.id} value={item.id}>
              {item.displayText}
            </option>
          ))}
        </select>

        <ul>
          {projectsList.map(project => {
            const {id, name, imageUrl} = project
            return (
              <li key={id}>
                <img src={imageUrl} alt={name} />
                <p>{name}</p>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderAll = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case currentStatus.inProgress:
        return this.renderLoader()
      case currentStatus.failure:
        return this.renderFailure()
      case currentStatus.success:
        return this.renderSuccess()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </div>
        <div>{this.renderAll()}</div>
      </div>
    )
  }
}
export default ProjectPage
