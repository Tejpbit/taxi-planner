import * as _ from "lodash";
import {} from "@types/googlemaps";
import { Address } from "./spreadsheet";
const Backoff = require("backoff-promise");

type GeocodeFn = (
  req: google.maps.GeocoderRequest
) => Promise<google.maps.GeocoderResult>;

type RouteFn = (
  req: google.maps.DirectionsRequest
) => Promise<google.maps.DirectionsResult>;

export const promisifyGeocoder = (
  geocoder: google.maps.Geocoder
): GeocodeFn => {
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

export const promisifyRoute = (
  service: google.maps.DirectionsService
): RouteFn => {
  return (req: google.maps.DirectionsRequest) =>
    new Promise((resolve, reject) => {
      service.route(req, (results, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
};

export const getRouteFn = _.memoize(google => {
  if (google) {
    const service = new google.maps.DirectionsService();
    const backoff = new Backoff();
    return (
      req: google.maps.DirectionsRequest
    ): Promise<google.maps.DirectionsResult> =>
      backoff.run(
        () => promisifyRoute(service)(req),
        (status: google.maps.GeocoderStatus) => {
          if (status !== google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            throw status;
          }
        }
      );
  } else {
    return null;
  }
});

const getGeocoder = _.memoize(google => {
  if (google) {
    const geocoder = new google.maps.Geocoder();
    const backoff = new Backoff();

    return (
      req: google.maps.GeocoderRequest
    ): Promise<google.maps.GeocoderResult> =>
      backoff.run(
        () => promisifyGeocoder(geocoder)(req),
        (status: google.maps.GeocoderStatus) => {
          if (status !== google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            throw status;
          }
        }
      );
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

export const getAddressForUser = (google: any, address: Address) => {
  return getAddress(google, `${address.street}, ${address.area}`);
};

export const getAddress = async (google: any, address: string) => {
  const geocode = getGeocoder(google);
  if (!geocode) {
    return null;
  }

  const latlng = await geocodeAddress(address, geocode);
  return latlng;
};
