export default () => (
  <section>
    <div>
      <span>Drop</span>
      <span>your Fonts</span> 
    </div>
    <style jsx>
    {`
      section {
        text-align: center;
        font-weight: 700;
      }

      div {
        border: 1px solid black;
        border-radius: 100%;
        height: 7em;
        width: 7em;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      span {
        display: block;
      }

      span:first-child {
        font-size: 1.4em;
      }

      span:last-child {
        font-size: .7em;
      }
    `}
    </style>
  </section>
)
