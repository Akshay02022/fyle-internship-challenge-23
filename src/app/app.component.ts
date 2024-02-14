import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  githubusername: any = 'Akshay02022';
  userData!: any;
  repositories: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  maxItemsPerPage: number = 100;
  isLoadingUser: Boolean = true;
  isLoadingRepos: Boolean = true;

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.searchUser();
    this.loadRepositories();
  }

  searchUser() {
    this.isLoadingUser = false;
    this.isLoadingRepos = false;
    this.apiService.getUser(this.githubusername).subscribe(
      (user) => {
        this.userData = user;
        this.isLoadingUser = true;
        this.loadRepositories();
      },
      (error) => {
        console.error('Error fetching user:', error);
        this.userData = null;
        this.repositories = [];
      }
    );
  }

  loadRepositories() {
    this.apiService.getRepos(this.githubusername, this.currentPage, this.itemsPerPage).subscribe(
      (repos) => {
        this.repositories = repos;
        this.isLoadingRepos = true;
      },
      (error) => {
        console.error('Error fetching repositories:', error);
        this.isLoadingRepos = true;
        this.repositories = [];
      }
    );
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
    this.loadRepositories();
  }
  
  changeItemsPerPage() {
    if (this.itemsPerPage > this.maxItemsPerPage) {
      this.itemsPerPage = this.maxItemsPerPage;
    }
    this.loadRepositories();
  }
}
