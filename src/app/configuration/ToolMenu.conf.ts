import { ToolMenu } from 'src/app/models/toolMenu';
import { GEOM } from './appConstants'

export const toolMenuConf: ToolMenu[] = [
    {
        displayName: 'Geometry', child: [
            { displayName: 'Box', param: GEOM.BOX },
            { displayName: 'Cylinder', param: GEOM.CYLINDER },
            { displayName: 'Disc', param: GEOM.DISC },
            { displayName: 'Icosphere', param: GEOM.ICOSPHERE },
            { displayName: 'Plane', param: GEOM.PLANE },
            { displayName: 'Polyhedron', param: GEOM.POLYHEDRON },
            { displayName: 'Torus', param: GEOM.TORUS },
            { displayName: 'Tube', param: GEOM.TUBE },
            { displayName: 'Ribbon', param: GEOM.RIBBON },
            { displayName: 'Sphere', param: GEOM.SPHERE },
        ]
    },
    { displayName: 'Functions', },
    { displayName: 'About Odin', }
];