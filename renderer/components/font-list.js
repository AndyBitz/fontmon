// components
import {Component} from 'react'

// icons
import CloseIcon from '../vectors/close.svg'


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
        <span>{font.fileName}</span>
        <button onClick={this.handleRemove}><CloseIcon /></button>
        <style jsx>
        {`
          div {
            display: flex;
            align-items: center;
            width: 100%;
            max-width: 400px;
            justify-content: space-between;
            border-bottom: 1px solid rgba(0,0,0,.4);
            padding: .6em 1em;
            color: rgba(0,0,0,.73);
          }

          div:last-child {
            border-bottom: 0;
          }

          span {
            display: block;
          }

          button {
            border: none;
            background: none;
            padding: 0;
            outline: none;
            cursor: pointer;
          }

          button :global(svg) {
            display: block;
            width: 1.2rem;
            height: 1.2rem;
          }
        `}
        </style>
      </div>
    )
  }
}
