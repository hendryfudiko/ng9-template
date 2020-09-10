import { Directive, Inject } from '@angular/core';

import { CompareToDirective } from 'catapa-ui-mock';
import { WINDOW } from './custom.token';

@Directive({
  selector: '[appCompareToTest]'
})
export class CompareToTestDirective extends CompareToDirective {

  constructor(@Inject(WINDOW) window: any) {
    super(window);
    console.log('qweqweqweqwe')
  }

}
