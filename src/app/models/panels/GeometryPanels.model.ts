import { PropertyPanel } from "src/app/ui/builder-panel/property-panel";

export interface GeometryPanel {
	values: any;
	properties: PropertyPanel<any>[];
}

export class BoxPanel implements GeometryPanel {
	values = { height: 10, width: 10, depth: 10 };
	properties: PropertyPanel<any>[] = [
		new PropertyPanel<string>({ controlType: 'number', key: 'height', label: 'Height', value: 'p.height' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'width', label: 'Width', value: 'p.width' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'depth', label: 'Depth', value: 'p.depth' })
	];
}

export class CylinderPanel implements GeometryPanel {
	values = { arc: 1, diameter: 10, height: 10, width: 10, subdivisions: 10, tessellation: 10 };
	properties: PropertyPanel<any>[] = [
		new PropertyPanel<string>({ controlType: 'number', key: 'arc', label: 'Arc', value: 'p.arc', step: "0.1" }),
		new PropertyPanel<string>({ controlType: 'number', key: 'diameter', label: 'Diameter', value: 'p.diameter', step: "0.1" }),
		new PropertyPanel<string>({ controlType: 'number', key: 'height', label: 'Height', value: 'p.height', step: "0.1" }),
		new PropertyPanel<string>({ controlType: 'number', key: 'subdivisions', label: 'Subdivisions', value: 'p.subdivisions', step: "1" }),
		new PropertyPanel<string>({ controlType: 'number', key: 'tessellation', label: 'Tessellation', value: 'p.tessellation', step: "1" })
	];
}

export class DiscPanel implements GeometryPanel {
	values = { arc: 1, radius: 10, tessellation: 10 };
	properties: PropertyPanel<any>[] = [
		new PropertyPanel<string>({ controlType: 'number', key: 'arc', label: 'Arc', value: 'p.arc' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'radius', label: 'Radius', value: 'p.diameter' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'tessellation', label: 'Tessellation', value: 'p.tessellation', step: "1" })
	];
}

export class IcoSpherePanel implements GeometryPanel {
	values = { radius: 10, subdivisions: 10 };
	properties: PropertyPanel<any>[] = [
		new PropertyPanel<string>({ controlType: 'number', key: 'radius', label: 'Radius', value: 'p.radius' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'subdivisions', label: 'Subdivisions', value: 'p.subdivisions', step: "1" })
	];
}

export class PlanePanel implements GeometryPanel {
	values = { width: 10, height: 10 };
	properties: PropertyPanel<any>[] = [
		new PropertyPanel<string>({ controlType: 'number', key: 'width', label: 'width', value: 'p.width' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'height', label: 'height', value: 'p.height' })
	];
}

export class PolyhedronPanel implements GeometryPanel {
	values = { type: 10, size: 10 };
	properties: PropertyPanel<any>[] = [
		new PropertyPanel<string>({ controlType: 'number', key: 'type', label: 'type', value: 'p.type' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'size', label: 'size', value: 'p.size' })
	];
}

export class TorusPanel implements GeometryPanel {
	values = { diameter: 10, thickness: 10, tessellation: 10 };
	properties: PropertyPanel<any>[] = [
		new PropertyPanel<string>({ controlType: 'number', key: 'diameter', label: 'diameter', value: 'p.diameter' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'thickness', label: 'thickness', value: 'p.thickness' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'tessellation', label: 'Tessellation', value: 'p.tessellation', step: "1" })
	];
}

export class CapsulePanel implements GeometryPanel {
	values = { capSubdivisions: 6, radius: 3, height: 10, subdivisions: 1, tessellation: 16 };
	properties: PropertyPanel<any>[] = [
		new PropertyPanel<string>({ controlType: 'number', key: 'capSubdivisions', label: 'capSubdivisions', value: 'p.capSubdivisions' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'radius', label: 'Radius', value: 'p.radius' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'height', label: 'height', value: 'p.height' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'subdivisions	', label: 'subdivisions	', value: 'p.subdivisions', step: "1" }),
		new PropertyPanel<string>({ controlType: 'number', key: 'tessellation', label: 'Tessellation', value: 'p.tessellation', step: "1" })
	];
}

export class SpherePanel implements GeometryPanel {
	values = { diameter: 10, segments: 8 };
	properties: PropertyPanel<any>[] = [
		new PropertyPanel<string>({ controlType: 'number', key: 'diameter', label: 'Diameter', value: 'p.diameter' }),
		new PropertyPanel<string>({ controlType: 'number', key: 'segments', label: 'Segments', value: 'p.segments' , step: "1"})
	];
}