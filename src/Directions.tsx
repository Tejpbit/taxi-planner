import * as React from 'react';

import * as _ from 'lodash';

type Props = {
    map?: any;
    google?: any;
    directions: google.maps.DirectionsResult[]
}


export class Directions extends React.Component<Props> {
    directionsRenderers: google.maps.DirectionsRenderer[];

    componentDidMount() {
        this.renderDirections();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            this.props.map !== prevProps.map ||
            this.props.directions !==  prevProps.directions
        ) {
            if (this.directionsRenderers) {
                this.directionsRenderers.forEach(r => r.setMap(null))
            }
            this.renderDirections();
        }
    }

    componentWillUnmount() {
        if (this.directionsRenderers) {
            this.directionsRenderers.forEach(r => r.setMap(null))
        }
    }

    renderDirections(): any {
        const {
            map,
            google,
            directions,
        } = this.props;

        if (!google) {
            return null;
        }

        if (! directions || ! this.directionsRenderers || directions.length != this.directionsRenderers.length) {
            this.directionsRenderers = directions.map(d => new google.maps.DirectionsRenderer(d));
        }


        _.zip(directions, this.directionsRenderers).map(d => {
            d[1].setDirections(d[0]);
            d[1].setMap(map);
        });

    }

    render(): any {
        return null;
    }
}