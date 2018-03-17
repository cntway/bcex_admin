import { OnInit, OnDestroy, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { NzMessageService } from 'ng-zorro-antd';
import { ModalHelper } from '@delon/theme';
import { SdkService } from '@sdk/sdk.service';


@Injectable()
export abstract class AccountBase implements OnInit, OnDestroy {

    pi = 1;
    ps = 10;
    total = 200; // mock total
    list = [];
    args: any = {};
    is_load_data = false;

    sub: Subscription;
    _loading: boolean;

    public abstract columns: Array<any>;
    public abstract edit(i): void;
    public abstract deleteData(i): Observable<any>;
    public abstract loadData(): Observable<any>;

    constructor(
        protected sdk: SdkService,
        protected message: NzMessageService,
        protected modalHelper: ModalHelper) {
    }

    /** 是否正在加载中 */
    get loading(): boolean {
        return this.sdk.loading;
    }

    load(pi?: number) {
        if (typeof pi !== 'undefined') {
            this.pi = pi || 1;
        }
        this.sub = this.loadData()
            .subscribe(data => {
                if (!data) {
                    return;
                }
                this.list = data.results;
            });
    }

    clear() {
        this.args = {};
    }

    showMsg(msg: string) {
        this.message.info(msg);
    }


    delete(i) {
        this.deleteData(i)
            .subscribe(data => {
                this.showMsg('删除成功');
                this.load(this.pi);
            });
    }

    ngOnInit() {
        if (this.is_load_data) {
            this.load();
        }
    }

    ngOnDestroy() {
        try {
            if (this.sub) {
                this.sub.unsubscribe();
            }
        } catch (e) {
            console.error(e);
        }
    }
}
