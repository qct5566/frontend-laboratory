import { Scene } from '@antv/l7'
import { GaodeMap, Mapbox } from '@antv/l7-maps'

const scene = (options) => {
  const {
    map = {
      type: 'GaodeMap',
      options: {}
    }
  } = options
  const Map = map.mapType === 'GaodeMap' ? GaodeMap : Mapbox
  return new Scene({
    ...options,
    map: new Map({
      pitch: 35.210526315789465,
      style: 'dark',
      zoom: 10,
      rotateEnable: true,
      ...map.options
    })
  })
}
export default scene
