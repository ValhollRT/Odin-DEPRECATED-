import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, Injectable, ViewChild } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { PopupDialogAction } from 'src/app/models';
import { AppService } from 'src/app/services/index.service';
import {
  folderExplorerId,
  openCreateNewMaterial,
  openUploadNewAudio,
  openUploadNewFont,
  openUploadNewImage,
} from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducer';
import { DatabaseService, Directory } from './../../services/database.service';

export class FolderNode {
  id: string;
  name: string;
  parent: string;
  children: FolderNode[];
}

export class FolderFlatNode {
  id: string;
  name: string;
  parent: string;
  children: FolderNode[];
  active: boolean;
  level: number;
  expandable: boolean;
}

const TREE_DATA = {};

@Injectable()
export class folderDatabase {
  dataChange = new BehaviorSubject<FolderNode[]>([]);
  get data(): FolderNode[] {
    return this.dataChange.value;
  }
  constructor() {
    this.initialize();
  }

  initialize() {
    const data = this.buildFileTree(TREE_DATA, 0);
    this.dataChange.next(data);
  }

  buildFileTree(obj: object, level: number): FolderNode[] {
    return Object.keys(obj).reduce<FolderNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FolderNode();
      node.name = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.name = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }

  insertItem(parent: FolderNode, name: string): FolderNode {
    if (!parent.children) {
      parent.children = [];
    }
    const newItem = { name: name } as FolderNode;
    parent.children.push(newItem);
    this.dataChange.next(this.data);
    return newItem;
  }

  insertItemAbove(node: FolderNode, name: string): FolderNode {
    const parentNode = this.getParentFromNodes(node);
    const newItem = { name: name } as FolderNode;
    if (parentNode != null) {
      parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
    } else {
      this.data.splice(this.data.indexOf(node), 0, newItem);
    }
    this.dataChange.next(this.data);
    return newItem;
  }

  insertItemBelow(node: FolderNode, name: string): FolderNode {
    const parentNode = this.getParentFromNodes(node);
    const newItem = { name: name } as FolderNode;
    if (parentNode != null) {
      parentNode.children.splice(
        parentNode.children.indexOf(node) + 1,
        0,
        newItem
      );
    } else {
      this.data.splice(this.data.indexOf(node) + 1, 0, newItem);
    }
    this.dataChange.next(this.data);
    return newItem;
  }

  getParentFromNodes(node: FolderNode): FolderNode {
    for (let i = 0; i < this.data.length; ++i) {
      const currentRoot = this.data[i];
      const parent = this.getParent(currentRoot, node);
      if (parent != null) {
        return parent;
      }
    }
    return null;
  }

  getParent(currentRoot: FolderNode, node: FolderNode): FolderNode {
    if (currentRoot.children && currentRoot.children.length > 0) {
      for (let i = 0; i < currentRoot.children.length; ++i) {
        const child = currentRoot.children[i];
        if (child === node) {
          return currentRoot;
        } else if (child.children && child.children.length > 0) {
          const parent = this.getParent(child, node);
          if (parent != null) {
            return parent;
          }
        }
      }
    }
    return null;
  }

  updateItem(node: FolderNode, name: string) {
    node.name = name;
    this.dataChange.next(this.data);
  }

  deleteItem(node: FolderNode) {
    this.deleteNode(this.data, node);
    this.dataChange.next(this.data);
  }

  copyPasteItem(from: FolderNode, to: FolderNode): FolderNode {
    const newItem = this.insertItem(to, from.name);
    if (from.children) {
      from.children.forEach((child) => {
        this.copyPasteItem(child, newItem);
      });
    }

    return newItem;
  }

