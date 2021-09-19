import { Color3 } from 'babylonjs';
export interface MaterialDto {
    id?: string;
    guid: string;
    name: string;
    date: Date;
    diffuseColor: Color3;
    ambientColor: Color3;
    specularColor: Color3;
    folderId: string;
  }
  