// packages
import {Component} from 'react'

// components
import Layout from '../components/layout'
import FontList from '../components/font-list'
import DropOverlay from '../components/drop-overlay'
import EmptyScreen from '../components/empty-screen'
import LoadingOverlay from '../components/loading-overlay'


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
      isDragging: false,
      isLoading: false,
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
    this.fontmon.on('change', this.onFontmonChange)
  }

  componentWillUnmount() {
    //remove drag events
    document.removeEventListener('dragenter', this.onDragEnter, false)
    document.removeEventListener('dragleave', this.onDragLeave, false)
    document.removeEventListener('dragover', this.onDragOver, false)
    document.removeEventListener('drop', this.onDrop, false)

    // destroy fontmon subscribers
    this.fontmon.removeListener('change', this.onFontmonChange)
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
    this.setState({ isDragging: false })
  }

  onDragOver(event) {
    event.preventDefault()
    this.setState({ isDragging: true })
  }

  onDrop(event) {
    event.preventDefault()
    this.setState({ isDragging: false, isLoading: true })

    // load font when it's dropped on the window
    this.fontmon.loadList(event.dataTransfer.files)
      .then(() => {
        this.setState({ isLoading: false })
      })
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
        <LoadingOverlay isLoading={this.state.isLoading} />
        <DropOverlay isDragging={this.state.isDragging} />
        { loadedFonts[0]
            ? <FontList fonts={loadedFonts} />
            : <EmptyScreen />
        }
      </Layout>
    )
  }
}
