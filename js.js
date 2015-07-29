/**
 * Created by Eric MA
 * Email: zjafei@gmail.com
 * Date: 2015/7/23
 * Time: 11:32
 */
define(function (require, exports, module) {
    //获取下拉菜单资源
    function getSelectData(container, max, index, callback, url, name, skin, idAry, pid) {
        var id = pid || idAry[index];
        if (index === max) {
            id = -1;//最后识别符
        }
        $.ajax({
            type: 'post',
            url: url,
            //url: '/s' + pid + '.txt',
            data: 'pid=' + id,
            async: false,
            dataType: 'json',
            success: function (data) {
                switch (data.status) {
                    case 0:
                        callback(data);
                        break;
                    case 1:
                        $('.js-' + name + '-linkage-select').eq(index).remove();
                        index++;
                        var sel = idAry[index] || data.selectList[0].id;
                        createSelect(container, data.selectList, sel, name, skin);
                        getSelectData(container, max, index, callback, url, name, skin, idAry, sel);
                        break;
                }
            },
            error: function () {
                alert('网络错误');
            }
        });
    }

    //创建下拉菜单
    function createSelect(container, data, id, name, skin) {
        var h = '';
        $.each(data, function () {
            h += '<option id="' + name + this.id + '" value="' + this.id + '">' + this.title + '</option>';
        });
        container.append('<select name="' + name + '[]" class="linkage-select ' + skin + ' js-' + name + '-linkage-select">' + h + '</select>');
        $('#' + name + id).prop('selected', true);
    }

    // 对外提供接口
    module.exports = function (obj) {
        var base = {//基本配置
            container: $('body'),//容器
            index: 0,//第几个select
            max: 2,//最多几个下拉菜单
            url: '',//下拉菜单资源地址
            name: '',//下拉菜单识别名
            idAry: [],//设置多个下拉菜单的选中值
            pid: '',//父级菜单的ID
            skin: '',//class
            callback: function () {
            }
        };
        $.extend(true, base, obj);
        base.idAry.unshift('');
        //console.log(base);
        getSelectData(base.container, base.max, base.index, base.callback, base.url, base.name, base.skin, base.idAry, base.pid);
        var selName = '.js-' + base.name + '-linkage-select';
        $('body').on('change', selName, function () {
            var myThis = $(this);
            myThis.nextAll(selName).remove();
            getSelectData(base.container, base.max, myThis.index() + 1, base.callback, base.url, base.name, base.skin, [], myThis.val());
        });
    }
});