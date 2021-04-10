/// <reference path="../node_modules/@2gis/mapgl/global.d.ts" />

import { Deck } from '@deck.gl/core';
import { GeoJsonLayer, ArcLayer } from '@deck.gl/layers';

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS =
    'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

const INITIAL_VIEW_STATE = {
    latitude: 51.47,
    longitude: 0.45,
    zoom: 4,
    bearing: 0,
    pitch: 30,
    maxPitch: 45,
    minZoom: 1,
};

const map = ((window as any).map = new mapgl.Map('map', {
    key: '042b5b75-f847-4f2a-b695-b5f58adc9dfd',
    center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
    zoom: INITIAL_VIEW_STATE.zoom,
    rotation: -INITIAL_VIEW_STATE.bearing,
    pitch: INITIAL_VIEW_STATE.pitch,
    zoomControl: false,
    style: 'b2b8046f-9bb0-469a-9860-9847032935cc',
}));

window.addEventListener('resize', () => map.invalidateSize());

export const deck = ((window as any).deck = new Deck({
    canvas: 'deck-canvas',
    width: '100%',
    height: '100%',
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    onViewStateChange: ({ viewState }) => {
        map.setCenter([viewState.longitude, viewState.latitude], { animate: false });
        map.setZoom(viewState.zoom + 1, { animate: false });
        map.setRotation(-viewState.bearing, { animate: false });
        map.setPitch(viewState.pitch, { animate: false });
    },
    layers: [
        new GeoJsonLayer({
            id: 'airports',
            data: AIR_PORTS,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 2000,
            getRadius: (f) => 11 - f.properties.scalerank,
            getFillColor: [200, 0, 80, 180],
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onClick: (info) =>
                info.object &&
                alert(`${info.object.properties.name} (${info.object.properties.abbrev})`),
        }),
        new ArcLayer({
            id: 'arcs',
            data: AIR_PORTS,
            dataTransform: (d) => d.features.filter((f) => f.properties.scalerank < 4),
            // Styles
            getSourcePosition: () => [-0.4531566, 51.4709959], // London
            getTargetPosition: (f) => f.geometry.coordinates,
            getSourceColor: [0, 128, 200],
            getTargetColor: [200, 0, 80],
            getWidth: 1,
        }),
    ],
}));
