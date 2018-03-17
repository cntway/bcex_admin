import { _HttpClient } from '@delon/theme';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NzMessageService } from 'ng-zorro-antd';

export const SERVICE_URl = '';

@Injectable()
export class SdkBase {
    private _loading = false;

    constructor(protected http: _HttpClient,
        protected message: NzMessageService) { }

    /** 是否正在加载中 */
    get loading(): boolean {
        return this.http.loading;
    }

    showError(msg: string): void {
        this.http.end();
        this.message.error(msg);
    }

    showMsg(msg: string): void {
        this.http.end();
        this.message.info(msg);

    }

    do(method: string, url: string, paramesModel: any): Observable<any> {
        const me = this;
        try {
            if (method !== 'get') {
                paramesModel.fields_check();
            } else {
                for (const key in paramesModel) {
                    paramesModel[key] = JSON.stringify(paramesModel[key]);
                }
            }
        } catch (error) {
            this.showError(error.message);
            return Observable.empty();
        }
        switch (method) {
            case 'post':
                return this.http.post(url, paramesModel.field2dict()).filter((res: any) => {
                    if (res.error === '0') {
                        return true;
                    } else {
                        me.showError(res.error_text);
                    }
                });
            case 'put':
                return this.http.put(url, paramesModel.field2dict()).filter(res => {
                    if (res.error === '0') {
                        return true;
                    } else {
                        me.showError(res.error_text);
                    }
                });
            case 'delete':
                return this.http.delete(url, {}, { body: paramesModel.field2dict() }).filter(res => {
                    if (res.error === '0') {
                        return true;
                    } else {
                        me.showError(res.error_text);
                    }
                });
            case 'get':
                return this.http.get(url, paramesModel).filter((res: any) => {
                    if (res.error === '0') {
                        return true;
                    } else {
                        me.showError(res.error_text);
                    }
                });
            default:
                this.showError(`错误的请求方法[${method}]`);
                return Observable.empty();
        }

    }
}
