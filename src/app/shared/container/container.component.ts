import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PlugGeometry } from 'src/app/engine/plugs/plug-geometry';
import { AppService } from 'src/app/services/index.service';
import { addSelection, oneSelection } from 'src/app/store/actions';
import { Plug } from './../../engine/plugs/plug';
import { LogService } from './../../services/log.service';
import { AppState } from './../../store/app.reducer';
import { flatTreeContainer } from './../../ui/tree-node/tree-node.component';
import { Container } from './container';

@Component({
  selector: 'container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  @Input() data: flatTreeContainer;
  @ViewChild('container') containerEl: ElementRef;

  dataContainer: Container;
  listPlugs: Plug[];
  public readOnlyInput: boolean = true;

  constructor(
    public store: Store<AppState>,
    public logServ: LogService,
    public appServ: AppService
  ) { }

  ngOnInit(): void {
    this.dataContainer = this.appServ.getContainerFromUuid(this.data.uuid);
    this.listPlugs = this.dataContainer.plugs.filter((p) => p instanceof PlugGeometry && p.panel != undefined)
  }

  ngAfterViewInit(): void {
    this.handleClickAndDoubleClick();
  }

  selectContainer(event: any) {
    this.data.selected = !this.data.selected;
    if (event.shiftKey) {
      // this.store.dispatch(addSelection({ uuid: this.data.uuid }));
    }
    else if (event.ctrlKey) {
      this.store.dispatch(addSelection({ uuid: this.data.uuid }));
    }
    else {
      this.store.dispatch(oneSelection({ uuid: this.data.uuid }));
    }
    this.logServ.log(this.data, "container clicked", "TreeNodeComponent");
  }

  hide() {
    this.dataContainer.hidden ?
      this.dataContainer.unHide() :
      this.dataContainer.hide();
  }

  lock() {
    this.dataContainer.locked ?
      this.dataContainer.unlock() :
      this.dataContainer.lock();
  }

  setName(event) { this.dataContainer.name = event; }

  handleClickAndDoubleClick() {
    const el = this.containerEl.nativeElement;
    const clickEvent = fromEvent<MouseEvent>(el, 'click');
    const dblClickEvent = fromEvent<MouseEvent>(el, 'dblclick');
    const eventsMerged = merge(clickEvent, dblClickEvent).pipe(debounceTime(100));
    eventsMerged.subscribe(
      (event) => {
        event.preventDefault();
        if (event.type === 'click') {
          this.selectContainer(event);
          return;
        }
        if (event.type === 'dblclick') {
          this.readOnlyInput = false;
          return;
        }
      }
    );
  }

}
