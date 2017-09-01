/*
 * actions
 */
export const DRAWER = 'DRAWER'
export const INSTRUMENT = 'INSTRUMENT'
export const PAUSED = 'PAUSED'
export const SESSION_KEY = 'SESSION_KEY'

/*
 * action creators
 */
export const setDrawer = (bool) => {
  return {
    type: DRAWER,
    bool
  }
}

export const setInstrument = (val) => {
  return {
    type: INSTRUMENT,
    val
  }
}

export const setPaused = (bool) => {
  return {
    type: PAUSED,
    bool
  }
}

export const setSession = (val) => {
  return {
    type: SESSION_KEY,
    val
  }
}

/*
 * action methods
 */
export const onSetDrawer = (bool) => {
  return (dispatch, getState, container) => {
    return dispatch(setDrawer(bool))
  }
}

export const onSetInstrument = (val) => {
  return (dispatch, getState, container) => {
    return dispatch(setInstrument(val))
  }
}

export const onSetPaused = (bool) => {
  return (dispatch, getState, container) => {
    return dispatch(setPaused(bool))
  }
}

export const onSetSession = (val) => {
  return (dispatch, getState, container) => {
    return dispatch(setSession(val))
  }
}
