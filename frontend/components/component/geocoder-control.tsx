import { useControl, ControlPosition } from 'react-map-gl';
import MapboxGeocoder, { GeocoderOptions } from '@mapbox/mapbox-gl-geocoder';
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

//Taken from https://github.com/visgl/react-map-gl/blob/7.1-release/examples/geocoder/src/geocoder-control.tsx

type GeocoderControlProps = Omit<GeocoderOptions, 'accessToken' | 'mapboxgl'> & {
  mapboxAccessToken: string;
  position: ControlPosition;
  // // event handlers
  // onLoading: (e: object) => void;
  // onResults: (e: object) => void;
  // onResult: (e: object) => void;
  // onError: (e: object) => void;
};

export default function GeocoderControl(props: GeocoderControlProps) {
  useControl<MapboxGeocoder>(
    () => {
      const ctrl = new MapboxGeocoder({
        ...props,
        accessToken: props.mapboxAccessToken
      });
      // // event handlers
      // ctrl.on('loading', props.onLoading);
      // ctrl.on('results', props.onResults);
      // ctrl.on('result', props.onResult);
      // ctrl.on('error', props.onError);
      return ctrl;
    },
    {
      position: props.position
    }
  );

  // // Update geocoder options if necessary
  // if (geocoder._map) {
  //   if (geocoder.getProximity() !== props.proximity && props.proximity !== undefined) {
  //     geocoder.setProximity(props.proximity);
  //   }
  //   if (geocoder.getRenderFunction() !== props.render && props.render !== undefined) {
  //     geocoder.setRenderFunction(props.render);
  //   }
  //   if (geocoder.getLanguage() !== props.language && props.language !== undefined) {
  //     geocoder.setLanguage(props.language);
  //   }
  //   if (geocoder.getZoom() !== props.zoom && props.zoom !== undefined) {
  //     geocoder.setZoom(props.zoom);
  //   }
  //   if (geocoder.getFlyTo() !== props.flyTo && props.flyTo !== undefined) {
  //     geocoder.setFlyTo(props.flyTo);
  //   }
  //   if (geocoder.getPlaceholder() !== props.placeholder && props.placeholder !== undefined) {
  //     geocoder.setPlaceholder(props.placeholder);
  //   }
  //   if (geocoder.getCountries() !== props.countries && props.countries !== undefined) {
  //     geocoder.setCountries(props.countries);
  //   }
  //   if (geocoder.getTypes() !== props.types && props.types !== undefined) {
  //     geocoder.setTypes(props.types);
  //   }
  //   if (geocoder.getMinLength() !== props.minLength && props.minLength !== undefined) {
  //     geocoder.setMinLength(props.minLength);
  //   }
  //   if (geocoder.getLimit() !== props.limit && props.limit !== undefined) {
  //     geocoder.setLimit(props.limit);
  //   }
  //   if (geocoder.getFilter() !== props.filter && props.filter !== undefined) {
  //     geocoder.setFilter(props.filter);
  //   }
  //   if (geocoder.getOrigin() !== props.origin && props.origin !== undefined) {
  //     geocoder.setOrigin(props.origin);
  //   }
  // }

  return null;
}

// const noop = () => {};

// GeocoderControl.defaultProps = {
//   onLoading: noop,
//   onResults: noop,
//   onResult: noop,
//   onError: noop
// };