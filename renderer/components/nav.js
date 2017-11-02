// packages
import {Component} from 'react'

// components
import Styles from './styles'


export default () => (
  <nav>
    <div className="wrapper">
    <SearchBar />

    <List>
      <Head>Fonts</Head>
      <FontItem>Font-Family 1</FontItem>
      <FontItem>Font-Family 2</FontItem>
      <FontItem>Font-Family 3</FontItem>
      <FontItem>Font-Family 4</FontItem>
      <FontItem>Font-Family 5</FontItem>
      <FontItem>Font-Family 6</FontItem>
      <FontItem>Font-Family 7</FontItem>
      <FontItem>Font-Family 8</FontItem>
      <FontItem>Font-Family 9</FontItem>
      <FontItem>Font-Family 10</FontItem>
      <FontItem>Font-Family 11</FontItem>
      <FontItem>Font-Family 12</FontItem>
      <FontItem>Font-Family 13</FontItem>
      <FontItem>Font-Family 14</FontItem>
      <FontItem>Font-Family 15</FontItem>
    </List>

    </div>
    <style jsx>
    {`
      nav {
        grid-area: nav;
        border-right: 3px solid ${Styles.shades[2]};
        overflow: hidden;
        height: calc(100vh - 50px);
      }

      div.wrapper {
        height: 100%;
        overflow-y: scroll;
      }
    `}
    </style>
  </nav>
)

const List = ({children}) => (
  <div>{children}</div>
)

const Head = ({children}) => (
  <div>
    {children}
    <style jsx>
    {`
      div {
        font-size: 1.2em;
        font-weight: 700;
        font-family: 'Roboto Condensed', sans-serif;
        padding: 1rem 1rem .6rem;
        color: ${Styles.shades[1]};
      }
    `}
    </style>
  </div>
)

const FontItem = ({children, ...rest}) => (
  <div {...rest}>
    <span>{children}</span>
    <span>A</span>
    <style jsx>
    {`
      div {
        display: flex;
        justify-content: space-between;
        padding: .6rem 1rem;
        cursor: pointer;
        font-size: .9em;
      }
    `}
    </style>
  </div>
)

class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleClear = this.handleClear.bind(this)
  }

  state = {
    searchText: '',
    isFocused: false
  }

  handleFocus(event) {
    this.setState({ isFocused: true })
  }

  handleBlur(event) {
    const target = event.currentTarget

    if (target.value === '') {
      this.setState({ isFocused: false })
    }
  }

  handleInput(event) {
    this.setState({ searchText: event.target.value })
  }

  handleClear(event) {
    event.preventDefault()
    this.setState({ searchText: '', isFocused: false })
  }

  render() {
    const {isFocused, searchText} = this.state

    return (
      <div className={isFocused ? 'is-focused' : ''}>
        <label for="search">Search</label>
        <input
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          type="text"
          name="search"
          id="search"
          value={searchText}
          onInput={this.handleInput}
        />
        <button
          className={searchText ? 'show' : ''}
          onClick={this.handleClear}>
          <span>x</span>
        </button>
        <style jsx>
        {`
          div {
            position: sticky;
            background-color: white;
            top: 0;
            padding: .4rem 1rem 0rem;
            display: flex;
            flex-wrap: wrap;
          }

          label {
            flex: 0 0 100%;
            display: block;
            font-size: .8em;
            color: ${Styles.shades[3]};
            transform: translateY(calc(100% + .2rem));
            transition: all 200ms ease-in-out;
            cursor: text;
          }

          div.is-focused label {
            transform: translateY(0);
          }

          input {
            flex-basis: 0 0 calc(100% - 2em);
            display: block;
            padding: .2rem 0;
            font-size: .9em;
            border: none;
            outline: none;
            border-bottom: 3px solid ${Styles.shades[3]};
          }

          button {
            display: block;
            flex: 0 0 2em;
            border: none;
            background: none;
            outline: none;
            border-bottom: 3px solid ${Styles.shades[3]};
            cursor: pointer;
          }

          button span {
            opacity: 0;
            transition: all 200ms ease-in-out;
          }

          button.show span {
            opacity: 1;
          }
        `}
        </style>
      </div>
    )
  }
}