import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import _ from "lodash";
import kmeans  from 'node-kmeans';

const vectors = [[57.7089355,11.9669514],[57.6877847,11.9530877], [57.7041652,11.9636228], [57.6827079,11.9556896], [57.6783956,11.9470382]];

const tilesPaths = [
  require('./tiles/tiles000.png'),
  require('./tiles/tiles001.png'),
  require('./tiles/tiles002.png'),
  require('./tiles/tiles003.png'),
  require('./tiles/tiles004.png'),
  require('./tiles/tiles005.png'),
  require('./tiles/tiles006.png'),
  require('./tiles/tiles007.png'),
  require('./tiles/tiles008.png'),
  require('./tiles/tiles009.png'),
  require('./tiles/tiles010.png'),
  require('./tiles/tiles011.png'),
];


class MapView extends Component {

  state = {
    clusters: []
  };

  onMapClicked = (e) => {
    kmeans.clusterize(vectors, {k: 2}, (err,res) => {
      if (err) console.error(err);
      else {
        this.setState({
          clusters: res
        });
        console.log('%o',res);
      }
    });
  };

  onMarkerClicked = (e) => {
    console.log(e);
  };

  render() {
    console.log(this.state.clusters);

    const markerData = _.flatMap(this.state.clusters, (cluster, i) =>
      cluster.cluster.map((coordPair, i2) => <Marker
        key={`${i}${i2}`}
        title={`${i}`}
        position={{lat: coordPair[0], lng: coordPair[1]}}
        icon={{
          url: tilesPaths[i],
          scaledSize: new window.google.maps.Size(32,40)
        }}/>)
    );


    console.log("marker data: ", markerData);

    return (
      <div>
        <Map google={this.props.google}
             zoom={14}
             onClick={this.onMapClicked}
             initialCenter={{
          lat: 57.7089355,
          lng: 11.9669514
        }}>
          {markerData}

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