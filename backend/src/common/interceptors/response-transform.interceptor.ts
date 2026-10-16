import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Recursively ensures dual `id` and `_id` compatibility for any returned objects,
 * perfectly satisfying Next.js frontend requirements without altering PostgreSQL schema.
 */
function enrichDualIds(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => enrichDualIds(item));
  }

  if (typeof data === 'object' && !(data instanceof Date)) {
    const clone: Record<string, any> = Array.isArray(data) ? [] : { ...data };

    if ('id' in clone && clone.id && !('_id' in clone)) {
      clone._id = clone.id;
    } else if ('_id' in clone && clone._id && !('id' in clone)) {
      clone.id = clone._id;
    }

    for (const key of Object.keys(clone)) {
      if (typeof clone[key] === 'object' && clone[key] !== null) {
        clone[key] = enrichDualIds(clone[key]);
      }
    }

    return clone;
  }

  return data;
}

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Apply recursive _id <-> id mapping
        return enrichDualIds(data);
      }),
    );
  }
}
