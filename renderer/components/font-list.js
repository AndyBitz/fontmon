// components
import {Component} from 'react'


export default ({fonts}) => (
  fonts.map((font, index) => (
    <FontItem
      font={font}
      index={index}
      key={`${font.fileName}-${index}`}
    />
  ))
)

class FontItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isRemoving: false
    }

    this.handleRemove = this.handleRemove.bind(this)
  }

  handleRemove(event) {
    this.setState({ isRemoving: true })
    this.props.font.remove()
  }

  render() {
    const {font, index} = this.props
    const {isRemoving} = this.state

    return (
      <div>
        <span>{ isRemoving ? 'removing...' : '' }</span>
        <span>{font.fileName}</span>
        <button onClick={this.handleRemove}>Remove</button>
        <style jsx>
        {`
          div {
            display: flex;
          }

          span {
            display: block;
          }

          button {
            display: block;
          }
        `}
        </style>
      </div>
    )
  }
}
