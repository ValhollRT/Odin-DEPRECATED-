export enum SidebarPanel {
  TRANSFORMATION,
  GEOMETRY,
  MATERIAL,
  TEXTURE,
  LIGHT,
  CAMERA,
  AUDIO,
}
export class SidebarPanelAction {
  constructor(public panel: SidebarPanel, public open: boolean) {}
}