  copyPasteItemAbove(from: FolderNode, to: FolderNode): FolderNode {
    const newItem = this.insertItemAbove(to, from.name);
    if (from.children) {
      from.children.forEach((child) => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  copyPasteItemBelow(from: FolderNode, to: FolderNode): FolderNode {
    const newItem = this.insertItemBelow(to, from.name);
    if (from.children) {
      from.children.forEach((child) => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  deleteNode(nodes: FolderNode[], nodeToDelete: FolderNode) {
    const index = nodes.indexOf(nodeToDelete, 0);
    if (index > -1) {
      nodes.splice(index, 1);
    } else {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          this.deleteNode(node.children, nodeToDelete);
        }
      });
    }
  }
}

@Component({
  selector: 'explorer-panel',
  templateUrl: './explorer-panel.component.html',
  styleUrls: ['./explorer-panel.component.scss'],
})
export class ExplorerPanelComponent {
  flatNodeMap = new Map<FolderFlatNode, FolderNode>();
  nestedNodeMap = new Map<FolderNode, FolderFlatNode>();

  selectedParent: FolderFlatNode | null = null;
  newItemName = '';
  treeControl: FlatTreeControl<FolderFlatNode>;
  treeFlattener: MatTreeFlattener<FolderNode, FolderFlatNode>;
  dataSource: MatTreeFlatDataSource<FolderNode, FolderFlatNode>;

  checklistSelection = new SelectionModel<FolderFlatNode>(true /* multiple */);

  dragNode: any;
  dragNodeExpandOverWaitTimeMs = 300;
  dragNodeExpandOverNode: any;
  dragNodeExpandOverTime: number;
  dragNodeExpandOverArea: number;
  @ViewChild('emptyItem') emptyItem: ElementRef;

  isReadOnly: boolean = false;

  data: FolderNode[];
  constructor(
    private database: folderDatabase,
    private databaseServ: DatabaseService,
    public appServ: AppService,
    private store: Store<AppState>
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<FolderFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    database.dataChange.subscribe((data) => {
      this.dataSource.data = [];
      this.dataSource.data = data;
    });

    this.refreshTreeFolder();
  }

  getLevel = (node: FolderFlatNode) => node.level;
  isExpandable = (node: FolderFlatNode) => node.expandable;
  getChildren = (node: FolderNode): FolderNode[] => node.children;
  hasChild = (_: number, _nodeData: FolderFlatNode) => _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: FolderFlatNode) =>
    _nodeData.name === '';

  transformer = (node: FolderNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : new FolderFlatNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.id = node.id;
    flatNode.children = node.children;
    flatNode.parent = node.parent;
    flatNode.expandable = node.children && node.children.length > 0;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  public fDbFlatNodes = new Map<string, FolderNode>();
  refreshTreeFolder() {
    this.flatNodeMap.clear();
    this.nestedNodeMap.clear();
    this.fDbFlatNodes.clear();

    this.databaseServ.getDirectories().subscribe((dirs: any) => {
      dirs.forEach((e) => {
        let folder = new FolderNode();
        folder.id = e.id;
        folder.name = e.data().name;
        folder.children = [];
        folder.parent = e.data().parent;
        this.fDbFlatNodes.set(folder.id, folder);
      });

      this.fDbFlatNodes.forEach((f) => this.moveFolderToChildren(f));
      Array.from(this.fDbFlatNodes.keys()).forEach((k) => {
        if (k.startsWith('DELETE')) this.fDbFlatNodes.delete(k);
      });
      this.database.dataChange.next(Array.from(this.fDbFlatNodes.values()));

      let firstFolder = Array.from(this.fDbFlatNodes.values()).filter(
        (folder) => folder.parent == ''
      )[0];
      this.setActiveFolder(undefined, firstFolder);
    });
  }

  moveFolderToChildren(f: FolderNode) {
    if (f.parent == '' || f.parent == undefined) return;
    if (f.children.length > 0)
      f.children.forEach((folder) => this.moveFolderToChildren(folder));
    let parent: FolderNode = this.fDbFlatNodes.get(f.parent);
    let parentDelete: FolderNode = this.fDbFlatNodes.get('DELETE' + f.parent);
    if (parent != undefined) {
      if (parent.children.indexOf(f) != -1) return;
      parent.children.push(f);
    }

    if (parentDelete != undefined) {
      if (parentDelete.children.indexOf(f) != -1) return;
      parentDelete.children.push(f);
    }

    this.fDbFlatNodes.set('DELETE' + f.id, f);
    this.fDbFlatNodes.delete(f.id);
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: FolderFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FolderFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: FolderFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  addNewFolder() {
    this.databaseServ
      .createFolder(this.selectedNode == undefined ? '' : this.selectedNode.id)
      .then(() => {
        this.refreshTreeFolder();
      });
  }

  /** Save the node to database */
  saveNode(node: FolderFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode, itemValue);
  }

  handleDragStart(event, node) {
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
    event.dataTransfer.setData('foo', 'bar');
    this.dragNode = node;
    this.treeControl.collapse(node);
  }

  handleDragOver(event, node) {
    event.preventDefault();
    // Handle node expand
    if (this.dragNodeExpandOverNode && node === this.dragNodeExpandOverNode) {
      if (
        Date.now() - this.dragNodeExpandOverTime >
        this.dragNodeExpandOverWaitTimeMs
      ) {
        if (!this.treeControl.isExpanded(node)) {
          this.treeControl.expand(node);
          //this.cd.detectChanges();
        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }

    // Handle drag area
    const percentageY = event.offsetY / event.target.clientHeight;
    if (0 <= percentageY && percentageY <= 0.25) {
      this.dragNodeExpandOverArea = 1;
    } else if (1 >= percentageY && percentageY >= 0.75) {
      this.dragNodeExpandOverArea = -1;
    } else {
      this.dragNodeExpandOverArea = 0;
    }
  }

  public selectedNode = undefined;
  setActiveFolder(event, node) {
    if (!!event) event.stopPropagation();
    if (this.selectedNode != undefined) this.selectedNode.active = false;
    this.selectedNode = node;
    node.active = true;
    this.readFolderContent(node);
    this.store.dispatch(
      folderExplorerId({ folderExplorerId: this.selectedNode.id })
    );
  }

  desactiveFolder(event) {
    event.stopPropagation();
    if (this.selectedNode != undefined) this.selectedNode.active = false;
    this.selectedNode = undefined;
    this.store.dispatch(
      folderExplorerId({ folderExplorerId: this.selectedNode?.id })
    );
  }

  handleDrop(event, node) {
    if (node !== this.dragNode) {
      let newItem: FolderNode;
      if (this.dragNodeExpandOverArea === 1) {
        newItem = this.database.copyPasteItemAbove(
          this.flatNodeMap.get(this.dragNode),
          this.flatNodeMap.get(node)
        );
        if (this.dragNode.parent == node.id) this.dragNode.parent = node.parent;
        else this.dragNode.parent = node.id;
        let dir: Directory = { ...this.dragNode, parent: node.id };
        this.databaseServ.setNewParentFolder(this.dragNode.id, dir).then(() => {
          this.refreshTreeFolder();
        });
      } else if (this.dragNodeExpandOverArea === -1) {
        newItem = this.database.copyPasteItemBelow(
          this.flatNodeMap.get(this.dragNode),
          this.flatNodeMap.get(node)
        );
        this.dragNode.parent = node.id;
        let dir: Directory = { ...this.dragNode, parent: node.id };
        this.databaseServ.setNewParentFolder(this.dragNode.id, dir).then(() => {
          this.refreshTreeFolder();
        });
      } else {
        newItem = this.database.copyPasteItem(
          this.flatNodeMap.get(this.dragNode),
          this.flatNodeMap.get(node)
        );
        this.dragNode.parent = node.id;
        let dir: Directory = { ...this.dragNode, parent: node.id };
        this.databaseServ.setNewParentFolder(this.dragNode.id, dir).then(() => {
          this.refreshTreeFolder();
        });
      }

      this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
      this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
    }

    this.handleDragEnd(event);
  }

  handleDragEnd(event) {
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
    this.dragNodeExpandOverArea = NaN;
    event.preventDefault();
  }

  getStyle(node: FolderFlatNode) {
    if (this.dragNode === node) {
      return 'drag-start';
    } else if (this.dragNodeExpandOverNode === node) {
      switch (this.dragNodeExpandOverArea) {
        case 1:
          return 'drop-above';
        case -1:
          return 'drop-below';
        default:
          return 'drop-center';
      }
    }
  }

  deleteItem(node: FolderFlatNode) {
    this.database.deleteItem(this.flatNodeMap.get(node));
  }

  renameFolder(event, node) {
    if (node.name == event) return;
    node.name = this.flatNodeMap.get(node).name = event;
    this.databaseServ
      .renameFolder(node.id, new Directory(event, node.parent))
      .then(() => {
        this.refreshTreeFolder();
      });
  }

  deleteFolder() {
    if (this.selectedNode == undefined) return;
    this.databaseServ.deleteFolder(this.selectedNode.id).then(() => {
      this.refreshTreeFolder();
    });
  }

  openCreateNewMaterialDialog() {
    this.store.dispatch(
      openCreateNewMaterial({ createNewMaterial: new PopupDialogAction(true) })
    );
  }

  openUploadNewImageDialog() {
    this.store.dispatch(
      openUploadNewImage({ uploadNewImage: new PopupDialogAction(true) })
    );
  }
  openUploadNewAudioDialog() {
    this.store.dispatch(
      openUploadNewAudio({ uploadNewAudio: new PopupDialogAction(true) })
    );
  }
  openUploadNewFontDialog() {
    this.store.dispatch(
      openUploadNewFont({ uploadNewFont: new PopupDialogAction(true) })
    );
  }

  public contentFolder: any[] = [];
  async readFolderContent(node: FolderFlatNode) {
    this.contentFolder = [];
    let materials = await this.databaseServ.getMaterialsFromFolderId(node.id);
    let images = await this.databaseServ.getImagesFromFolderId(node.id);
    let fonts = await this.databaseServ.getFontsFromFolderId(node.id);
    let audios = await this.databaseServ.getAudiosFromFolderId(node.id);

    materials.docs.forEach((d) => {
      this.contentFolder.push({
        ...d.data(),
        type: 'MATERIAL',
        id: d.id,
        selected: false,
      });
    });

    images.docs.forEach((d) => {
      this.contentFolder.push({
        ...d.data(),
        type: 'IMAGE',
        id: d.id,
        selected: false,
      });
    });

    fonts.docs.forEach((d) => {
      this.contentFolder.push({
        ...d.data(),
        type: 'FONT',
        id: d.id,
        selected: false,
      });
    });

    audios.docs.forEach((d) => {
      this.contentFolder.push({
        ...d.data(),
        type: 'AUDIO',
        id: d.id,
        selected: false,
      });
    });
  }

  setBackgroundColor(item: any) {
    let styles = {
      'background-color': `rgb(${item.diffuseColor.r * 255},${
        item.diffuseColor.g * 255
      },${item.diffuseColor.b * 255})`,
    };
    return styles;
  }

  selectedItemStyle(item: any) {
    if (!item.selected) return;
    let styles = {
      border: `1px solid var(--console-debug-color)`,
    };
    return styles;
  }

  dblClickIconExplorer(event, node) {
    if (node.type == 'MATERIAL') this.appServ.addPlugMaterialFromDto(node);
    if (node.type == 'IMAGE') this.appServ.addPlugTextureFromDto(node);
    if (node.type == 'AUDIO') this.appServ.addPlugAudioFromDto(node);
    if (node.type == 'FONT') this.appServ.addPlugText(node.url);
  }

  clickIconExplorer(event, node) {
    this.clearSelectionExploreIcons();
    node.selected = true;
  }

  clearSelectionExploreIcons() {
    this.contentFolder.forEach((item) => {
      item.selected = false;
    });
  }
}
