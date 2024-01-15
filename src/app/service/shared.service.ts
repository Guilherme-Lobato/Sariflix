import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedVideoIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  setSelectedVideoId(videoId: string): void {
    this.selectedVideoIdSubject.next(videoId);
  }
  
  getSelectedVideoId(): Observable<string | null> {
    return this.selectedVideoIdSubject.asObservable();
  }
}
