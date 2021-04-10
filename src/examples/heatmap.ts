import { HeatmapLayer } from '@deck.gl/aggregation-layers';

export const heatmap = {
    position: {
        longitude: 37.62348494975607,
        latitude: 55.7535624823238,
        zoom: 12,
        pitch: 0,
    },
    layers: () => [
        new HeatmapLayer({
            id: 'heatmapLayer',
            data: './assets/data.json',
            getPosition: (d) => [d[0], d[1]],
            getWeight: (d) => d[2],
            aggregation: 'SUM',
            colorRange: [
                [254, 240, 217, 200],
                [253, 212, 158, 200],
                [253, 187, 132, 200],
                [252, 141, 89, 200],
                [227, 74, 51, 200],
                [179, 0, 0, 200],
            ],
            threshold: 0.1,
        }),
    ],
};
