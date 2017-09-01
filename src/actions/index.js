/*
 * actions
 */
export const BPM = 'BPM'
export const DRAWER = 'DRAWER'
export const INSTRUMENT = 'INSTRUMENT'
export const PAUSED = 'PAUSED'
export const SESSION_KEY = 'SESSION_KEY'
export const SOLO = 'SOLO'

/*
 * action creators
 */
export const setBpm = (num) => {
  return {
    type: BPM,
    num
  }
}

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

export const setSolo = (bool) => {
  return {
    type: SOLO,
    bool
  }
}

/*
 * action methods
 */
export const onSetBpm = (num) => {
  return (dispatch, getState, container) => {
    return dispatch(setBpm(num))
  }
}

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

export const onSetSolo = (bool) => {
  return (dispatch, getState, container) => {
    return dispatch(setSolo(bool))
  }
}
