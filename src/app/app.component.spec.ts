import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule} from '@angular/common/http/testing';    
import { of, throwError } from 'rxjs';
import { ApiService } from './services/api.service';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [AppComponent],
      providers: [ApiService]
    })

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchUser and loadRepositories on ngOnInit', () => {
    spyOn(component, 'searchUser');
    spyOn(component, 'loadRepositories');
    component.ngOnInit();
    expect(component.searchUser).toHaveBeenCalled();
    expect(component.loadRepositories).toHaveBeenCalled();
  });

  it('should fetch user data', () => {
    const userMock = { login: 'Akshay02022', id: 98013844 }; 
    spyOn(apiService, 'getUser').and.returnValue(of(userMock));
    component.searchUser();
    expect(component.userData).toEqual(userMock);
    expect(component.isLoadingUser).toBeTrue();
  });

  it('should handle error when fetching user data', () => {
    spyOn(apiService, 'getUser').and.returnValue(throwError('Error fetching user'));
    component.searchUser();
    expect(component.userData).toBeNull();
    expect(component.repositories).toEqual([]);
  });

  it('should fetch repositories', () => {
    const reposMock = [{ id: 751237295, name: '30DaysNodeJSChallenge' }, { id: 713303486, name: 'Booklish' }];
    spyOn(apiService, 'getRepos').and.returnValue(of(reposMock));
    component.loadRepositories();
    expect(component.repositories).toEqual(reposMock);
    expect(component.isLoadingRepos).toBeTrue();
  });

  it('should handle error when fetching repositories', () => {
    spyOn(apiService, 'getRepos').and.returnValue(throwError('Error fetching repositories'));
    component.loadRepositories();
    expect(component.repositories).toEqual([]);
  });

  it('should change page and reload repositories', () => {
    spyOn(component, 'loadRepositories');
    component.changePage(2);
    expect(component.currentPage).toEqual(2);
    expect(component.loadRepositories).toHaveBeenCalled();
  });

  it('should change items per page and reload repositories', () => {
    spyOn(component, 'loadRepositories');
    component.changeItemsPerPage();
    expect(component.loadRepositories).toHaveBeenCalled();
  });
});
