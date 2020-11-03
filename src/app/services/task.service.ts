import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Task} from '../models/task';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient,
              private toastr: ToastrService) { }

  createTask(data: Task): Promise<Task> {
    return this.http.post<Task>(environment.apiUrl + '/api/v1/task', data)
      .pipe(
        catchError(this.error)
      ).toPromise();
  }

  showTasks(): Promise<Task[]> {
    return this.http.get<Task[]>(environment.apiUrl + '/api/v1/task')
      .pipe(
      catchError(this.error)
    ).toPromise();
  }

  showTasksId(id: number): Promise<Task> {
    return this.http.get<Task>(environment.apiUrl + '/api/v1/task/' + id)
      .pipe(
        catchError(this.error)
      ).toPromise();
  }

  updateTask(id: number, data: Task): Promise<Task> {
    console.log(data.dataConclusao);
    return this.http.put<Task>(environment.apiUrl + '/api/v1/task/' + id, data, { headers: this.headers }).pipe(
      catchError(this.error)
    ).toPromise();
  }

  deleteTask(id: number) {
    return this.http.delete(environment.apiUrl + '/api/v1/task/' + id);
  }

  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
