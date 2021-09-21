import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Store } from '@ngrx/store';
import { ArcRotateCamera, Light, Mesh } from 'babylonjs';
import { filter } from 'rxjs/operators';
import { APP_ODIN_TITLE } from 'src/app/configuration/app-constants';
import { Container } from 'src/app/shared/container/container';
import { DataTreeContainer } from '../../engine/common/data-tree-contrainers';
import { SidebarPanelAction } from '../../models';
import { EngineService, LogService } from '../../services/index.service';
import { clearSelection, oneSelection, openSidebarPanel } from '../../store/actions';
import { AppState } from '../../store/app.reducer';
import { AppService } from './../../services/app.service';

export class flatTreeContainer {
  name: string;
  uuid: string;
  level: number;
  expandable: boolean;
  selected: boolean;
  hidden: boolean;
  locked: boolean;
  activeCamera: boolean;
}

@Component({
  selector: 'tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent implements AfterViewInit{
  flatNodeMap = new Map<flatTreeContainer, Container>();
  nestedNodeMap = new Map<Container, flatTreeContainer>();
  nestedMeshMap = new Map<Mesh | Light | ArcRotateCamera, flatTreeContainer>();
  selectedParent: flatTreeContainer | null = null;
  lastSelectedTreeNode: flatTreeContainer | null = null;

  treeControl: FlatTreeControl<flatTreeContainer>;
  treeFlattener: MatTreeFlattener<Container, flatTreeContainer>;
  dataSource: MatTreeFlatDataSource<Container, flatTreeContainer>;
  checklistSelection = new SelectionModel<flatTreeContainer>(true);

  dragNode: any;
  dragNodeExpandOverWaitTimeMs = 300;
  dragNodeExpandOverNode: any;
  dragNodeExpandOverTime: number;
  dragNodeExpandOverArea: string;
  @ViewChild('emptyItem') emptyItem: ElementRef;
  @ViewChild('transformMenuValue') transformMenuValue: ElementRef;

  isReadOnly: boolean = true;
  isEngineLoadedSubscriber;

  containerPlugUuidSelected : string;
  plugUuidSelected : string;

  constructor(
    public store: Store<AppState>,
    public appServ: AppService,
    public dataTree: DataTreeContainer,
    public injector: Injector,
    private engineServ: EngineService, public logServ: LogService) {

    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<flatTreeContainer>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.store.select('engine').subscribe((engine) => {
      this.containerPlugUuidSelected = engine.containerPlugUuidSelected
      this.plugUuidSelected = engine.plugUuidSelected
    });

    this.isEngineLoadedSubscriber = this.store.select('engine').subscribe(engine => {
      if (engine.isLoaded) {
        this.init();
        console.log(APP_ODIN_TITLE);
        console.log("ENGINE LOADED!")
        this.appServ.createDefaultScene();
        this.isEngineLoadedSubscriber.unsubscribe();
      }
    });
  }
  ngAfterViewInit(): void {
    let el = this.transformMenuValue.nativeElement;
    onkeydown = (e) => {
      if (e.keyCode == 46 || e.keyCode == 8) {
        this.appServ.removePlugSelectedFromContainer(this.containerPlugUuidSelected, this.plugUuidSelected);
      }};
      
    el.addEventListener("keydown", onkeydown, false);

  }

  init(): void {
    this.dataTree.initDataTreeNode();
    this.dataTree.dataChange.subscribe(data => {
      this.dataSource.data = [];
      this.dataSource.data = data;
    });

    this.engineServ.emitNewContainerTreeNode$
      .pipe(filter((cont: Container) => cont != undefined))
      .subscribe(c => {
        this.dataTree.inserNewtItem(c);
      });

    this.engineServ.updateTreeNode$.subscribe(ignore => this.dataTree.updateTreeNode());
  }

  getLevel = (node: flatTreeContainer) => node.level;
  isExpandable = (node: flatTreeContainer) => node.expandable;
  getChildren = (node: Container): Container[] => node.children;
  hasChild = (_: number, _nodeData: flatTreeContainer) => _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: flatTreeContainer) => _nodeData.name === '';

  transformer = (node: Container, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name
      ? existingNode
      : new flatTreeContainer();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.uuid = node.uuid;
    flatNode.selected = node.selected;
    flatNode.hidden = node.hidden;
    flatNode.expandable = (node.children && node.children.length > 0);
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  handleDragStart(event, node) {
    event.dataTransfer.setData('foo', 'bar');
    event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
    this.dragNode = node;
    this.treeControl.collapse(node);
  }

  handleDragOver(event, node) {
    event.preventDefault();

    if (node === this.dragNodeExpandOverNode) {
      if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
        if ((new Date().getTime() - this.dragNodeExpandOverTime) > this.dragNodeExpandOverWaitTimeMs) {
          this.treeControl.expand(node);
        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }

    const percentageY = event.offsetY / event.target.clientHeight;
    if (percentageY < 0.25) {
      this.dragNodeExpandOverArea = 'above';
    } else if (percentageY > 0.75) {
      this.dragNodeExpandOverArea = 'below';
    } else {
      this.dragNodeExpandOverArea = 'center';
    }
  }

  handleDrop(event, node) {
    event.preventDefault();
    if (node !== this.dragNode) {
      let newItem: Container;
      if (this.dragNodeExpandOverArea === 'above') {
        newItem = this.dataTree.above(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
      } else if (this.dragNodeExpandOverArea === 'below') {
        newItem = this.dataTree.below(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
      } else {
        newItem = this.dataTree.moveContainer(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
      }
      this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
    }
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  handleDragEnd(event) {
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }


  clickHideNode(event, node: flatTreeContainer) {
    let container: Container = this.flatNodeMap.get(node);
    if (!container.hidden) {
      container.hide();
      node.hidden = true;
    } else {
      container.unHide();
      node.hidden = false;
    }
  }


  clickDeleteNode(event) {
    if (!this.appServ.noSelected()) {
      this.dataTree.deleteNodeAndChildren(this.appServ.getFirstSelected());
      this.store.dispatch(clearSelection());
    }
  }

  openSidebarPanel(panel: number) {
    const osp = new SidebarPanelAction(panel, true);
    this.store.dispatch(openSidebarPanel({ action: osp }));
  }

  searchElement(containerName: String) {
    this.appServ.uuidToContainer.forEach(c => {
      if (c.name.toUpperCase() === containerName.toUpperCase()) this.store.dispatch(oneSelection({ uuid: c.uuid }));
    });

  }

  createNewContainer(event) {
    this.appServ.newContainer();
  }

  addNewDefaultMaterial(event) {
    this.appServ.addDefaultMaterial();
  }

  /** Hide containers */
  checkHideDirectDescendants() {
    if (this.appServ.noSelected()) return;
    let fs = this.appServ.getFirstSelected();
    this.hideContainers(fs);
  }

  hideContainers(c: Container) {
    c.hide();
    this.nestedNodeMap.get(c).hidden = true;
    c.children.forEach(c => {
      c.hide();
      this.nestedNodeMap.get(c).hidden = true;
      this.hideContainers(c);
    });
  }

  checkUnHideDirectDescendants() {
    if (this.appServ.noSelected()) return;
    let fs = this.appServ.getFirstSelected();
    this.unHideContainers(fs);

  }

  unHideContainers(c: Container) {
    c.unHide();
    this.nestedNodeMap.get(c).hidden = false;
    c.children.forEach(c => {
      c.unHide();
      this.nestedNodeMap.get(c).hidden = false;
      this.unHideContainers(c);
    });
  }

  /** Lock containers */
  checkLockDirectDescendants() {
    if (this.appServ.noSelected()) return;
    let fs = this.appServ.getFirstSelected();
    this.lockContainers(fs);
  }

  lockContainers(c: Container) {
    c.lock();
    this.nestedNodeMap.get(c).locked = true;
    c.children.forEach(c => {
      c.lock();
      this.nestedNodeMap.get(c).locked = true;
      this.lockContainers(c);
    });
  }

  checkUnLockDirectDescendants() {
    if (this.appServ.noSelected()) return;
    let fs = this.appServ.getFirstSelected();
    this.unLockContainers(fs);
  }

  unLockContainers(c: Container) {
    c.unlock();
    this.nestedNodeMap.get(c).locked = false;
    c.children.forEach(c => {
      c.unlock();
      this.nestedNodeMap.get(c).locked = false;
      this.unLockContainers(c);
    });
  }

}