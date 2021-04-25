import { SidebarPanelAction } from '../../models/menuActions/SidebarPanelAction.model';

export interface Plug {
    uuid: string;
    enable: boolean;
    icon: string;
    title: string;
    colorTile: string;
    getIcon();
    panel: any;
    openPanel: () => SidebarPanelAction;
    copy: () => Plug;
    dispose();
}