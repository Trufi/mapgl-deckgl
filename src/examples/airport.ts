import { GeoJsonLayer, ArcLayer } from '@deck.gl/layers';

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS =
    'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

export const airport = {
    position: {
        longitude: 0.45,
        latitude: 51.47,
        zoom: 4,
        pitch: 30,
    },
    layers: () => [
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
};
