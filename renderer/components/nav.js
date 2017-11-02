export default () => (
  <nav>
    <SearchBar />

    <List>
      <Head>Fonts</Head>
      <Item>Font-Family 1</Item>
      <Item>Font-Family 2</Item>
      <Item>Font-Family 3</Item>
      <Item>Font-Family 4</Item>
      <Item>Font-Family 5</Item>
    </List>

    <style jsx>
    {`
      nav {
        grid-area: nav;
        background-color: cornsilk;
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
      }
    `}
    </style>
  </div>
)

const Item = ({children, ...rest}) => (
  <a {...rest}>
    {children}
    <style jsx>
    {`
      a {
        display: block;
      }
    `}
    </style>
  </a>
)

const SearchBar = () => (
  <div>
    <label>Search</label>
    <input type="text" />
    <style jsx>
    {`
      label {
        display: block;
      }

      input {
        display: block;
      }
    `}
    </style>
  </div>
)
