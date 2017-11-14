// packages
import {Component} from 'react'

// components
import Layout from '../components/layout'
import FontList from '../components/font-list'


export default class extends Component {
  constructor(props) {
    super(props)

    // bindings
    this.onFontmonChange = this.onFontmonChange.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDrop = this.onDrop.bind(this)

    // default state
    this.state = {
      isServer: true,
      dragging: false,
      loadedFonts: []
    }
  }

  async componentDidMount() {
    // load fontmon lib
    const fontmon = await import('../lib/fontmon')
    this.fontmon = fontmon.default

    // update isServer to false
    this.setState({ isServer: false })

    // drag events
    document.addEventListener('dragenter', this.onDragEnter, false)
    document.addEventListener('dragleave', this.onDragLeave, false)
    document.addEventListener('dragover', this.onDragOver, false)
    document.addEventListener('drop', this.onDrop, false)

    // fontmon changes
    this.fontmon.subscribe(this.onFontmonChange)
  }

  componentWillUnmount() {
    //remove drag events
    document.removeEventListener('dragenter', this.onDragEnter, false)
    document.removeEventListener('dragleave', this.onDragLeave, false)
    document.removeEventListener('dragover', this.onDragOver, false)
    document.removeEventListener('drop', this.onDrop, false)

    // destroy fontmon subscribers
    this.fontmon.unsubscribe(this.onFontmonChange)
  }

  // call whenever a font gets added or removed
  // to update the state
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

    // load font when it's dropped on the window
    this.fontmon.loadList(event.dataTransfer.files)
  }

  render() {
    const {loadedFonts, isServer} = this.state

    // show nothing if on server
    // to prevent errors with electron.remote e.g.
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
