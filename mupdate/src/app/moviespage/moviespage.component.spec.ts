import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviespageComponent } from './moviespage.component';

describe('MoviespageComponent', () => {
  let component: MoviespageComponent;
  let fixture: ComponentFixture<MoviespageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviespageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviespageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
