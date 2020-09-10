import { TestBed, async, ComponentFixture } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

import * as Hello from './hello';
import { MockStore, provideMockStore, MockStoreConfig, MockState, MockReducerManager } from '@ngrx/store/testing';
import { Store, createSelector, StoreModule, ActionsSubject, ReducerManager } from '@ngrx/store';

// function spyOnModule(modulePath: string, exportSymbolName: string): jasmine.Spy {
//   const spy = jasmine.createSpy(`Spy of ${modulePath}#${exportSymbolName}`);
//   spyOnProperty(require(modulePath), prop).and.returnValue(spy);
//   return spy;
// }


const selectorTest = createSelector(
  (state: any) => state,
  state => state.value
);

export function getMockStore<T extends {}>(config: MockStoreConfig<T>): MockStore<T> {
  const store: MockStore<T> = new MockStore<T>(
    new MockState<T>(),
    new ActionsSubject(),
    new MockReducerManager() as ReducerManager,
    { ...config.initialState },
    config.selectors || []
  );

  return store;
}

fdescribe('Mock selectors with getMockStore', () => {
  it('selector 1 | test-1', () => {
    const store = getMockStore({ initialState: { value: 200 } });

    store.select(selectorTest).subscribe((value) => {
      console.log('selector 1 | test-1 => ', value);
    });
  });

  it('selector 2 | test-1', () => {
    const store = getMockStore({
      initialState: { value: 100 },
      // selectors: [
      //   {
      //     selector: selectorTest,
      //     value: 500
      //   }
      // ]
    });
    store.overrideSelector(selectorTest, 1000);

    store.select(selectorTest).subscribe((value) => {
      console.log('selector 2 | test-1 => ', value);
    });
  });
});


export function getMockStoreWithTestBed<T extends {}>(config: MockStoreConfig<T>): MockStore<T> {
  TestBed.configureTestingModule({
    providers: [
      provideMockStore({
        initialState: config.initialState,
        selectors: config.selectors || []
      }),
    ],
  });

  return TestBed.inject(MockStore);
}

fdescribe('Mock selectors with getMockStoreWithTestBed', () => {
  it('selector 1 | test-1', () => {
    const store = getMockStoreWithTestBed({ initialState: { value: 200 } });

    store.select(selectorTest).subscribe((value) => {
      console.log('selector 1 | test-1 => ', value);
    });
  });

  it('selector 2 | test-1', () => {
    const store = getMockStoreWithTestBed({
      initialState: { value: 100 },
      selectors: [
        {
          selector: selectorTest,
          value: 500
        }
      ]
    });
    // store.overrideSelector(selectorTest, 1000);

    store.select(selectorTest).subscribe((value) => {
      console.log('selector 2 | test-1 => ', value);
    });
  });
});


describe('Resets selectors after each test', () => {
  const selectorUnderTest = createSelector(
    (state: any) => state,
    state => state.value
  );
  let shouldSetMockStore = true;

  function setupModules(isMock: boolean) {
    if (isMock) {
      TestBed.configureTestingModule({
        providers: [
          provideMockStore({
            initialState: {
              value: 100,
            },
            selectors: [{ selector: selectorUnderTest, value: 200 }],
          }),
        ],
      });
    } else {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({} as any, {
            initialState: {
              value: 300,
            },
          }),
        ],
      });
    }
  }

  /**
   * Tests run in random order, so that's why we have two attempts (one runs
   * before another - in any order) and whichever runs the test first would
   * setup MockStore and override selector. The next one would use the regular
   * Store and verifies that the selector is cleared/reset.
   */
  it('should reset selector - attempt one', (done: any) => {
    setupModules(shouldSetMockStore);
    const store: Store<{}> = TestBed.inject(Store);
    store.select(selectorUnderTest).subscribe(v => {
      expect(v).toBe(shouldSetMockStore ? 200 : 300);
      shouldSetMockStore = false;
      done();
    });
  });

  it('should reset selector - attempt two', (done: any) => {
    setupModules(shouldSetMockStore);
    const store: Store<{}> = TestBed.inject(Store);
    store.select(selectorUnderTest).subscribe(v => {
      expect(v).toBe(shouldSetMockStore ? 200 : 300);
      shouldSetMockStore = false;
      done();
    });
  });
});

xdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    // const fixture = TestBed.createComponent(AppComponent);
    // const app = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it(`should have as title 'angular9-template'`, () => {
    // const fixture = TestBed.createComponent(AppComponent);
    // const app = fixture.componentInstance;
    expect(component.title).toEqual('angular9-template');
  });

  it('should render title', () => {
    // const fixture = TestBed.createComponent(AppComponent);
    // fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('angular9-template app is running!');
  });

  it('should getData', () => {
    // const fixture = TestBed.createComponent(AppComponent);
    // fixture.detectChanges();
    // const compiled = fixture.nativeElement;
    const mockData = ['a', 'b', 'c'];
    const mockGetData = jasmine.createSpy('mockGetData').and.callFake(() => {
      return mockData;
    });
    // spyOn(Hello, 'getData');
    // (Hello.getData as jasmine.Spy).and.callFake(() => mockData as any);
    // // (Hello.getData as jasmine.Spy);
    spyOnProperty(require('./hello'), 'getData', 'get').and.returnValue(mockGetData);


    component.ngOnInit();

    expect(component.data).toEqual(mockData);
    // expect(compiled.querySelector('.content span').textContent).toContain('angular9-template app is running!');
  });
});
