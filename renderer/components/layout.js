// components
import Styles from './styles'


export default ({children}) => {
  return (
    <main> 
      {children}
      <style jsx global>
      {`
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          src: local('Roboto'), local('Roboto-Regular'), url(/static/fonts/Roboto-Regular.ttf) format('ttf');
        }

        @font-face {
          font-family: 'Roboto Condensed';
          font-style: normal;
          font-weight: 700;
          src: local('Roboto Condensed Bold'), local('RobotoCondensed-Bold'), url(/static/fonts/RobotoCondensed-Bold.ttf) format('ttf');
        }

        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          font-family: 'Roboto', sans-serif;
          overflow-x: hidden;
          user-select: none;
          font-size: 18px;
          color: ${Styles.shades[2]};
        }

        input {
          color: ${Styles.shades[2]}; 
        }

        img, svg {
          vertical-align: middle;
        }
      `}
      </style> 
      <style jsx>
      {`
        main {
          width: 100vw;
          min-height: 100vh;

          display: grid;

          grid-template-columns: 280px auto auto;
          grid-template-rows: 50px auto;

          grid-template-areas:
            "header header header"
            "nav content content"
            "nav content content"
        }
      `}
      </style>
    </main>
  )
}