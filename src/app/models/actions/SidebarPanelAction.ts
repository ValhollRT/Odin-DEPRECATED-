export enum SidebarPanel { TRANSFORMATION, GEOMETRY, MATERIAL, LIGHT, CAMERA }
export class SidebarPanelAction {
    constructor(
        public panel: SidebarPanel,
        public open: boolean
    ) { }
}