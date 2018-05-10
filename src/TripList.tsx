import * as React from "react";
import styled from "styled-components";
import * as _ from "lodash";
import { ClusterWithLegs } from "Planner";
import { colors } from "lib/colors";

const taxi = require("./taxi.svg");

const TripContainer = styled.div`
  width: 30vw;
  padding: 10px;
`;

const TripHeader = styled.h3`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TripElement = styled.div`
  padding: 1em;
  :hover {
    background: #f8e71c;
  }
`;

type Props = {
  trips: ClusterWithLegs[];
  disabledRouteIndexes: number[];
  toggleRide: (trip: number) => void;
};

export const TripList = (props: Props) => (
  <TripContainer>
    You'll need {props.trips.length} {props.trips.length === 1 ? "car" : "cars"}
    {props.trips.map((trip, i) => (
      <TripElement
        key={trip.id}
        onClick={() => props.toggleRide(i)}
        style={{ opacity: props.disabledRouteIndexes.includes(i) ? 0.6 : 1 }}
      >
        <TripHeader>
          <Taxi
            style={{
              width: 20,
              color: props.disabledRouteIndexes.includes(i)
                ? "slategray"
                : colors[i % colors.length],
              margin: 10
            }}
          />
          {_.last(trip.legs).end_address}
        </TripHeader>

        {trip.cluster.map(cluster => (
          <div key={String(cluster.address.id)}>
            {cluster.address.name}, {cluster.address.street}
          </div>
        ))}
      </TripElement>
    ))}
  </TripContainer>
);

const Taxi = ({ style }: { style?: React.CSSProperties }) => (
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 82.3 74.3"
    style={style}
  >
    <g>
      <path
        fill="currentColor"
        d="M19.7,63.8c0,2.1,0.1,4.1,0,6.1c-0.1,2.8-1.4,4.2-4.1,4.3c-2.5,0.1-5,0.1-7.5,0c-2.7-0.1-4-1.5-4.1-4.3
		c0-1.1-0.1-2.2,0-3.2c0.1-2.9,0-5.6-2.2-8c-1.1-1.2-1.5-3.3-1.6-5.1c-0.3-2.9-0.2-5.8-0.1-8.7c0.1-3.9,2.1-6.7,5.3-8.8
		c0.9-0.6,1.7-1.6,2-2.6c1-3.3,1.7-6.6,2.6-9.9c2.4-9.4,5.3-12,15.3-13.2c0-1.8-0.1-3.7,0-5.6C25.4,1.5,26.7,0.1,30,0
		C37.5,0,45,0,52.5,0c3,0,4.4,1.5,4.5,4.5c0.1,1.9,0,3.8,0,5.9c0.8,0.1,1.4,0.2,2,0.2c6.1,0.4,10.7,3.9,12.4,9.8
		c1.2,4.2,2.1,8.6,3.3,12.8c0.3,1.1,1.3,2.3,2.2,2.9c2.9,2,4.9,4.5,5.1,8.1c0.1,3.2,0.3,6.5-0.1,9.7c-0.3,2-1.5,3.9-2.3,5.9
		c-0.5,1.3-1.3,2.6-1.4,4c-0.2,2.1,0,4.2-0.1,6.2c-0.1,2.5-1.3,3.9-3.8,4.1c-2.7,0.2-5.3,0.2-8,0c-2.5-0.1-3.7-1.6-3.8-4
		c-0.1-2.1,0-4.1,0-6.4C48.3,63.8,34.2,63.8,19.7,63.8z M18,34.5c15.5,0,30.8,0,46.4,0c-1-3.9-1.8-7.7-3-11.4
		c-0.3-0.9-1.8-1.9-2.8-1.9C47,21,35.4,21,23.8,21.2c-1,0-2.6,1.1-2.9,2C19.7,26.8,18.9,30.6,18,34.5z M14.6,44.4
		c-3.5,0-6,2.5-6.1,5.9c0,3.5,2.7,6.2,6.1,6.2c3.3,0,6-2.8,6-6.1C20.6,47.1,18,44.5,14.6,44.4z M73.7,50.3c0-3.4-2.6-5.9-6.1-5.9
		c-3.4,0-6,2.7-6,6c0,3.4,2.8,6.2,6.3,6.1C71.3,56.4,73.8,53.7,73.7,50.3z"
      />
    </g>
  </svg>
);
