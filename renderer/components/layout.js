export default ({children}) => (
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
        background-color: #fff;
        font-family: monospace;
      }
    `}
    </style>
    <style jsx>
    {`
      main {
        overflow: hidden;
        min-height: 100vh;
        width: 100vw;
  
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}
    </style>
  </main>
)
