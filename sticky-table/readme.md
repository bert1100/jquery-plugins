# Sticky-table插件

这是自写的jquery插件，用来表现大量表格时，固定thead和指定的columns。

### 用法

详细见：`大数据表格固定和列示例.html` 

指定固定列时：

```html
<link rel="stylesheet" href="jquery.stickytable.css">
<script src="jquery.stickytable.js"></script> 
<script>
  $(function(){
           $(".sticky-table-wrapper").chsiStickyTable(); // 现代模式
           $("#tolegacy").chsiLegacyTable(); // 经典模式
        });
</script>
...
<table border="0" cellpadding="0" cellspacing="0" style="width:0px;">
                        <colgroup>  
                            <col class="fixed" width="100">
                            <col class="fixed" width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                        </colgroup>
                            ...
          </table>
```



### 注意：

本jquery插件只兼容到ie6+



