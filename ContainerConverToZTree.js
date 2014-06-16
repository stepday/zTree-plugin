/*!
 * Function Name: zTree plugin（zTree树插件）
 * Function Desc:该插件主要是用于可以直接将页面内的一些类似zTree结构的元素直接转换为zTree树控件进行操作。
 *               该插件会自动解析元素层次结构，将其转换为zTree的树节点集合。有一点需要特别注意的是页面元素容器ID必须指定。
 * Author：stepday
 * Author's WebSite:http://www.stepday.com
 * Create Date: 2014-06-16
 */
(function ($) {
    //设置一个全局树节点变量 用于解决js方法之间引用类型传递参数无效问题
    var zNodes = null;

    //获得页面所有容器class为ztree的集合
    function FindZTreeContainer() {
        return $(".ztree");
    }

    //递归构建zTree树节点层级关系
    function DepthFindNodes(htmlNode, id, pId) {
        for (var i = 0; i < htmlNode.children.length; i++) {
            if (htmlNode.children[i].localName == "ul") {
                var newPID = pId;
                if (htmlNode.children[i].nodeValue != null) {
                    var node = new Object();
                    node.id = id;
                    node.pId = pId;
                    node.name = htmlNode.children[i].nodeValue;
                    zNodes.push(node);
                    newPID = id;
                    id++;
                }
                if (htmlNode.children[i].children.length > 0) {
                    DepthFindNodes(htmlNode.children[i], id, newPID);
                }
            } else if (htmlNode.children[i].localName == "li") {
                var newPID = pId;
                if (htmlNode.children[i].outerText != null) {
                    var node = new Object();
                    node.id = id;
                    node.pId = pId;
                    var nodeName = htmlNode.children[i].outerText;
                    var indexOf = nodeName.indexOf('\n');
                    if (indexOf > 0) {
                        //截断获取节点名称
                        nodeName = nodeName.substring(0, indexOf);
                    }
                    node.name = nodeName;
                    zNodes.push(node);
                    newPID = id;
                    id++;
                }
                if (htmlNode.children[i].children.length > 0) {
                    DepthFindNodes(htmlNode.children[i], id, newPID);
                }
            }
        }
    }

    //获取节点结构
    function GetTreeNodes(htmlNode, id, pId) {
        if (htmlNode.children.length > 0) {
            zNodes = new Array();
            DepthFindNodes(htmlNode, id, pId);
        }
        else
            return null;
    }
    ///转换操作
    $.fn.ConvertToZTree = function () {
        //获取页面所有标记为ztree属性的元素
        var divList = FindZTreeContainer();
        for (var i = 0; i < divList.length; i++) {
            GetTreeNodes(divList[i], 1, 0);
            var contianerId = divList[i].id;
            if (contianerId.length == 0) {
                console.log("页面内第" + (i + 1).toString() + "棵树容器尚未设置id属性");
            } else {
                $.fn.zTree.init($("#" + divList[i].id), setting, zNodes);
            }
        }
    };
})(jQuery);
