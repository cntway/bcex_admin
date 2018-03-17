import { Component, OnInit } from '@angular/core';
import { AccountBase } from '../account.base';
import { MenuEditComponent } from './menu-edit/menu-edit.component';


@Component({
    selector: 'app-menue',
    templateUrl: './menu.component.html'
})

export class MenuComponent extends AccountBase {

    is_load_data = true;
    public title = '菜单管理';
    public columns = [
        { index: 'menuname', text: '名称', sort: true, width: '150px' },
        { index: 'pagehref', text: '链接', sort: true, width: '100px' },
        { index: 'funckey', text: '权限标识', sort: true, width: '100px' },
        { index: 'sortid', text: '排序', sort: true, width: '100px' },
        { index: 'remark', text: '图标', sort: true, width: '100px' },
        { index: 'isshow', text: '可见', sort: true, width: '50px' },
    ];

    expandDataCache = {};

    collapse(array, data, $event) {
        if ($event === false) {
            if (data.children) {
                data.children.forEach(d => {
                    const target = array.find(a => a.key === d.key);
                    target.expand = false;
                    this.collapse(array, target, false);
                });
            } else {
                return;
            }
        }
    }

    convertTreeToList(root) {
        const stack = [], array = [], hashMap = {};
        stack.push({ ...root, level: 0, expand: false });

        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
                }
            }
        }

        return array;
    }

    visitNode(node, hashMap, array) {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }

    transData(a, idStr, pidStr, chindrenStr) {
        let i = 0, j = 0;
        const r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, len = a.length;
        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            const aVal = a[j], hashVP = hash[aVal[pid]];
            if (typeof (hashVP) !== 'undefined') {
                if (!hashVP[children]) {
                    hashVP[children] = [];
                }
                hashVP[children].push(aVal);
                hashVP['hasChildren'] = true;
            } else {
                r.push(aVal);
            }
        }
        return r;
    }


    load(pi?: number) {
        if (typeof pi !== 'undefined') {
            this.pi = pi || 1;
        }
        // this.loading = true;
        this.loadData()
            .map(data => {
                const results = data['results'];
                for (const row of data['results']) {
                    row['name'] = row['menuname'];
                    row['id'] = row['menuid'];
                    row['key'] = row['menuid'];
                }
                return results;
            })
            .subscribe(data => {
                this.list = this.transData(data, 'menuid', 'parentid', 'children');
                this.list.forEach(item => {
                    this.expandDataCache[item.key] = this.convertTreeToList(item);
                });
            });
    }

    loadData() {
        return this.sdk.sys_menu_detail_get_api([], 1, 99999);
    }

    deleteData() {
        return this.sdk.sys_menu_detail_get_api([], 1, 99999);
    }

    edit(editData) {
        const me = this;
        const i = Object.assign({}, editData);
        console.log(editData);
        me.modalHelper.static(MenuEditComponent, { i }, 800).subscribe((saveOk) => {
            if (saveOk) {
                me.load();
            }
        });
    }

    addSub(parentData) {
        const me = this;
        const i = {};
        i['parentId'] = parentData.id;
        me.modalHelper.static(MenuEditComponent, { i }, 800).subscribe((saveOk) => {
            // 操作成功回调
            if (saveOk) {
                me.load();
                // me.message.info('操作成功');
            }
        });
    }

}
