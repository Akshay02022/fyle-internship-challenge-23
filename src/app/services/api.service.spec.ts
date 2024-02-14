import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApiService', () => {
  let apiService: ApiService;
  let httpTestingController: HttpTestingController;
  const username = 'exampleUser';
  const apiUrl = `https://api.github.com/users/${username}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService],
      imports: [HttpClientTestingModule],
    });

    apiService = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(apiService).toBeTruthy();
  });

  it('should fetch repos and cache the result', () => {
    const mockRepos = [{ id: 1, name: 'Repo1' }, { id: 2, name: 'Repo2' }];
    apiService.getRepos(username, 1, 10).subscribe((repos) => {
      expect(repos).toEqual(mockRepos);
    });
    const req = httpTestingController.expectOne(`${apiUrl}/repos?page=1&per_page=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });

  it('should return cached repos if available', () => {
    const mockRepos = [{ id: 1, name: 'Repo1' }, { id: 2, name: 'Repo2' }];
    apiService['dataCache']['exampleUser-1-10'] = mockRepos;
    apiService.getRepos('exampleUser', 1, 10).subscribe((repos) => {
      expect(repos).toEqual(mockRepos);
    });
    httpTestingController.expectNone(`${apiUrl}/repos?page=1&per_page=10`);
  });

  it('should return user data', () => {
    const userData = { login: 'exampleUser', name: 'John Doe' };
    apiService.getUser(username).subscribe((user) => {
      expect(user).toEqual(userData);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(userData);
  });

  it('should handle user data error', () => {
    apiService.getUser(username).subscribe(
      () => fail('Should have failed with 404'),
      (error) => expect(error.status).toEqual(404)
    );

    const req = httpTestingController.expectOne(apiUrl);
    req.flush('404 error', { status: 404, statusText: 'Not Found' });
  });

  it('should return repository data', () => {
    const reposData = [
      { id: 1, name: 'Repo1' },
      { id: 2, name: 'Repo2' },
      { id: 3, name: 'Repo3' }
    ];
    const page = 1;
    const perPage = 3;
    apiService.getRepos(username,page,perPage).subscribe((repos) => {
      expect(repos).toEqual(reposData);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/repos?page=${page}&per_page=${perPage}`);
    expect(req.request.method).toEqual('GET');
    req.flush(reposData);
  });

  it('should handle repository data error', () => {
    apiService.getRepos(username,1,10).subscribe(
      () => fail('Should have failed with 500'),
      (error) => expect(error.status).toEqual(500)
    );

    const req = httpTestingController.expectOne(`${apiUrl}/repos?page=1&per_page=10`);
    req.flush('500 error', { status: 500, statusText: 'Server Error' });
  });
  
});
