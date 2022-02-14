(function ($) {


    function GZTagsInputMain() {

        var options = null;

        var jq_value = null
        var jq_itemContent = null
        var jq_input = null
        var jq_popup = null

        var isOverPopup = false

        var init = function (_options) {
            options = _options
            var popup_id = Math.random().toString(36).slice(-8)

            var currentInputID = Math.random().toString(36).slice(-8)


            var content = $(options.el)
            content.addClass('bootstrap-tags-input')


            content.html(`<div class="bootstrap-tags-input-control">
                        <div class="bootstrap-tags-input-selectitems">
                        </div>
                        <input type="hidden" value="" data-role="value" />
                        <input style="border:none;outline: none;background-color: rgba(0, 0, 0, 0);" id="${currentInputID}" data-role="input" type="text" />
                    </div>`)


            jq_value = content.find("input[data-role='value']")
            jq_itemContent = content.find(".bootstrap-tags-input-selectitems")
            jq_input = content.find("#" + currentInputID)

            options.popupContainer.append(`<div class="bootstrap-tags-input-popup" id="${popup_id}" style="display:none;"></div>`)

            jq_popup = $("#" + popup_id)
            refreshDataList('')
            refreshBind()

            jq_popup.mouseover(function () {
                isOverPopup = true
            });
            jq_popup.mouseout(function () {
                isOverPopup = false
            });
            if (options.value)
                setValue(options.value)
        };

        var refreshDataList = function (filter) {
            isMatch = false


            var data = getValue()

            var source = options.dataSource.filter(x => data.indexOf(x) < 0);
            if (filter != '') {
                source = source.filter(x => x.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) >= 0)
            }
            var dataList_html = source.map((item, index) => {
                if (item.toLocaleLowerCase() == filter.toLocaleLowerCase())
                    isMatch = true
                return `<div class="item ${index == 0 ? 'active' : ''}" data-role="data" data-value="${item}">${item}</div>`;
            }).join('\n')
            if (isMatch == false && filter != "") {
                dataList_html = `<div class="item ${dataList_html == '' ? 'active' : ''}" data-role="new" data-value="${filter}">添加新标签 "${filter}"</div>` + dataList_html
            }
            jq_popup.html(dataList_html)

            jq_popup.find('.item').unbind()
            jq_popup.find('.item').click(function () {
                jq_popup.find('.item.active').removeClass('active')
                $(this).addClass('active')
                applyVal()
                event.preventDefault()
                event.stopPropagation()
            })
        }

        var refreshBind = function () {

            jq_input.unbind();

            jq_input.on("input", function () {
                popupShow(this)
            })
            jq_input.focus(function () {
                popupShow(this)
            })
            jq_input.blur(function () {
                jq_input.val("")
                if (isOverPopup == false)
                    popupHide()
            })
            jq_input.keydown(function (event) {
                // 按下回车
                if (event.keyCode == 13) {
                    applyVal()
                }
                // 按下删除
                if (event.keyCode == 8) {
                    var val = $(this).val()
                    if (val == "") {
                        var selects = jq_itemContent
                        var item = selects.find(".item:last-child")
                        if (item.length > 0) {
                            delTag(item)
                            refreshDataList('')
                        }
                    }
                }
                // 向上剪头
                if (event.keyCode == 38) {
                    var current = jq_popup.find(`.item.active`)
                    var newItem = current.prev()
                    if (newItem.length > 0) {
                        current.removeClass('active')
                        newItem.addClass('active')
                        jq_popup.scrollTop(newItem[0].offsetTop)
                        //jq_popup.animate({
                        //    scrollTop: newItem[0].offsetTop
                        //})
                    }

                    event.preventDefault()
                    event.stopPropagation()
                }
                // 向下剪头
                if (event.keyCode == 40) {
                    var current = jq_popup.find(`.item.active`)
                    var newItem = current.next()
                    if (newItem.length > 0) {
                        current.removeClass('active')
                        newItem.addClass('active')

                        jq_popup.scrollTop(newItem[0].offsetTop - jq_popup.height() + newItem.height())
                    }
                    event.preventDefault()
                    event.stopPropagation()
                }

            })
        };

        // 显示标签选择弹窗
        var popupShow = function (input) {
            var filter = $(input).val()
            item = $(input).parents(".bootstrap-tags-input")

            var top = item.offset().top - options.popupContainer.offset().top + item[0].offsetHeight
            var left = item[0].offsetLeft
            var width = item.width();

            console.log('top='+top)
            jq_popup.css({
                "visibility": "unset",
                "position": "absolute",
                "left": left,
                "width": width,
                "top": top
            })
            refreshDataList(filter)
            jq_popup.show()
        };
        // 隐藏标签选择弹窗
        var popupHide = function () {
            jq_popup.hide()
        };

        // 添加标签
        var applyVal = function () {

            var val = jq_popup.find(`.item.active`).attr('data-value')

            if (val != "") {

                var data = getValue()
                if (data.indexOf(val) >= 0)
                    return;

                var selects = jq_itemContent
                selects.append(`<span class="item" data-tag="${val}">${val}<span class="del"></span></span>`)

                jq_input.val("")
                bindDelTag()
                data.push(val)
                jq_value.val(data.join(";"))

            }
            popupHide()
        };

        // 获得标签值
        var getValue = function () {
            var currentTag = jq_value.val();
            var data = []
            if (currentTag != '')
                data = currentTag.split(';')
            return data
        };


        var setValue = function (val) {
            jq_value.val(val.join(";"))
            var html = val.map((item) => {
                return `<span class="item" data-tag="${item}">${item}<span class="del"></span></span>`
            }).join('\n')
            jq_itemContent.html(html);
        }

        // 绑定标签删除事件
        var bindDelTag = function () {
            $(".bootstrap-tags-input .del").unbind();
            $(".bootstrap-tags-input .del").click(function () {
                var item = $(this).parents(".item")
                delTag(item)
            });
        };

        // 删除标签

        var delTag = function (ele_item) {
            var tag = ele_item.attr("data-tag")

            var data = getValue()
            data.splice(data.indexOf(tag), 1)
            jq_value.val(data.join(";"))

            ele_item.remove()
        }

        return {
            init: init,
            getValue: getValue,
            setValue: setValue
        }
    }

    window.GZTagsInput = function () {
        return {
            init: function (options) {
                /**
                 * 使用，先调用 GZTagsInput.init(options) 初始化组件，返回组件示例 GZTagsInputMain
                 * options设置属性
                 * options.el  要初始化的元素，jquery元素对象
                 * options.popupContainer popup的容器，jquery元素对象 pupup弹窗会附加在该容器内
                 * options.dataSource 数据源
                 * options.value 默认值，array类型,也可以初始化时不指定该参数，初始化后，调用GZTagsInputMain.setValue方法设置值
                 * */

                /**
                 * 组件示例提供如下方法
                 * GZTagsInputMain.getValue() 获得值，返回array类型
                 * GZTagsInputMain.setValue(array) 设置值，参数为array类型，也可以在初始化组件中指定options.value参数，
                 **/


                var intance = GZTagsInputMain()
                intance.init(options);
                return intance;
            }
        }
    }();
})(jQuery)