export default ({fonts}) => (
  fonts.map(FontItem)
)

const FontItem = (font, index) => {
  const handleRemove = () => {
    font.remove()
    console.log('removed font', font.fileName)
  }

  return (
    <div key={`${font.fileName}-${index}`}>
      <span>{font.fileName}</span>
      <button onClick={handleRemove}>Remove</button>
      <style jsx>
      {`
        div {
          display: flex;
        }

        span {
          display: block;
        }

        button {
          display: block;
        }
      `}
      </style>
    </div>
  )
}