import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'castList' })
 export class CastListPipe implements PipeTransform {
     transform<S, T extends S>(value: S[] | null | undefined, type?: new () => T): T[] {
         return <T[]>value
     }
}
