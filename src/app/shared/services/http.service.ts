import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { mergeMap, retry } from 'rxjs/operators'
import { from, concat, Observable, toArray} from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
    })
  }

  get(url: string): Observable<{[k: string]: any}>{
    return this.http.get<{[k: string]: any}>(url, this.httpOptions)
  }

  getAllPages(url: string) {
    return this.recursiveGetAllPages(url).pipe(
      toArray(),
    )
  }

  recursiveGetAllPages(initUrl: string){
    var result = this.get(initUrl).pipe(
      // retry(3),
      mergeMap((value: any, index: number) => {
        var nextUrl: string = value['next']
        var reportJSONArray: [{[k: string] : any}] = value['results']
        var result = from(reportJSONArray)
        if (nextUrl != null) {
          result = concat(result, this.recursiveGetAllPages(nextUrl))
        }
        return result
      }),
    )

    return result
  }
}
