import * as React from 'react';



type Props = {
    map?: any;
    google?: any;
    directions: google.maps.DirectionsResult
}


export class Directions extends React.Component<Props> {
    directionsRenderer: google.maps.DirectionsRenderer;

    componentDidMount() {
        this.renderDirections();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            this.props.map !== prevProps.map ||
            this.props.directions !==  prevProps.directions
        ) {
            if (this.directionsRenderer) {
                this.directionsRenderer.setMap(null);
            }
            this.renderDirections();
        }
    }

    componentWillUnmount() {
        if (this.directionsRenderer) {
            this.directionsRenderer.setMap(null);
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

        if (!this.directionsRenderer) {
            this.directionsRenderer = new google.maps.DirectionsRenderer;
        }

        this.directionsRenderer.setDirections(directions);

        this.directionsRenderer.setMap(map);

    }

    render(): any {
        return null;
    }
}