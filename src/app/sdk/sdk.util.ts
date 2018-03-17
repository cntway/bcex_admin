import * as enum_sdk from './sdk.enum';
export class FeildCheckError extends Error { }

export class QueryOp {
    static op_eq = '$eq';
    static op_in = '$eq';
    static op_like = '$like';
}

export class QueryParam {
    op_eq = '$eq';
    op_in = '$eq';
    op_like = '$like';
    PageIndex = 1;
    pageSize = 10;
    sort = '';
    key: string;
    value: string;
    op: string;
    constructor(key?: string, value?: string, op?: string) {
        this.key = key;
        this.value = value;
        this.op = op;
    }

    fields_check(): void {
    }

    parse() {
        const parames = { 'page': [this.PageIndex, this.pageSize] };
        if (this.sort !== '') {
            parames['sort'] = this.sort;
        }
        parames['where'] = parseQueryParam([this]);
    }
}

export function parseQueryParam(queryParam: Array<QueryParam>): any {
    const where = {};
    for (const query of queryParam) {
        const qv = {};
        qv[query.op] = query.value;
        where[query.key] = qv;
    }
    return where;
}

export function _(val: string): string {
    return val;
}


