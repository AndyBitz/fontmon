export default (fonts) => (
  fonts.map(FontItem)
)

const FontItem = (font, index) => (
  <div key={`${font}-${index}`}>
    {font}
  </div>
)
