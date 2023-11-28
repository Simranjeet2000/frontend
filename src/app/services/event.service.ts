import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'https://localhost:7202/api';
  private eventsSubject = new BehaviorSubject<any[]>([]);
  public events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient) {}

  addEvent(events: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ValuesEvent/AddEvent`, events);
  }

  deleteEvent(eventToDelete: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: eventToDelete,
    };
    return this.http.delete<any>(
      `${this.apiUrl}/ValuesEvent/DeleteEvent`,
      options
    );
  }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ValuesEvent`);
  }

  updateEvent(updatedEvent: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/ValuesEvent/UpdateEvent`, updatedEvent);
  }
}
