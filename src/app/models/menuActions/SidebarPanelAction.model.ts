export enum SidebarPanel {
  TRANSFORMATION,
  GEOMETRY,
  MATERIAL,
  TEXTURE,
  LIGHT,
  CAMERA,
}
export class SidebarPanelAction {
  constructor(public panel: SidebarPanel, public open: boolean) {}
}
