import { HttpClient,HttpParams     } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private dataCache: { [key: string]: any[] } = {};

  constructor(
    private httpClient: HttpClient
  ) { }

  getUser(githubUsername: string) {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}`);
  }
  // implement getRepos method by referring to the documentation. Add proper types for the return type and params 
  getRepos(githubUsername: string, page: number, perPage: number): Observable<any[]> {
    const cacheKey = `${githubUsername}-${page}-${perPage}`;
    if (this.dataCache[cacheKey]) {
      return of(this.dataCache[cacheKey]);
    } else {
      return this.httpClient.get<any>(`https://api.github.com/users/${githubUsername}/repos?page=${page}&per_page=${perPage}`).pipe(
        tap((data) => {
          this.dataCache[cacheKey] = data; 
        })
      );
    }
  }

 
}
