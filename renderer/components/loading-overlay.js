export default ({ isLoading }) => (
  <section className={isLoading ? 'visible' : ''} >
    <div>loading ...</div>
    <style jsx>
    {`
      section {
        position: fixed;

        top: 0;
        bottom: 0;
        right: 0;
        left: 0;

        background-color: red;

        display: flex;
        justify-content: center;
        align-items: center;

        pointer-events: none;
        opacity: 0;
      }

      section.visible {
        opacity: 1;
        pointer-events: initial;
      }
    `}
    </style>
  </section>
)