/// <reference path="../node_modules/@2gis/mapgl/global.d.ts" />
import * as dat from 'dat.gui';
import { Deck } from '@deck.gl/core';
import { airport } from './examples/airport';
import { heatmap } from './examples/heatmap';

const gui = new dat.GUI();

function fovToAltitude(fovInDeg: number) {
    const fov = (fovInDeg / 180) * Math.PI;
    return 0.5 / Math.tan(fov / 2);
}

const initialViewState = {
    latitude: 51.47,
    longitude: 0.45,
    zoom: 4,
    bearing: 0,
    pitch: 30,
    maxPitch: 45,
    minZoom: 1,
    altitude: fovToAltitude(60),
};

const map = ((window as any).map = new mapgl.Map('map', {
    key: '042b5b75-f847-4f2a-b695-b5f58adc9dfd',
    center: [initialViewState.longitude, initialViewState.latitude],
    zoom: initialViewState.zoom + 1,
    rotation: -initialViewState.bearing,
    pitch: initialViewState.pitch,
    zoomControl: false,
    style: 'b2b8046f-9bb0-469a-9860-9847032935cc',
}));

window.addEventListener('resize', () => map.invalidateSize());

const deck = ((window as any).deck = new Deck({
    canvas: 'deck-canvas',
    width: '100%',
    height: '100%',
    initialViewState,
    controller: true,
    onViewStateChange,
    layers: [],
}));

function onViewStateChange({ viewState }) {
    map.setCenter([viewState.longitude, viewState.latitude], { animate: false });
    map.setZoom(viewState.zoom + 1, { animate: false });
    map.setRotation(-viewState.bearing, { animate: false });
    map.setPitch(viewState.pitch, { animate: false });
}

deck.setProps({ layers: airport.layers() });

const examples = {
    airport,
    heatmap,
};

gui.add(
    {
        Examples: 'airport',
    },
    'Examples',
    Object.keys(examples),
).onChange((exampleName) => {
    const example = examples[exampleName];
    deck.setProps({ layers: example.layers(), initialViewState: example.position });
    onViewStateChange({ viewState: deck.viewState });
});

gui.add({ 'Map style': 'b2b8046f-9bb0-469a-9860-9847032935cc' }, 'Map style', {
    Day: 'c080bb6a-8134-4993-93a1-5b4d8c36a59b',
    Night: 'e05ac437-fcc2-4845-ad74-b1de9ce07555',
    Grayscale: 'b2b8046f-9bb0-469a-9860-9847032935cc',
    Snow: '1db52c6e-66b6-4c99-9c83-5538fa962d43',
}).onChange((styleId) => map.setStyleById(styleId));
