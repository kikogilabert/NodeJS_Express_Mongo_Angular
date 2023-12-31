import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';
import { map } from 'rxjs/operators';

const URL = 'http://localhost:3000';
const URL_profile = 'http://localhost:3000/profile';

@Injectable({
    providedIn: 'root'
})

export class ProfileService {
    constructor(private http: HttpClient) { }

    get(username: string): Observable<Profile> {
        return this.http.get<Profile>(`${URL}/${username}`);
    }

    follow(username: string): Observable<any> {
        return this.http.post<any>(`${URL}/${username}/follow`,{});
    }

    unfollow(username: string): Observable<any> {
        return this.http.delete<any>(`${URL}/${username}/follow`);
    }

    get_user_profile(username: any): Observable<any> {
        return this.http.get<any>(`${URL_profile}/${username}`);
    }
}