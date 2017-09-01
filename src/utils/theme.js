import createMuiTheme from 'material-ui/styles/theme'

const theme = createMuiTheme({
  TextField: {
    focused: {
      color: '#ff0000',
      '& $label': {
        color: '#00ff00',
      }
    }
  },
  "typography": {
    "fontFamily": "\"Raleway\", \"Helvetica\", \"Arial\", sans-serif",
    "fontSize": 14,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    "display1": {
      "fontSize": 34,
      "fontWeight": 400,
      "fontFamily": "\"Raleway\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": "40px",
      "color": "rgba(0, 0, 0, 0.54)"
    },
    "display2": {
      "fontSize": 45,
      "fontWeight": 400,
      "fontFamily": "\"Raleway\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": "48px",
      "color": "rgba(0, 0, 0, 0.54)"
    },
    "display3": {
      "fontSize": 56,
      "fontWeight": 400,
      "fontFamily": "\"Raleway\", \"Helvetica\", \"Arial\", sans-serif",
      "letterSpacing": "-.02em",
      "lineHeight": 1.35,
      "color": "rgba(0, 0, 0, 0.54)"
    },
    "display4": {
      "fontSize": 112,
      "fontWeight": 300,
      "fontFamily": "\"Raleway\", \"Helvetica\", \"Arial\", sans-serif",
      "letterSpacing": "-.04em",
      "lineHeight": 1,
      "color": "rgba(0, 0, 0, 0.54)"
    },
    "title": {
      "fontSize": 21,
      "fontWeight": 800,
      "fontFamily": "\"Raleway\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": 1,
      "color": "rgba(0, 0, 0, 0.87)"
    },
    "headline": {
      "fontSize": 24,
      "fontWeight": 400,
      "fontFamily": "\"Raleway\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": "32px",
      "color": "rgba(0, 0, 0, 0.87)"
    },
    "subheading": {
      "fontSize": 16,
      "fontWeight": 400,
      "fontFamily": "\"Raleway\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": "24px",
      "color": "rgba(0, 0, 0, 0.87)"
    },
    "body1": {
      "fontSize": 14,
      "fontWeight": 400,
      "fontFamily": "\"Raleway\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": "20px",
      "color": "rgba(0, 0, 0, 0.87)"
    },
    "body2": {
      "fontSize": 14,
      "fontWeight": 500,
      "fontFamily": "\"Raleway\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": "24px",
      "color": "rgba(0, 0, 0, 0.87)"
    },
    "caption": {
      "fontSize": 12,
      "fontWeight": 400,
      "fontFamily": "\"Raleway\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": 1,
      "color": "rgba(0, 0, 0, 0.54)"
    },
    "button": {
      "fontSize": 14,
      "textTransform": "uppercase",
      "fontWeight": 500,
      "fontFamily": "\"Raleway\", \"Helvetica\", \"Arial\", sans-serif"
    }
  }
})

export default theme
