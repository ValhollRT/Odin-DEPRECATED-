export enum SidebarPanel { TRANSFORMATION, GEOMETRY, MATERIAL, LIGHT }
export class SidebarPanelAction {
    constructor(
        public panel: SidebarPanel,
        public open: boolean
    ) { }
}