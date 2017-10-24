/* 
    chsiStickyTable - A jQuery plugin
    ==================================================================
    ©author  weij  - Version 1.0.0
    ==================================================================
    This program is build for chsi-sticky-table. it's compatibility is ie 7+.
    you shoud have to require the chsi-sticky-table.css and using correctly  html Dom.
*/

(function($){
    $.fn.extend({ 
        chsiStickyTable: function() {

            function StickyTable(ele){
                    this.ele = $(ele);
                    this.stickyTable = this.ele.find("div.sticky-table").eq(0);
                    this.HeaderTable =  this.stickyTable.find("div.chsi-table-header table").eq(0);
                    this.BodyTable = this.stickyTable.find("div.chsi-table-body table").eq(0);
                    this.stuffDiv = $("<div />");
                    this.fixedTableWrapper = $("<div class=\"chsi-table-fixed\"></div>");
                    this.fixedTableHeader = $("<div class=\"chsi-table-fixed-header\" \/>");
                    this.fixedTableBody =  $("<div class=\"chsi-table-fixed-body\" \/>");
                    // 计算浏览器的滚动条（因为各个浏览器不一致）
                    this.getScrollbarWidth=(function(){
                        var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>'); 
                            $('body').append(div); 
                            var w1 = $('div', div).innerWidth(); 
                            div.css('overflow-y', 'scroll'); 
                            var w2 = $('div', div).innerWidth(); 
                            $(div).remove(); 
                            return (w1 - w2); 
                    })();
                    this.createFixedColumns=function(){                      
                        // 创建固定列
                        this.fixedTableHeader.append(this.HeaderTable.clone(false));
                        this.fixedTableBody.append(this.BodyTable.clone(false));
                        this.fixedTableWrapper.append(this.fixedTableHeader).append(this.fixedTableBody);
                        this.stickyTable.append(this.fixedTableWrapper);
                    };
                    this.setHeigthWidth= function(){
                        // 设置相应的高度或者宽度
                        // 设置scrollDiv的高度
                        var _h = this.ele.outerHeight()-this.HeaderTable.outerHeight();
                        this.BodyTable.parent("div.chsi-table-body").height(_h);
                        // 设置固定列的宽度
                        var _w_fixed = 0;
                        this.HeaderTable.find("colgroup>col.fixed").each(function(){
                             _w_fixed += parseInt($(this).attr("width"));
                        });
                        this.fixedTableWrapper.width(_w_fixed);
                        // 设置固定列中tableBody的高度
                        this.fixedTableBody.height(_h+1-this.getScrollbarWidth);
                        // 根据横向滚动条填充一个空的div宽度，修复滚动条同步的问题
                        var _w_real = this.HeaderTable.width();
                        this.stuffDiv.width(_w_real+this.getScrollbarWidth).height(1);
                        this.HeaderTable.before(this.stuffDiv);
                    };
                    this.amountEvent = function(){
                        var _this = this;

                        this.BodyTable.parent("div.chsi-table-body").scroll(function(event){
                            _this.HeaderTable.parent("div.chsi-table-header").get(0).scrollLeft = event.target.scrollLeft;
                            _this.fixedTableBody.get(0).scrollTop = event.target.scrollTop;
                        });
                        this.ele.resize(function(event){
                            _this.setHeigthWidth();
                        });
                     
                    };
                    this.init= function(){
                        var _fixedColumnNum= this.HeaderTable.find("col.fixed").length;
                        if(!!!_fixedColumnNum){ return;}
                        // 创建固定列
                        this.createFixedColumns();
                        // 计算相关的width or height,并设置相应的cssName
                        this.setHeigthWidth();
                        // 给chsi-table-body 挂载事件 scroll and resize
                        this.amountEvent();
                    };
                    this.init();
                   return this;
                }
            return this.each(function() {
            new StickyTable(this);   
            }); // init
        } // chsiStickyTable end
    }); // extend
    
})(jQuery);