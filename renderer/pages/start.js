// packages
import {Component} from 'react'

// components
import Layout from '../components/layout'
import FontList from '../components/font-list'

// lib
import fontmon from '../lib/fontmon'


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
      dragging: false,
      loadedFonts: fontmon.getLoadedFonts()
    }
  }

  componentDidMount() {
    document.addEventListener('dragenter', this.onDragEnter, false)
    document.addEventListener('dragleave', this.onDragLeave, false)
    document.addEventListener('dragover', this.onDragOver, false)
    document.addEventListener('drop', this.onDrop, false)

    fontmon.addEventListener(this.onFontmonChange)
  }

  componentWillUnmount() {
    document.removeEventListener('dragenter', this.onDragEnter, false)
    document.removeEventListener('dragleave', this.onDragLeave, false)
    document.removeEventListener('dragover', this.onDragOver, false)
    document.removeEventListener('drop', this.onDrop, false)

    fontmon.removeEventListener(this.onFontmonChange)
  }

  onFontmonChange(event) {
    this.state({
      loadedFonts: fontmon.getLoadedFonts()
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
    fontmon.loadList(event.dataTransfer.files)
  }

  render() {
    const {loadedFonts} = this.state

    return (
      <Layout>
        { loadedFonts[0] ? <FontList fonts={loadedFonts} /> : 'Drag to load font' }
      </Layout>
    )
  }
}
