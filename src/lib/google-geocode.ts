import * as _ from "lodash";
import {} from "@types/googlemaps";
import { Address } from "./spreadsheet";

type GeocodeFn = (
  req: google.maps.GeocoderRequest
) => Promise<google.maps.GeocoderResult>;

const promisifyGeocoder = (geocoder: google.maps.Geocoder): GeocodeFn => {
  return (req: google.maps.GeocoderRequest) =>
    new Promise((resolve, reject) => {
      geocoder.geocode(req, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          resolve(_.first(results));
        } else {
          reject(status);
        }
      });
    });
};

const getGeocoder = _.memoize(google => {
  if (google) {
    const geocoder = new google.maps.Geocoder();
    return promisifyGeocoder(geocoder);
  } else {
    return null;
  }
});

const geocodeAddress = _.memoize(
  async (address: string, geocode: GeocodeFn) => {
    return await geocode({
      address
    });
  }
);

export const getAddress = async (google: any, address: string) => {
  const geocode = getGeocoder(google);
  if (!geocode) {
    return null;
  }

  const latlng = await geocodeAddress(address, geocode);
  return latlng;
};
