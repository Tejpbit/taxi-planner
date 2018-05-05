import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';


class MapView extends Component {

  onMapClicked = (e) => {
  };

  onMarkerClicked = (e) => {
    console.log(e);
  };

  render() {
    return (
      <div>
        <Map google={this.props.google}
             zoom={14}
             onClick={this.onMapClicked}
             initialCenter={{
          lat: 57.7089355,
          lng: 11.9669514
        }}>
          <Marker onClick={this.onMarkerClicked}
                  name={'Current location'} />

        </Map>
        <InfoWindow onClose={this.onInfoWindowClose}
                    visible={true}>
          <div>
            <h1>helo</h1>
          </div>
        </InfoWindow>

      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_MAPS_KEY)
})(MapView)


/*


<Marker onClick={this.onMarkerClicked}
                  name={'Current location'} />

          <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
          </InfoWindow>


* */