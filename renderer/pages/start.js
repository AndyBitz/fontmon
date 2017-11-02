// packages
import {Component} from 'react'

// components
import Layout from '../components/layout'
import Nav from '../components/nav'
import Content from '../components/content'
import Header from '../components/header'


export default class extends Component {
  // static async getInitialProps() {}

  constructor(props) {
    super(props)

    this.onFontStatusChange = this.onFontStatusChange.bind(this)
  }

  state = { fonts: [] }

  async componentDidMount() {
    this.setState({
      fonts: await getAllFonts()
    })
  }

  onFontStatusChange(index, status) {
    const newFonts = this.state.fonts

    newFonts[index].isActive = status

    this.setState({
      fonts: newFonts
    })
  }

  render() {
    return (
      <Layout>
        <Header />
        <Nav
          fonts={this.state.fonts}
          onFontStatusChange={this.onFontStatusChange}
        />
        <Content />
      </Layout>
    )
  }
}


const getAllFonts = async () => {
  return [
    {family: 'Roboto', type: 'Regular', isActive: false},
    {family: 'Roboto', type: 'Bold', isActive: false},
    {family: 'Roboto', type: 'Italic', isActive: false},
    {family: 'Roboto', type: 'Bold Italic', isActive: false},
  ]
}
