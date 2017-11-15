export default ({ isDragging }) => (
  <section className={isDragging ? 'open' : ''}>
    <style jsx>
    {`
      section {
        position: fixed;
        z-index: 10;
        pointer-events: none;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;

        background-color: rgba(0, 0, 157, .7);

        transition: all 200ms ease-in-out;

        opacity: 0;
      }

      section.open {
        opacity: 1;
      }
    `}
    </style>
  </section>
)
