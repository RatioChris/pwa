import createMuiTheme from 'material-ui/styles/theme'
import createPalette from 'material-ui/styles/palette'
import createTypography from 'material-ui/styles/typography'
import { extend } from 'underscore'
import { blue, brown, red } from 'material-ui/colors'

const palette = createPalette({
  primary: blue,
  accent: brown,
  error: red,
  type: 'light'
})

export const typographyConstants = {
  fontFamily: '"Raleway", "Helvetica", "Arial", sans-serif',
  fontSize: 12,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 800
}

const typography = createTypography(palette, typographyConstants)

export const create = theme => createMuiTheme(extend({
  typography,
  palette
}, theme))

export default create()
