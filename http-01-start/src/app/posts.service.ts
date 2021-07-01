import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { catchError, map, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({providedIn: 'root'})
export class PostsService {
    error = new Subject<string>();

    constructor(private http: HttpClient) {}
    
    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content};
        this.http
        .post<{ name: string }>(
          'https://ng-complete-guide-7e045-default-rtdb.firebaseio.com/post.json',
          postData,
          {
              observe: 'response'
          }
        )
        .subscribe(
            responseData => {
                console.log(responseData);
            }, 
            error => {
                this.error.next(error.message);
            }
        );
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        return this.http
            .get<{ [key: string]: Post}>(
                'https://ng-complete-guide-7e045-default-rtdb.firebaseio.com/post.json',
                {
                    headers: new HttpHeaders({ 'Custom-Header' : 'Hello' }),
                    params: searchParams,
                    responseType: 'json'
                })
            .pipe(
                map((responseData: {[key: string]: Post}) => {
                    const postArray: Post[] = [];
                    for (const key in responseData) {
                        if(responseData.hasOwnProperty(key)) {
                            postArray.push({...responseData[key], id: key});
                        }
                    }
                    return postArray;
            }),
            catchError(errorRes => {
                return throwError(errorRes);
            })
        );
    }

    deletePosts() {
        return this.http.delete('https://ng-complete-guide-7e045-default-rtdb.firebaseio.com/post.json',
            {
                observe: 'events',
                responseType: 'text'
            }
        ).pipe(
            tap(event => {
                console.log(event);
                if(event.type === HttpEventType.Sent) {

                }
                if(event.type === HttpEventType.Response) {
                    console.log(event.body)
                }
            })
        );
    }
}