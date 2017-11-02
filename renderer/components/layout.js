export default ({children}) => {
  return (
    <main>
      {children}
      <style jsx global>
      {`
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
          overflow-x: hidden;
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