import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { delay, mergeMap, retry, tap } from 'rxjs/operators'
import { from, concat, Observable, toArray} from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  debug: boolean = false

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
    })
  }

  get(url: string): Observable<{[k: string]: any}>{
    if(this.debug) console.time(`GET: ${url}`)
    return this.http.get<{[k: string]: any}>(url, this.httpOptions).pipe(
        tap((res: any) => { if(this.debug) console.timeEnd(`GET: ${url}`)})
      )
    }
    
    getAllPages(url: string) {
      if(this.debug) console.time(`GET ALL PAGES: ${url}`)
      return this.recursiveGetAllPages(url).pipe(
        toArray(),
        tap((res: any) => { if(this.debug) console.timeEnd(`GET ALL PAGES: ${url}`)})
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
