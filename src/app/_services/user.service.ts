import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { map, catchError } from 'rxjs/operators';
import { Client } from '../client';
import { Contact } from '../contact-us/contact-us.component';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" })
};


@Injectable({ providedIn: 'root' })
export class UserService {

  private handleError(error: HttpErrorResponse) {
    let errMsg: string;
    if (error.error instanceof ErrorEvent) {
      errMsg = error.error.message;
    } else {
      errMsg = `${error.status} - ${error.statusText || ''} ${error.error}`;
    }
    return throwError(errMsg);
  }

  public static BaseUrl = "http://localhost:6565/";

  constructor(private http: HttpClient) { }

  postfitnessdata(data: Client): Observable<Client> {
    return this.http.post<Client>(UserService.BaseUrl + 'allfriends', data, httpOptions).pipe(catchError(this.handleError));
  }

  getfitnessdata(): Observable<Client[]> {
    return this.http.get<Client[]>(UserService.BaseUrl + 'allfriends').pipe(catchError(this.handleError));
  }

  postcontactdata(data: Contact): Observable<Contact> {
    return this.http.post<Contact>(UserService.BaseUrl + 'contact', data, httpOptions).pipe(catchError(this.handleError));
  }

  deleteappointmentdata(data): Observable<Client[]> {
    return this.http.delete<Client[]>(UserService.BaseUrl + 'allfriends/' + data.id).pipe(catchError(this.handleError));
  }

  updatefitnessdata(data): Observable<Client> {
    return this.http.put<Client>(UserService.BaseUrl + 'allfriends/' + data.id, data, httpOptions).pipe(catchError(this.handleError));
  }
}
