export default ({ isLoading }) => (
  <section className={isLoading ? 'visible' : ''} >
    <div>loading</div>
    <Bar />
    <style jsx>
    {`
      section {
        position: fixed;
        flex-direction: column;

        top: 0;
        bottom: 0;
        right: 0;
        left: 0;

        background-color: rgba(0, 0, 157, .7);
        color: white;

        display: flex;
        justify-content: center;
        align-items: center;

        transition: all 200ms ease-in-out;

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

const Bar = () => (
  <div>
    <style jsx>
    {`
      div {
        margin-top: .2em;
        border: 3px solid white;
        border-bottom: none;
        border-top: none;
        width: 10em;
        height: .4em;
        background: none;
        position: relative;
      }

      div::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 48%;
        right: 48%;
        background-color: white;
        animation: animat-bar 1.2s ease-in-out infinite;
      }

      @keyframes animat-bar {
        0% {
          right: 48%;
          left: 48%;
        }
        50% {
          right: -5%;
          left: -5%;
        }
        100% {
          right: 48%;
          left: 48%;
        }
      }
    `}
    </style>
  </div>
)
