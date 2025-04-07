# ng-modal-service

A lightweight, flexible Angular modal service that uses the native HTML dialog element.

## Features

- Modern implementation using Angular's standalone components
- Uses native HTML dialog element for better accessibility
- Simple API to open and close modals
- Supports passing data to modal components
- ESC key and clicking outside closes modal by default

## Installation

```bash
npm install ng-modal-service
```

## Usage

### Import the module

```typescript
import { ModalService } from 'ng-modal-service';

@NgModule({
  imports: [
    ModalService
  ]
})
export class AppModule { }
```

### Create a modal component

```typescript
import {Component} from '@angular/core';
import {ModalService} from "ng-modal-service";

@Component({
  selector: 'app-example-modal',
  template: `
    <header >
      <h2>{{ title }}</h2>
    </header>
    <p>
      {{ message }}
    </p>
    <footer>
      <button (click)="close()">Close</button>
    </footer>
  `,
})
export class ExampleModalComponent {
  title = 'Example Modal';
  message = 'This is an example modal';

  constructor(protected modalService: ModalService) {}

  close() {
    this.modalService.close(this);
  }
}
```

### Use the service to open and close modals

```typescript
import { Component } from '@angular/core';
import { ModalService } from 'ng-modal-service';
import { ExampleModalComponent } from './example-modal.component';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="openModal()">Open Modal</button>
  `,
})
export class AppComponent {
  constructor(private modalService: ModalService) {}

  openModal() {
    const exampleModalComponent = this.modalService.open(ExampleModalComponent, {
      title: 'Custom Title',
      message: 'This is a custom message',
    });
    
    // use the modalService to close it
    // modalService.close(exampleModalComponent);
  }
}
```

[//]: # ()
[//]: # (## Styling)

[//]: # ()
[//]: # (Import the default styles in your global styles file:)

[//]: # ()
[//]: # (```scss)

[//]: # (@import 'node_modules/ng-modal-service/lib/styles/modal.scss';)

[//]: # (```)

[//]: # ()
[//]: # (Or override them with your own styles.)

## License

MIT
