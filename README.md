# bootstrap-tags-input
基于bootstrap的标签选择，支持多选，和新建标签
* 支持数据源设置
* 支持新增
* 支持向上向下快捷键选择
* 支持del删除

## 界面预览
![](https://github.com/garsonzhang/bootstrap-tags-input/raw/master/imgs/p0.png) 
## 数据选择
![](https://github.com/garsonzhang/bootstrap-tags-input/raw/master/imgs/p1.gif) 

使用方法：

## 使用，先调用 GZTagsInput.init(options) 初始化组件，返回组件示例 GZTagsInputMain
options设置属性  
options.el  要初始化的元素，jquery元素对象  
options.popupContainer popup的容器，jquery元素对象 pupup弹窗会附加在该容器内  
options.dataSource 数据源  
options.value 默认值，array类型,也可以初始化时不指定该参数，初始化后，调用GZTagsInputMain.setValue方法设置值  

## 组件示例提供如下方法
GZTagsInputMain.getValue() 获得值，返回array类型  
GZTagsInputMain.setValue(array) 设置值，参数为array类型，也可以在初始化组件中指定options.value参数  

# 示例
引用资源
```
<link rel="stylesheet" href="/lib/bootstrap-tags-input/bootstrap-tags-input.css" />
<script src="~/lib/bootstrap-tags-input/bootstrap-tags-input.js"></script>
```
html代码  
```
<div class="form-group row no-gutters">
	<div class="col gz-layout gz-layout-row gz-layout-center">
		<label class="gz-form-label">标签</label>
		<div class="gz-layout-item" id="tags"></div>
	</div>
</div>
```
初始化tags  
```
editTag = GZTagsInput.init({
	el:$("#tags"),
	popupContainer:$("#form"),
	dataSource:dataSource,
	value:currentTag
})
```
获得值
```var vtags=editTag.getValue()```
