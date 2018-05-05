import _ from "lodash";

const promisifyGeocoder = geocoder => {
  return (...args) =>
    new Promise((resolve, reject) => {
      geocoder.geocode(...args, (results, status) => {
        if (status === "OK") {
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

const geocodeAddress = _.memoize(async (address, geocode) => {
  return await geocode({
    address: `${address.street}, ${address.area}`
  });
});

export const getAddress = async (google, address) => {
  const geocode = getGeocoder(google);
  if (!geocode) {
    return null;
  }

  const latlng = await geocodeAddress(address, geocode);
  return latlng;
};
