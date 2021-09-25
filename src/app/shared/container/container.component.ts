import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { AppService } from 'src/app/services/index.service';
import {
  addSelection,
  clearAllPlugSelection,
  onePlugSelection,
  oneSelection,
} from 'src/app/store/actions';
import { Plug } from './../../engine/plugs/plug';
import { LogService } from './../../services/log.service';
import { AppState } from './../../store/app.reducer';
import { flatTreeContainer } from './../../ui/tree-node/tree-node.component';
import { Container } from './container';

@Component({
  selector: 'container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
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
  ) {}

  ngOnInit(): void {
    this.dataContainer = this.appServ.getContainerFromUuid(this.data.uuid);
    this.listPlugs = this.dataContainer.plugs;
    this.store.select('engine').subscribe((engine) => {
      if (engine.containerPlugUuidSelected !== this.data.uuid) {
        this.listPlugs.forEach((p) => {
          p.isSelected = false;
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.handleClickAndDoubleClick();
  }

  selectContainer(event: any) {
    event.preventDefault();
    this.data.selected = !this.data.selected;
    this.store.dispatch(
      clearAllPlugSelection()
    );

    if (event.shiftKey) {
      // this.store.dispatch(addSelection({ uuid: this.data.uuid }));
    } else if (event.ctrlKey) {
      this.store.dispatch(addSelection({ uuid: this.data.uuid }));
    } else {
      this.store.dispatch(oneSelection({ uuid: this.data.uuid }));
    }
    this.logServ.log(this.data, 'container clicked', 'TreeNodeComponent');
  }

  public allowClickContainer: boolean = true;
  clickOnPlug(event: MouseEvent, plug: Plug) {

    event.preventDefault();
    setTimeout(() => {
      this.allowClickContainer = false;
    }, 300);
    this.allowClickContainer = false;
    let plugSelectedIndex = this.listPlugs.findIndex((p) => p.isSelected);

    if (
      plugSelectedIndex != -1 &&
      plug.uuid === this.listPlugs[plugSelectedIndex].uuid
    ) {
      plug.isSelected = false;
      this.store.dispatch(
        clearAllPlugSelection()
      );
      return;
    }


    this.listPlugs.forEach((p) => {
      p.isSelected = false;
    });

    plug.isSelected = true;
    this.store.dispatch(
      onePlugSelection({
        plugUuidSelected: plug.uuid,
        containerPlugUuidSelected: this.data.uuid,
      })
    );
  }

  hide() {
    this.dataContainer.hidden
      ? this.dataContainer.unHide()
      : this.dataContainer.hide();
  }

  lock() {
    this.dataContainer.locked
      ? this.dataContainer.unlock()
      : this.dataContainer.lock();
  }

  setName(event) {
    this.dataContainer.name = event;
  }

  handleClickAndDoubleClick() {
    const el = this.containerEl.nativeElement;
    const clickEvent = fromEvent<MouseEvent>(el, 'click');
    const dblClickEvent = fromEvent<MouseEvent>(el, 'dblclick');
    const eventsMerged = merge(clickEvent, dblClickEvent).pipe(
      debounceTime(100),
      filter((e) => this.allowClickContainer)
    );
    eventsMerged.subscribe((event) => {
      event.preventDefault();
      if (event.type === 'click') {
        this.selectContainer(event);
        return;
      }
      if (event.type === 'dblclick') {
        this.readOnlyInput = false;
        return;
      }
    });
  }
}
