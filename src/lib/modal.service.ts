import {
  ComponentRef,
  Injectable,
  Type,
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';

export interface ModalComponent extends Object {}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalHost!: HTMLDivElement;
  private modalMap = new Map<
    ModalComponent,
    {
      componentRef: ComponentRef<any>;
      dialogElement: HTMLDialogElement;
    }
  >();
  private modals: ModalComponent[] = [];

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector,
  ) {
    this.modalHost = document.createElement('div');
    this.modalHost.classList.add('modal-host');
    document.body.appendChild(this.modalHost);
  }

  public open<C extends ModalComponent>(
    ComponentClass: Type<C>,
    bindings?: Partial<C>,
  ) {
    document.body.classList.add('modal-open');

    // Create dialog element
    const dialogElement = document.createElement('dialog');
    dialogElement.classList.add('content');
    this.modalHost.appendChild(dialogElement);

    // Create component inside the dialog
    const componentRef = createComponent(ComponentClass, {
      environmentInjector: this.environmentInjector,
      hostElement: dialogElement,
    });

    // Set inputs if any
    for (const binding in bindings) {
      componentRef.setInput(binding, bindings[binding]);
    }

    // Attach view
    this.appRef.attachView(componentRef.hostView);

    // Add to modal tracking
    this.modals.push(componentRef.instance);
    this.modalMap.set(componentRef.instance, {
      componentRef,
      dialogElement,
    });

    // Use showModal instead of setAttribute('open', '')
    dialogElement.showModal();

    dialogElement.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close(componentRef.instance);
    });
    dialogElement.addEventListener('mousedown', (event) => {
      const rect = dialogElement.getBoundingClientRect();
      const isInDialog =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInDialog) {
        this.close(componentRef.instance);
      }
    });

    return componentRef.instance;
  }

  public close<C extends ModalComponent>(modal: C) {
    const modalData = this.modalMap.get(modal);
    if (modalData) {
      const { componentRef, dialogElement } = modalData;

      // Close the dialog properly
      dialogElement.close();

      // Clean up component
      this.appRef.detachView(componentRef.hostView);
      componentRef.hostView.destroy();

      // Remove dialog from DOM
      dialogElement.remove();

      // Update tracking
      this.modals.splice(this.modals.indexOf(modal), 1);
      this.modalMap.delete(modal);
    }

    if (this.modals.length === 0) {
      document.body.classList.remove('modal-open');
    }
  }
}
