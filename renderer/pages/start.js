// packages
import {Component} from 'react'

// components
import Layout from '../components/layout'
import FontList from '../components/font-list'


export default class extends Component {
  // static async getInitialProps() {}

  constructor(props) {
    super(props)

    this.onFontmonChange = this.onFontmonChange.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDrop = this.onDrop.bind(this)

    this.state = {
      isServer: true,
      dragging: false,
      loadedFonts: []
    }
  }

  async componentDidMount() {
    const fontmon = await import('../lib/fontmon')
    this.fontmon = fontmon.default

    this.setState({
      isServer: false,
      loadedFonts: this.fontmon.getLoadedFonts()
    })

    document.addEventListener('dragenter', this.onDragEnter, false)
    document.addEventListener('dragleave', this.onDragLeave, false)
    document.addEventListener('dragover', this.onDragOver, false)
    document.addEventListener('drop', this.onDrop, false)

    this.fontmon.addEventListener(this.onFontmonChange)
  }

  componentWillUnmount() {
    document.removeEventListener('dragenter', this.onDragEnter, false)
    document.removeEventListener('dragleave', this.onDragLeave, false)
    document.removeEventListener('dragover', this.onDragOver, false)
    document.removeEventListener('drop', this.onDrop, false)

    this.fontmon.removeEventListener(this.onFontmonChange)
  }

  onFontmonChange(status) {
    this.setState({
      loadedFonts: this.fontmon.getLoadedFonts()
    })
  }

  onDragEnter(event) {
    event.preventDefault()
  }

  onDragLeave(event) {
    event.preventDefault()
    this.setState({ dragging: false })
  }

  onDragOver(event) {
    event.preventDefault()
    this.setState({ dragging: true })
  }

  onDrop(event) {
    event.preventDefault()
    this.setState({ dragging: false })
    this.fontmon.loadList(event.dataTransfer.files)
  }

  render() {
    const {loadedFonts, isServer} = this.state

    if (isServer) {
      return null
    }

    return (
      <Layout>
        { loadedFonts[0] ? <FontList fonts={loadedFonts} /> : 'Drag to load font' }
      </Layout>
    )
  }
}
