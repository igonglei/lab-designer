/*!
 * labDesigner - lab designer based on mxgraph
 * Copyright 2017, Gonglei
 */
(function(root, factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["jquery"], factory);
    } else if (typeof module === "object" && typeof module.exports === "object") {
        // CommonJS
        module.exports = factory(require("jquery"));
    } else {
        // Browser globals
        root.labDesigner = factory(root.jQuery);
    }
}(this, function($) {
    // Document
    var document = typeof window !== "undefined" ? window.document : {};
    //默认参数
    var defaults = {
            //实验室
            lab: null,
            //宽度
            width: 1280,
            //高度
            height: 850,
            //根目录
            root: "static/plugins/labDesigner/",
            //图片目录
            imageDir: "images/",
            //本地数据目录
            dataDir: "data/",
            //实验室布局图
            layout: "lab-layout.png",
            //本地数据
            data: null,
            //数据url
            url: "lab.json",
            //备份文件
            bakFile: "lab.bak.json",
            //编辑模式
            editorMode: true,
            //tooltip事件
            tooltip: null,
            //右键事件
            contextMenu: null,
            //操作图标
            handleImage: "dot.png",
            //操作图标大小
            handleSize: 16,
            //旋转图标
            rotateImage: "rotate.png",
            //旋转图标大小
            rotateSize: 18,
            //选中覆盖图标
            checkOverlayImage: "success.png",
            //选中覆盖图标大小
            checkOverlaySize: 16,
            //利用率覆盖图标
            rateOverlayImage: [{
                src: "low.png",
                hsrc: "low-h.png",
                min: 0,
                max: 30
            }, {
                src: "middle.png",
                hsrc: "middle-h.png",
                min: 30,
                max: 60
            }, {
                src: "high.png",
                hsrc: "high-h.png",
                min: 60
            }],
            //利用率覆盖图标大小
            rateOverlaySize: 6,
            //箭头移动的步长
            moveStepSize: 2,
            //更改大小的步长
            resizeStepSize: 2,
            //默认语言
            lang: "cn",
            //编辑页面url
            editorUrl: "designer?lab={lab}",
            //保存请求
            saveAction: "designer/save",
            //获取实验室列表
            labListAction: "",
            //获取机柜列表
            cabListAction: "designer/GetCabinetNumInfo",
            //获取机柜信息和设备列表
            cabInfoAction: "",
            //机柜信息和设备列表假数据
            fakeCabInfo: {
                deviceList: [{
                    SmallType: "OptiXOSN1800V",
                    IP: "129.8.10.87",
                    CabinetPosition: "A1-1",
                    TotalRate: 20
                }, {
                    SmallType: "OptiXOSN1800U",
                    IP: "129.8.9.1",
                    CabinetPosition: "A1-2",
                    TotalRate: 70
                }],
                uNum: [{
                    no: "A1",
                    usedU: 11,
                    allU: 80
                }]
            },
            //获取机柜U位数
            cabUCountAction: "",
            //机柜U位数假数据
            fakeCabUCount: [{
                no: "A1",
                usedU: 11,
                allU: 80
            }, {
                no: "A2",
                usedU: 19,
                allU: 80
            }, {
                no: "A3",
                usedU: 22,
                allU: 80
            }, {
                no: "A4",
                usedU: 28,
                allU: 80
            }, {
                no: "A5",
                usedU: 0,
                allU: 80
            }, {
                no: "A6",
                usedU: 0,
                allU: 80
            }, {
                no: "A7",
                usedU: 36,
                allU: 80
            }, {
                no: "A8",
                usedU: 36,
                allU: 80
            }, {
                no: "A9",
                usedU: 34,
                allU: 80
            }, {
                no: "A10",
                usedU: 69,
                allU: 80
            }, {
                no: "A11",
                usedU: 69,
                allU: 80
            }, {
                no: "A12",
                usedU: 45,
                allU: 80
            }, {
                no: "A13",
                usedU: 69,
                allU: 80
            }, {
                no: "A14",
                usedU: 51,
                allU: 80
            }],
            //更新已用机柜数
            updateLabAction: "designer/UpdateUsedCabinet",
            //更新特殊机柜已用U位
            updateSpeCabAction: "designer/UpdateSpecialCabinetInfo",
            //导出为图片
            exportAction: "",
            //默认pdu
            pdu: "WuhanRC"
        }, //成功状态码
        SUCCESS_CODE = "0x0000", //显示文字
        texts = {
            browserNotSupported: {
                cn: "浏览器不支持！",
                en: "Browser is not supported!"
            },
            cab: {
                cn: "机柜",
                en: "Cabinet"
            },
            powerCab: {
                cn: "配电柜",
                en: "DB"
            },
            toggleCab: {
                cn: "开关柜",
                en: "SC"
            },
            netCab: {
                cn: "网络柜",
                en: "NC"
            },
            lineCab: {
                cn: "配线柜",
                en: "WC"
            },
            devCab: {
                cn: "仪表柜",
                en: "DEV"
            },
            iondCab: {
                cn: "IOND柜",
                en: "IOND"
            },
            serverCab: {
                cn: "服务器柜",
                en: "Server"
            },
            airCon: {
                cn: "空调",
                en: "AC"
            },
            wall: {
                cn: "承重墙",
                en: "Wall"
            },
            zoomIn: {
                cn: "放大",
                en: "ZoomIn"
            },
            zoomOut: {
                cn: "缩小",
                en: "ZoomOut"
            },
            actualSize: {
                cn: "实际大小",
                en: "Actual size"
            },
            fullsize: {
                cn: "全屏",
                en: "Fullsize"
            },
            move: {
                cn: "移动",
                en: "Move"
            },
            download: {
                cn: "下载",
                en: "Download"
            },
            capacity: {
                cn: "容量",
                en: "Capacity"
            },
            del: {
                cn: "删除",
                en: "Delete"
            },
            undo: {
                cn: "撤销",
                en: "Undo"
            },
            redo: {
                cn: "重做",
                en: "Redo"
            },
            save: {
                cn: "保存",
                en: "Save"
            },
            show: {
                cn: "显示",
                en: "Show"
            },
            hide: {
                cn: "隐藏",
                en: "Hide"
            },
            clear: {
                cn: "清空",
                en: "Clear"
            },
            copy: {
                cn: "复制",
                en: "Copy"
            },
            paste: {
                cn: "粘贴",
                en: "Paste"
            },
            edit: {
                cn: "编辑",
                en: "Edit"
            },
            selectAll: {
                cn: "全选",
                en: "Select All"
            },
            saveSuccess: {
                cn: "保存成功",
                en: "Save successful"
            },
            restore: {
                cn: "还原到上一个版本",
                en: "Revert to the previous version"
            },
            noChange: {
                cn: "没有改动",
                en: "No change"
            },
            labList: {
                cn: "实验室列表",
                en: "Lab list"
            },
            cabList: {
                cn: "机柜列表",
                en: "Cabinet list"
            },
            unsavedChanges: {
                cn: "存在未保存的改动，确定切换实验室？",
                en: "There are unsaved changes, be sure to change lab?"
            },
            ok: {
                cn: "确定",
                en: "OK"
            },
            cancel: {
                cn: "取消",
                en: "Cancel"
            },
            associated: {
                cn: "此机柜已关联",
                en: "The cabinet has been associated"
            },
            loading: {
                cn: "载入中...",
                en: "Loading..."
            },
            loadSuccess: {
                cn: "载入成功",
                en: "Load successfully"
            },
            print: {
                cn: "打印",
                en: "Print"
            }
        }, //vertex样式
        styles = [{
            name: "cab-down",
            image: "cab-down.png",
            type: "cab",
            width: 24,
            lengend: true
        }, {
            name: "cab-down-low",
            image: "cab-down-low.png",
            type: "cab",
            width: 24
        }, {
            name: "cab-down-middle",
            image: "cab-down-middle.png",
            type: "cab",
            width: 24
        }, {
            name: "cab-down-high",
            image: "cab-down-high.png",
            type: "cab",
            width: 24
        }, {
            name: "cab-dev",
            image: "cab-dev.png",
            type: "devCab",
            width: 24,
            lengend: true
        }, {
            name: "cab-iond",
            image: "cab-iond.png",
            type: "iondCab",
            width: 24,
            lengend: true
        }, {
            name: "cab-server",
            image: "cab-server.png",
            type: "serverCab",
            width: 24,
            lengend: true
        }, {
            name: "power-down",
            image: "power-down.png",
            type: "powerCab",
            width: 24,
            lengend: true
        }, {
            name: "toggle-down",
            image: "toggle-down.png",
            type: "toggleCab",
            width: 24,
            lengend: true
        }, {
            name: "net-down",
            image: "net-down.png",
            type: "netCab",
            width: 24,
            lengend: true
        }, {
            name: "line-down",
            image: "line-down.png",
            type: "lineCab",
            width: 24,
            lengend: true
        }, {
            name: "air-left",
            image: "air-left.png",
            type: "airCon",
            width: 32,
            lengend: true
        }, {
            name: "air-mini",
            image: "air-mini.png",
            type: "airCon",
            width: 32
        }, {
            name: "wall",
            image: "wall.png",
            type: "wall",
            width: 44
        }], //样式
        classList = {
            container: "labDesigner",
            toolbar: "lde-toolbar",
            designer: "lde-designer",
            lengend: "lde-lengend",
            tooltip: "lde-tooltip",
            tools: "lde-tools",
            tip: "lde-tip",
            eToolbar: "lde-editor-toolbar",
            eToolbox: "lde-editor-toolbox",
            ePropbox: "lde-editor-propbox",
            separator: "separator",
            selectedCls: "selected",
            eBox: "lde-editor-box",
            eToolboxTitle: "lde-editor-toolbox-title",
            eToolboxItem: "lde-editor-toolbox-item",
            messagebar: "lde-editor-messagebar",
            ePropbox4Lab: "lde-editor-propbox-lab",
            ePropboxLabList: "lde-editor-propbox-lab-list",
            ePropbox4Cab: "lde-editor-propbox-cab",
            ePropboxCabList: "lde-editor-propbox-cab-list",
            ePropboxCabTitle: "lde-editor-propbox-cab-title",
            ePropboxCabItem: "lde-editor-propbox-cab-item",
            modal: "lde-designer-modal",
            modalMask: "lde-designer-modal-mask",
            modalBody: "lde-designer-modal-body",
            printer: "lde-printer"
        }, //模板
        templates = {
            tooltip: '<div class="{cls}" data-name="{target}"><div class="title"><span>{name}</span><a href="javascript:void(0)">查看详情</a></div>' + '<div class="rate"><span>U位利用率：{rate}%</span><span class="u">U位：<div class="bar"><div class="success" style="width:{rate}%"></div></div>{use_u}/{total_u}</span></div>' + '<table class="devices"><thead><tr><th>设备({device_count})</th><th>IP</th><th>设备利用率</th><th>位置</th></tr></thead><tbody>{device_html}</tbody></table></div>',
            tooltip_device: '<tr><td><a class="name" href="javascript:void(0)">{SmallType}</a></td><td>{IP}</td><td>{Rate}</td><td>{CabinetPosition}</td></tr>',
            lengend: '<li><div class="icon {type}"></div><div>{text}</div></li>',
            tools: '<li class="{type}" title="{text}"></li>',
            tip: '<li><span class="icon {cls}"></span><span>{text}</span></li>',
            etools: '<li class="icon {type}" title="{text}"></li>',
            separator: '<li class="{type}"></li>',
            toggle_icon: '<div class="toggle-icon {cls}" title="{text}"></div>',
            toolbox_group: '<li class="{selectedCls}" data-name="{text}"><div class="{cls}"><span class="text">{text}</span><span class="icon"></span></div></li>',
            toolbox_item: '<li><img src="{src}" alt="{name}" data-type="{name}" style="width:{width}px;" /></li>',
            menu_shortcut: '<span class="shortcut">{key}</span>',
            messagebar: '<span class="icon {level}"></span><span class="text">{text}</span>',
            propbox_title: '<div class="lde-editor-propbox-title">{title}</div>',
            propbox_list_item: '<li data-val="{_id}" data-name="{name}" class="{cls}" title="{name}"><div class="icon"></div><div class="title">{name}</div><div class="checked-icon"></div></li>'
        }, //绑定数据
        data = {
            //展示模式的工具栏
            tools: [{
                type: "zoomIn",
                onclick: function() {
                    this.zoomIn();
                }
            }, {
                type: "zoomOut",
                onclick: function() {
                    this.zoomOut();
                }
            }, {
                type: "actualSize",
                onclick: function() {
                    this.actualSize();
                }
            }, {
                type: "download",
                onclick: function() {
                    this.exportImage();
                }
            }, {
                type: "print",
                onclick: function() {
                    this.print();
                }
            }],
            //展示模式的提示栏
            tip: [{
                cls: "low",
                text: "0-30"
            }, {
                cls: "middle",
                text: "30-60"
            }, {
                cls: "high",
                text: "60-100"
            }],
            //编辑模式的工具栏
            etools: [{
                type: "zoomIn",
                onclick: function() {
                    this.zoomIn();
                }
            }, {
                type: "zoomOut",
                onclick: function() {
                    this.zoomOut();
                }
            }, {
                type: "actualSize",
                onclick: function() {
                    this.actualSize();
                }
            }, {
                type: "separator"
            }, {
                type: "undo",
                onclick: function() {
                    this.undo();
                },
                key: "Ctrl+Z"
            }, {
                type: "redo",
                onclick: function() {
                    this.redo();
                },
                key: "Ctrl+Y"
            }, {
                type: "separator"
            }, {
                type: "selectAll",
                onclick: function() {
                    this.selectAll();
                },
                key: "Ctrl+A"
            }, {
                type: "del",
                onclick: function() {
                    this.remove();
                },
                key: "Delete"
            }, {
                type: "clear",
                onclick: function() {
                    this.clear();
                },
                key: "Ctrl+Delete"
            }, {
                type: "separator"
            }, {
                type: "restore",
                onclick: function() {
                    this.restore();
                }
            }, {
                type: "save",
                onclick: function() {
                    this.save();
                },
                key: "Ctrl+S"
            }],
            //编辑模式的选中右键菜单
            emenus4cell: [{
                type: "copy",
                onclick: function() {
                    this.copy();
                },
                key: "Ctrl+C"
            }, {
                type: "del",
                onclick: function() {
                    this.remove();
                },
                key: "Delete"
            }],
            //编辑模式的右键菜单
            emenus: [{
                type: "paste",
                onclick: function() {
                    this.pasteHere();
                },
                key: "Ctrl+V"
            }, {
                type: "selectAll",
                onclick: function() {
                    this.selectAll();
                },
                key: "Ctrl+A"
            }],
            //编辑模式的键盘快捷键
            shortcuts: [{
                keyCode: 46,
                key: "Delete",
                action: function() {
                    this.remove();
                }
            }, {
                keyCode: 46,
                key: "Ctrl+Delete",
                isCtrl: true,
                action: function() {
                    this.clear();
                }
            }, {
                keyCode: 65,
                key: "Ctrl+A",
                isCtrl: true,
                action: function() {
                    this.selectAll();
                }
            }, {
                keyCode: 90,
                key: "Ctrl+Z",
                isCtrl: true,
                action: function() {
                    this.undo();
                }
            }, {
                keyCode: 89,
                key: "Ctrl+Y",
                isCtrl: true,
                action: function() {
                    this.redo();
                }
            }, {
                keyCode: 67,
                key: "Ctrl+C",
                isCtrl: true,
                action: function() {
                    this.copy();
                }
            }, {
                keyCode: 86,
                key: "Ctrl+V",
                isCtrl: true,
                action: function() {
                    this.paste();
                }
            }, {
                keyCode: 83,
                key: "Ctrl+S",
                isCtrl: true,
                action: function() {
                    this.save();
                }
            }]
        }, //辅助方法
        utils = {
            //格式化模板
            tpl: function(tpl, data) {
                if (!tpl || !data) {
                    return tpl;
                }
                var reg = /{(.*?)}/g,
                    match = tpl.match(reg);
                $.each(match, function(i, v) {
                    var key = v.replace(reg, "$1"),
                        value = data[key];
                    if (value !== undefined) {
                        tpl = tpl.replace(v, value);
                    }
                });
                return tpl;
            },
            jsonMap: function(arr) {
                return $.map(arr, function(n) {
                    return JSON.parse(n);
                });
            }
        }, //常量以及方法
        plugin = {
            //插件名称
            name: "labDesigner",
            //初始化
            init: function(instance) {
                if (!mxClient.isBrowserSupported()) {
                    mxUtils.error(this.getText(instance, "browserNotSupported"), 250, false);
                    return;
                }
                this.overridePrototype();
                this.newGraph(instance);
                this.setBackground(instance);
                this.setContextMenu(instance);
                this.setTooltip(instance);
                this.setHighlight(instance);
                this.putStyle(instance);
                this.loadData(instance);
            },
            //创建一个mxgraph实例
            newGraph: function(instance) {
                var editor = instance.editor = new mxEditor(),
                    graph = instance.graph = editor.graph,
                    $el = $(instance.dom).empty(),
                    $designer = $('<div class="' + classList.designer + '"></div>').appendTo($el);
                graph.init($designer[0]);
                $el.addClass(classList.container);
                graph.labelsVisible = false;
                graph.cellsEditable = false;
                graph.cellsLocked = true;
                this.initFilePath(instance);
                this.initEditor(instance);
            },
            //初始化编辑器
            initEditor: function(instance) {
                var graph = instance.graph;
                if (instance.options.editorMode) {
                    graph.cellsLocked = false;
                    graph.graphHandler.guidesEnabled = true;
                    new mxRubberband(graph);
                    this.setShortcuts(instance);
                    this.setEditorToolbar(instance);
                    this.setEditorToolbox(instance);
                    this.setEditorPropbox(instance);
                    this.setMessagebar(instance);
                    this.bindEvent(instance);
                    this.setHandleImage(instance);
                    this.rotateCells(instance);
                } else {
                    this.setToolbar(instance);
                    this.setLengend(instance);
                }
            },
            //设置背景
            setBackground: function(instance, reset) {
                var opts = instance.options,
                    graph = instance.graph,
                    src = instance.path.background,
                    width = opts.width,
                    height = opts.height;
                graph.backgroundImage = new mxImage(src, width, height);
                graph.view.validate();
                if (reset) {
                    return;
                }
                $(graph.container).css({
                    width: width,
                    height: height
                });
                var rec = new mxRectangle(0, 0, width, height);
                graph.maximumGraphBounds = rec;
                graph.minimumContainerSize = rec;
            },
            //绑定事件
            bindEvent: function(instance) {
                var graph = instance.graph;
                graph.getModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function(sender, evt) {
                    instance.changed = true;
                }));
                graph.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt) {
                    var cell = evt.getProperty("cell");
                    if (this.isCabCell(cell)) {
                        this.initCabPropbox(instance, cell);
                    } else {
                        this.initLabPropbox(instance);
                    }
                }));
            },
            //是否机柜
            isCabCell: function(cell, hasValue) {
                var isCab = cell && /^cab/i.test(cell.style);
                if (hasValue === true) {
                    isCab = isCab && cell.value;
                }
                return isCab;
            },
            //获取文件路径
            initFilePath: function(instance) {
                var opts = instance.options,
                    dataDir = utils.tpl("{root}{dataDir}{lab}/", opts);
                instance.path = {
                    background: dataDir + opts.layout,
                    file: dataDir + opts.url,
                    bakFile: dataDir + opts.bakFile,
                    imgPath: opts.root + opts.imageDir
                };
            },
            //重新加载编辑器
            reloadEditor: function(instance) {
                this.initFilePath(instance);
                this.setBackground(instance, true);
                instance.clear();
                this.loadData(instance);
            },
            //加载数据
            loadData: function(instance, isbak) {
                var self = this,
                    opts = instance.options,
                    url = opts.url,
                    onLoad = function(data) {
                        if (!data || !data.vertex) {
                            instance.changed = false;
                            return;
                        }
                        instance.data = data;
                        self.fillGraph(instance);
                        if (!isbak) {
                            instance.changed = false;
                        }
                        self.successMsg(instance, self.getText(instance, "loadSuccess"));
                    };
                if (url) {
                    url = instance.path[isbak ? "bakFile" : "file"];
                    self.infoMsg(instance, self.getText(instance, "loading"));
                    $.getJSON(url + "?ts=" + new Date().valueOf(), function(data) {
                        onLoad(data);
                    }).fail(function(err) {
                        instance.changed = false;
                        self.errorMsg(instance, err.statusText);
                    });
                    return;
                }
                onLoad(opts.data);
            },
            //增加样式
            putStyle: function(instance) {
                var opts = instance.options;
                $.each(styles, function(i, value) {
                    instance.graph.getStylesheet().putCellStyle(value.name, {
                        shape: "image",
                        image: instance.path.imgPath + value.image
                    });
                });
            },
            //填充数据
            fillGraph: function(instance, cells, selected) {
                var graph = instance.graph,
                    model = graph.getModel(),
                    parent = graph.getDefaultParent(),
                    vertex = cells || instance.data.vertex,
                    self = this;
                model.beginUpdate();
                try {
                    $.each(vertex, function(i, v) {
                        var cell = graph.insertVertex(parent, null, v.value, v.x, v.y, v.width, v.height, v.style);
                        if (selected) {
                            graph.setSelectionCell(cell);
                        }
                        if (instance.options.editorMode && v.value && v.value.name) {
                            self.setCheckCellOverlay(instance, cell);
                        }
                    });
                } finally {
                    model.endUpdate();
                    if (!instance.options.editorMode) {
                        self.getLabList(instance).done(function() {
                            self.getCabUCount(instance).done(function() {
                                self.setRateCellOverlay(instance);
                            });
                        });
                    }
                }
            },
            //保存
            save: function(instance) {
                if (!instance.changed) {
                    this.infoMsg(instance, this.getText(instance, "noChange"), true);
                    return;
                }
                var vertexs = instance.graph.getChildVertices();
                var labData = $.map(vertexs, function(n, m) {
                        var geo = n.geometry;
                        return {
                            width: geo.width,
                            height: geo.height,
                            x: geo.x,
                            y: geo.y,
                            style: n.style,
                            value: n.value
                        };
                    }),
                    usedCab = this.getUsedCells(instance, vertexs).length,
                    speCabArr = this.getSpecialCab(instance, vertexs);
                var self = this;
                $.post(instance.options.saveAction, {
                    file: instance.path.file,
                    bakFile: instance.path.bakFile,
                    data: JSON.stringify({
                        vertex: labData
                    })
                }, function(data) {
                    if (data.ErrCode === SUCCESS_CODE) {
                        self.successMsg(instance, self.getText(instance, "saveSuccess"));
                        instance.changed = false;
                        self.updateLabAction(instance, usedCab);
                        if (speCabArr.length > 0) {
                            self.updateSpecialCab(instance, speCabArr);
                        }
                    } else {
                        self.errorMsg(instance, data.ErrCode);
                    }
                }).fail(function(err) {
                    self.errorMsg(instance, err.statusText);
                });
            },
            //获取已经设置了机柜的元素
            getUsedCells: function(instance, vertexs) {
                return $.grep(vertexs || instance.graph.getChildVertices(), function(n) {
                    return n.value && n.value.name;
                });
            },
            //获取特殊机柜(仪表、IOND、服务器柜)的列表
            getSpecialCab: function(instance, vertexs) {
                return $.map(vertexs || instance.graph.getChildVertices(), function(n) {
                    return (n.style == "cab-dev" || n.style == "cab-iond" || n.style == "cab-server") && n.value && n.value.name ? n.value.name : null;
                });
            },
            //还原
            restore: function(instance) {
                instance.clear();
                this.loadData(instance, true);
            },
            //设置编辑器工具栏
            setEditorToolbar: function(instance) {
                var $el = $('<ul class="' + classList.eToolbar + '"></ul>').prependTo($(instance.dom)),
                    self = this;
                $.each(data.etools, function(i, v) {
                    var type = v.type,
                        tpl = type === classList.separator ? templates.separator : templates.etools,
                        key = v.key || "",
                        keyText = key && " (" + key + ")";
                    var $li = $(utils.tpl(tpl, {
                            type: type,
                            text: self.getText(instance, type) + keyText
                        })),
                        click = v.onclick;
                    $el.append($li);
                    if (typeof click === "function") {
                        $li.click(function() {
                            click.call(instance);
                        });
                    }
                });
            },
            //设置编辑器侧边工具箱
            setEditorToolbox: function(instance) {
                var $el = $('<div class="' + classList.eToolbox + '"></div>').appendTo($(instance.dom)),
                    $box = $('<ul class="' + classList.eBox + '"></ul>').appendTo($el),
                    self = this,
                    opts = instance.options;
                this.setToggleIcon(instance, $box, "left-hide", "right-show");
                var toolbox = {};
                $.each(styles, function(i, v) {
                    var type = v.type,
                        tools = toolbox[type] || [];
                    tools.push(v);
                    toolbox[type] = tools;
                });
                var selectedType = styles[0].type;
                $.each(toolbox, function(i, v) {
                    var $li = $(utils.tpl(templates.toolbox_group, {
                        text: self.getText(instance, i),
                        cls: classList.eToolboxTitle,
                        selectedCls: i === selectedType ? classList.selectedCls : ""
                    })).appendTo($box);
                    var $ul = $('<ul class="' + classList.eToolboxItem + '"></ul>').appendTo($li);
                    $.each(v, function(n, m) {
                        m.src = instance.path.imgPath + m.image;
                        var $item = $(utils.tpl(templates.toolbox_item, m)).appendTo($ul);
                        self.makeDraggable($item.find("img")[0], instance);
                    });
                });
                $box.on("click", "." + classList.eToolboxTitle, function() {
                    $(this).parent().toggleClass(classList.selectedCls);
                });
            },
            //设置隐藏显示按钮
            setToggleIcon: function(instance, $box, hideCls, showCls) {
                var self = this,
                    $toggle = $(utils.tpl(templates.toggle_icon, {
                        cls: hideCls,
                        text: self.getText(instance, "hide")
                    })).insertAfter($box);
                $toggle.click(function() {
                    $box.toggle();
                    $(this).toggleClass(showCls).attr("title", self.getText(instance, $box.is(":visible") ? "hide" : "show"));
                });
            },
            //工具栏拖拽
            makeDraggable: function(img, instance) {
                if (mxClient.IS_IE) {
                    mxEvent.addListener(img, "dragstart", function(evt) {
                        evt.returnValue = false;
                    });
                }
                var graph = instance.graph,
                    dragImage = img.cloneNode(true),
                    self = this;
                var ds = mxUtils.makeDraggable(img, graph, function(graph, evt, cell, x, y) {
                    self.fillGraph(instance, [{
                        x: x,
                        y: y,
                        width: img.width,
                        height: img.height,
                        style: img.getAttribute("data-type")
                    }], true);
                }, dragImage, null, null, graph.autoscroll, true);
                ds.isGuidesEnabled = function() {
                    return graph.graphHandler.guidesEnabled;
                };
            },
            //设置右键
            setContextMenu: function(instance) {
                var opts = instance.options,
                    contextMenu = opts.contextMenu,
                    self = this,
                    graph = instance.graph;
                mxEvent.disableContextMenu(graph.container);
                graph.popupMenuHandler.factoryMethod = typeof contextMenu === "function" ? function(menu, cell, evt) {
                    return contextMenu.apply(instance, arguments);
                } : function(menu, cell, evt) {
                    if (opts.editorMode) {
                        var cells = graph.getSelectionCells(),
                            menus = cells.length === 0 ? data.emenus : data.emenus4cell;
                        $.each(menus, function(i, v) {
                            var type = v.type,
                                onclick = v.onclick;
                            var item = menu.addItem(self.getText(instance, type), null, function() {
                                if (onclick) {
                                    onclick.call(instance);
                                }
                            }, null, "icon " + type);
                            if (v.key) {
                                $(item).find(":last").append(utils.tpl(templates.menu_shortcut, v));
                            }
                        });
                    }
                };
            },
            //粘贴到鼠标处
            pasteHere: function(instance) {
                var graph = instance.graph;
                graph.getModel().beginUpdate();
                try {
                    var cells = instance.paste();
                    var bb = cells && graph.getBoundingBoxFromGeometry(cells);
                    if (bb === null) {
                        return;
                    }
                    var t = graph.view.translate,
                        s = graph.view.scale,
                        dx = t.x,
                        dy = t.y,
                        x = Math.round(graph.snap(graph.popupMenuHandler.triggerX / s - dx)),
                        y = Math.round(graph.snap(graph.popupMenuHandler.triggerY / s - dy));
                    graph.cellsMoved(cells, x - bb.x, y - bb.y);
                } finally {
                    graph.getModel().endUpdate();
                }
            },
            //绑定快捷键
            setShortcuts: function(instance) {
                var graph = instance.graph,
                    keyHandler = new mxKeyHandler(graph);
                $.each(data.shortcuts, function(i, v) {
                    keyHandler[v.isCtrl ? "bindControlKey" : "bindKey"](v.keyCode, function(evt) {
                        v.action.call(instance);
                    });
                });
                instance.keyHandler = keyHandler;
                this.setArrowEvent(instance);
            },
            //设置方向箭头事件
            setArrowEvent: function(instance) {
                var graph = instance.graph,
                    keyHandler = instance.keyHandler,
                    opts = instance.options,
                    moveStepSize = opts.moveStepSize,
                    resizeStepSize = opts.resizeStepSize,
                    ARROW = {
                        LEFT: 37,
                        UP: 38,
                        RIGHT: 39,
                        DOWN: 40
                    },
                    queue = [],
                    thread = null,
                    nudge = function(keyCode, stepSize, resize) {
                        queue.push(function() {
                            if (resize) {
                                graph.getModel().beginUpdate();
                                try {
                                    var cells = graph.getSelectionCells();
                                    for (var i = 0; i < cells.length; i++) {
                                        if (graph.getModel().isVertex(cells[i]) && graph.isCellResizable(cells[i])) {
                                            var geo = graph.getCellGeometry(cells[i]);
                                            if (geo != null) {
                                                geo = geo.clone();
                                                if (keyCode == ARROW.LEFT) {
                                                    geo.width = Math.max(0, geo.width - stepSize);
                                                } else if (keyCode == ARROW.UP) {
                                                    geo.height = Math.max(0, geo.height - stepSize);
                                                } else if (keyCode == ARROW.RIGHT) {
                                                    geo.width += stepSize;
                                                } else if (keyCode == ARROW.DOWN) {
                                                    geo.height += stepSize;
                                                }
                                                graph.getModel().setGeometry(cells[i], geo);
                                            }
                                        }
                                    }
                                } finally {
                                    graph.getModel().endUpdate();
                                }
                            } else {
                                var dx = 0,
                                    dy = 0;
                                if (keyCode == ARROW.LEFT) {
                                    dx = -stepSize;
                                } else if (keyCode == ARROW.UP) {
                                    dy = -stepSize;
                                } else if (keyCode == ARROW.RIGHT) {
                                    dx = stepSize;
                                } else if (keyCode == ARROW.DOWN) {
                                    dy = stepSize;
                                }
                                graph.moveCells(graph.getMovableCells(graph.getSelectionCells()), dx, dy);
                            }
                        });
                        if (thread != null) {
                            window.clearTimeout(thread);
                        }
                        thread = window.setTimeout(function() {
                            if (queue.length > 0) {
                                graph.getModel().beginUpdate();
                                try {
                                    for (var i = 0; i < queue.length; i++) {
                                        queue[i]();
                                    }
                                    queue = [];
                                } finally {
                                    graph.getModel().endUpdate();
                                }
                                graph.scrollCellToVisible(graph.getSelectionCell());
                            }
                        }, 200);
                    };
                $.each(ARROW, function(i, v) {
                    keyHandler.bindKey(v, function(evt) {
                        nudge(evt.keyCode, moveStepSize);
                    });
                    keyHandler.bindControlKey(v, function(evt) {
                        nudge(evt.keyCode, resizeStepSize, true);
                    });
                });
            },
            //设置tooltip
            setTooltip: function(instance) {
                var graph = instance.graph,
                    opts = instance.options,
                    tooltip = opts.tooltip,
                    self = this;
                graph.getTooltipForCell = typeof tooltip === "function" ? function(cell) {
                    return tooltip.apply(instance, arguments);
                } : function(cell) {
                    if (!self.isCabCell(cell, true)) {
                        return;
                    }
                    var value = cell.value,
                        target = instance.dom.id + "-" + value.name,
                        cabData = {
                            cls: classList.tooltip,
                            name: value.name,
                            device_count: 0,
                            total_u: 0,
                            use_u: 0,
                            rate: 0,
                            device_html: "",
                            target: target
                        };
                    self.getCabInfo(instance, value.name, cell.style).done(function(data) {
                        var cabInfo = instance.cabInfo,
                            devices = cabInfo.deviceList,
                            cabInfo = cabInfo.uNum[0] || {
                                allU: 0,
                                usedU: 0
                            },
                            device_html = "";
                        $.each(devices, function(i, v) {
                            //设备列表保持30天记录，如果不是当天回写的设备 则利用率为-
                            v.Rate = v.TotalRate === "-1" ? "-" : (v.TotalRate || 0) + "%";
                            device_html += utils.tpl(templates.tooltip_device, v);
                        });
                        $.extend(cabData, {
                            device_count: devices.length,
                            total_u: cabInfo.allU,
                            use_u: cabInfo.usedU,
                            rate: cabInfo.allU > 0 ? parseFloat((cabInfo.usedU / cabInfo.allU * 100).toFixed(1)) : 0,
                            device_html: device_html
                        });
                        var html = utils.tpl(templates.tooltip, cabData);
                        $("." + classList.tooltip).filter('[data-name="' + target + '"]').parent().html(html);
                        self.fitTooltip(graph);
                    });
                    return utils.tpl(templates.tooltip, cabData);
                };
            },
            //设置操作图标
            setHandleImage: function(instance) {
                var opts = instance.options;
                mxVertexHandler.prototype.handleImage = new mxImage(instance.path.imgPath + opts.handleImage, opts.handleSize, opts.handleSize);
            },
            //自适应tooltip位置
            fitTooltip: function(graph) {
                var div = graph.tooltipHandler && graph.tooltipHandler.div;
                if (div) {
                    mxUtils.fit(div);
                }
            },
            //设置高亮效果
            setHighlight: function(instance) {
                var tracker = new mxCellTracker(instance.graph);
                tracker.highlight.strokeWidth = 1;
            },
            //设置图例
            setLengend: function(instance) {
                var $ul = $('<ul class="' + classList.lengend + '"></ul>').appendTo($(instance.dom)),
                    self = this;
                $.each(styles, function(i, v) {
                    if (v.lengend) {
                        $ul.append(utils.tpl(templates.lengend, {
                            type: v.type,
                            text: self.getText(instance, v.type)
                        }));
                    }
                });
            },
            //设置工具栏
            setToolbar: function(instance) {
                var $div = $('<div class="' + classList.toolbar + '"></div>').prependTo($(instance.dom)),
                    $tools = $('<ul class="' + classList.tools + '"></ul>').appendTo($div),
                    $tip = $(utils.tpl('<ul class="{cls}"><li>{text}(%)</li></ul>', {
                        cls: classList.tip,
                        text: this.getText(instance, "capacity")
                    })).appendTo($div),
                    self = this;
                $.each(data.tools, function(i, v) {
                    var $li = $(utils.tpl(templates.tools, {
                            type: v.type,
                            text: self.getText(instance, v.type)
                        })),
                        click = v.onclick;
                    $tools.append($li);
                    if (typeof click === "function") {
                        $li.click(function() {
                            click.call(instance);
                        });
                    }
                });
                $.each(data.tip, function(i, v) {
                    $tip.append(utils.tpl(templates.tip, v));
                });
            },
            //设置编辑器属性栏
            setEditorPropbox: function(instance) {
                var $el = $('<div class="' + classList.ePropbox + '"></div>').appendTo($(instance.dom)),
                    $div = $('<div class="' + classList.eBox + '"></div>').appendTo($el);
                this.setToggleIcon(instance, $div, "right-hide", "left-show");
                $div.append('<div class="' + classList.ePropbox4Lab + '"></div><div class="' + classList.ePropbox4Cab + '"></div>');
                this.initLabPropbox(instance);
            },
            //初始化实验室列表属性栏
            initLabPropbox: function(instance) {
                var $el = $(instance.dom),
                    $div = $el.find("." + classList.ePropbox4Lab);
                if ($div.hasClass("loaded")) {
                    $div.show().next().hide();
                    return;
                }
                $(utils.tpl(templates.propbox_title, {
                    title: this.getText(instance, "labList")
                })).appendTo($div);
                var $propBody = $('<div class="lde-editor-propbox-body"></div>').appendTo($div),
                    $list = $('<ul class="' + classList.ePropboxLabList + '"></ul>').appendTo($propBody),
                    opts = instance.options,
                    selectedCls = "selected",
                    self = this,
                    reload = function($li) {
                        $li.addClass(selectedCls).siblings().removeClass(selectedCls);
                        opts.lab = $li.attr("data-val");
                        self.reloadEditor(instance);
                        self.resetCabPropbox(instance);
                    };
                this.getLabList(instance).done(function() {
                    $div.addClass("loaded");
                    $.each(instance.labList, function(i, v) {
                        $list.append(utils.tpl(templates.propbox_list_item, {
                            _id: v._id,
                            name: v.Name,
                            cls: v._id === opts.lab ? selectedCls : ""
                        }));
                    });
                    $list.on("click", "li", function() {
                        var $li = $(this);
                        if ($li.hasClass(selectedCls)) {
                            return;
                        }
                        if (instance.changed) {
                            self.confirm(instance, self.getText(instance, "unsavedChanges"), function() {
                                reload($li);
                            });
                            return;
                        }
                        reload($li);
                    });
                });
            },
            //初始化机柜列表属性栏
            initCabPropbox: function(instance, cell) {
                var $el = $(instance.dom),
                    $div = $el.find("." + classList.ePropbox4Cab),
                    show = function() {
                        $div.show().prev().hide();
                    },
                    selectedCls = classList.selectedCls,
                    name = cell.value && cell.value.name,
                    groupName = this.getGroupName(name);
                var cabType = this.getCabType(cell.style);
                if ($div.hasClass("loaded")) {
                    show();
                    this.loadCabList(instance, cell, cabType, groupName, selectedCls);
                    $div.find("." + classList.ePropboxCabList + ">li").removeClass(selectedCls).filter('[data-name="' + groupName + '"]').find("." + classList.ePropboxCabTitle).trigger("click");
                    $div.find("." + classList.ePropboxCabItem + ">li").removeClass(selectedCls).filter('[data-name="' + name + '"]').addClass(selectedCls);
                    return;
                }
                $div.empty();
                show();
                $(utils.tpl(templates.propbox_title, {
                    title: this.getText(instance, "cabList")
                })).appendTo($div);
                var $propBody = $('<div class="lde-editor-propbox-body"></div>').appendTo($div),
                    $list = $('<ul class="' + classList.ePropboxCabList + '"></ul>').appendTo($propBody),
                    opts = instance.options,
                    self = this;
                this.getCabList(instance).done(function() {
                    $div.addClass("loaded");
                    self.loadCabList(instance, cell, cabType, groupName, selectedCls);
                });
            },
            //根据机柜类型整理好的机柜列表
            loadCabList: function(instance, cell, cabType, groupName, selectedCls) {
                var self = this;
                $("." + classList.ePropbox4Cab + " .lde-editor-propbox-body").empty();
                var $el = $(instance.dom),
                    $div = $el.find("." + classList.ePropbox4Cab),
                    $propBody = $('<div class="lde-editor-propbox-body"></div>').appendTo($div),
                    name = cell.value && cell.value.name,
                    $list = $('<ul class="' + classList.ePropboxCabList + '"></ul>').appendTo($propBody);
                self.groupCabs(instance, cabType);
                if (!$.isEmptyObject(instance.groupCabs)) {
                    $.each(instance.groupCabs, function(i, v) {
                        var $li = $(utils.tpl(templates.toolbox_group, {
                            text: i,
                            cls: classList.ePropboxCabTitle,
                            selectedCls: groupName === i ? selectedCls : ""
                        })).appendTo($list);
                        var $ul = $('<ul class="' + classList.ePropboxCabItem + '"></ul>').appendTo($li);
                        $.each(v, function(n, m) {
                            $ul.append(utils.tpl(templates.propbox_list_item, {
                                _id: m._id || "",
                                name: m.CabinetNum,
                                cls: m.CabinetNum === name ? selectedCls : ""
                            }));
                        });
                    });
                } else {
                    var $tip = '<li style="padding:5px;color:#fff;">暂无该类型可绑定的机柜！</li>';
                    $(".lde-editor-propbox-cab-list").append($tip);
                }
                $list.on("click", "." + classList.ePropboxCabTitle, function() {
                    $(this).parent().toggleClass(selectedCls).siblings().removeClass(selectedCls);
                });
                $list.on("click", "." + classList.ePropboxCabItem + ">li", function() {
                    var selectedCell = instance.graph.getSelectionCell();
                    var $li = $(this);
                    if ($li.hasClass(selectedCls)) {
                        return;
                    }
                    $li.addClass(selectedCls).siblings().removeClass(selectedCls);
                    selectedCell.value = {
                        name: $li.attr("data-name")
                    };
                    self.setCheckCellOverlay(instance, selectedCell);
                    instance.changed = true;
                });
            },
            //分组机柜列表
            groupCabs: function(instance, cabType) {
                var cabList = instance.cabList,
                    groups = {},
                    self = this;
                var selectCab = $.map(cabList, function(value, index) {
                    return value.CabinetType && value.CabinetType == cabType ? value : null;
                });
                instance.groupCabs = groups;
                if (selectCab.length > 0) {
                    $.each(selectCab, function(i, v) {
                        var key = self.getGroupName(v.CabinetNum);
                        if (groups[key]) {
                            groups[key].push(v);
                        } else {
                            groups[key] = [v];
                        }
                    });
                    $.each(groups, function(i, v) {
                        v = v.sort(function(a, b) {
                            return parseInt(a.CabinetNum.slice(1)) - parseInt(b.CabinetNum.slice(1));
                        });
                    });
                    instance.groupCabs = groups;
                }
            },
            //获取分组名
            getGroupName: function(name) {
                return name && name.slice(0, 1).toUpperCase();
            },
            //重置机柜列表栏
            resetCabPropbox: function(instance) {
                $(instance.dom).find("." + classList.ePropbox4Cab).removeClass("loaded");
            },
            //增加选中图标
            setCheckCellOverlay: function(instance, cell) {
                var graph = instance.graph,
                    opts = instance.options,
                    overlaySize = opts.checkOverlaySize,
                    overlayImg = new mxImage(instance.path.imgPath + opts.checkOverlayImage, overlaySize, overlaySize),
                    overlay = new mxCellOverlay(overlayImg, null, "center", "middle", null, "default");
                graph.addCellOverlay(cell, overlay);
                overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt) {
                    var cell = evt.getProperty("cell");
                    graph.setSelectionCell(cell);
                    this.initCabPropbox(instance, cell);
                }));
            },
            //增加利用率图标
            setRateCellOverlay: function(instance, cell, rate) {
                var graph = instance.graph,
                    imgPath = instance.path.imgPath,
                    opts = instance.options,
                    width = opts.rateOverlaySize,
                    rateImages = opts.rateOverlayImage,
                    defaultCabSize = styles[0].width;
                var add = function(cell, rate) {
                    var curRateImage = rate === 0 ? rateImages[0] : $.grep(rateImages, function(n) {
                        return rate > n.min && rate <= (n.max || Number.MAX_VALUE);
                    })[0];
                    if (!curRateImage) {
                        return;
                    }
                    var direction = mxUtils.getValue(graph.view.getState(cell).style, mxConstants.STYLE_DIRECTION, "east"),
                        overlayImg, overlay, tw, th, src, x, y, diff = 8,
                        cw = cell.geometry.width,
                        ch = cell.geometry.height,
                        per;
                    if (direction === "east" || direction === "west") {
                        per = cw / defaultCabSize;
                        src = "src";
                        tw = width * per;
                        th = ch - diff * per;
                        x = tw / 2;
                        y = th / 2;
                        if (direction === "west") {
                            y += diff * per;
                        }
                    } else {
                        per = ch / defaultCabSize;
                        src = "hsrc";
                        tw = cw - diff * per;
                        th = width * per;
                        x = tw / 2;
                        y = th / 2;
                        if (direction === "south") {
                            x += diff * per;
                        }
                    }
                    overlayImg = new mxImage(imgPath + curRateImage[src], tw, th);
                    overlay = new mxCellOverlay(overlayImg, null, "left", "top", new mxPoint(x, y), "default");
                    graph.addCellOverlay(cell, overlay);
                };
                if (cell && rate) {
                    add(cell, rate);
                    return;
                }
                var usedCells = this.getUsedCells(instance),
                    cabUCountList = instance.cabUCountList || [];
                $.each(usedCells, function(i, v) {
                    var cab = $.grep(cabUCountList, function(n) {
                        return n.no === v.value.name;
                    })[0];
                    if (cab) {
                        var rate = cab.allU > 0 ? cab.usedU / cab.allU * 100 : 0;
                        add(v, rate);
                    }
                });
            },
            //根据指定语言文字
            getText: function(instance, type) {
                var text = texts[type],
                    lang = instance.options.lang;
                return text && (text[lang] || text[defaults.lang]);
            },
            //设置消息区域
            setMessagebar: function(instance) {
                var $toolbar = $(instance.dom).find("." + classList.eToolbar);
                $(utils.tpl('<li class="{cls}"></li>', {
                    cls: classList.messagebar
                })).appendTo($toolbar);
            },
            //显示消息区域
            showMessage: function(instance, text, type, autoclose) {
                var $messgebar = $(instance.dom).find("." + classList.messagebar);
                $messgebar.html(utils.tpl(templates.messagebar, {
                    level: type || "",
                    text: text || ""
                }));
                $messgebar.show();
                if (autoclose) {
                    window.setTimeout(function() {
                        $messgebar.fadeOut();
                    }, 3e3);
                }
            },
            //显示一般消息
            infoMsg: function(instance, text, autoclose) {
                this.showMessage(instance, text, "info", autoclose);
            },
            //显示成功消息
            successMsg: function(instance, text) {
                this.showMessage(instance, text, "success", true);
            },
            //显示告警消息
            warnMsg: function(instance, text) {
                this.showMessage(instance, text, "warn");
            },
            //显示失败消息
            errorMsg: function(instance, text) {
                this.showMessage(instance, text, "error");
            },
            //获取实验室列表
            getLabList: function(instance) {
                var opts = instance.options,
                    self = this,
                    url = opts.labListAction;
                if (!url) {
                    return $.ajax().done(function() {
                        instance.labList = [];
                    });
                }
                return $.get(url, {
                    strQuery: JSON.stringify({
                        PDUGID: opts.pdu
                    }),
                    strField: JSON.stringify({
                        Name: 1
                    })
                }, function(data) {
                    if (data.ErrCode === SUCCESS_CODE) {
                        instance.labList = utils.jsonMap(data.Documents);
                    } else {
                        self.errorMsg(instance, data.ErrCode);
                    }
                }).fail(function(err) {
                    self.errorMsg(instance, err.statusText);
                });
            },
            //获取机柜列表
            getCabList: function(instance) {
                var opts = instance.options,
                    self = this;
                self.infoMsg(instance, self.getText(instance, "loading"));
                return $.get(opts.cabListAction, {
                    sParams: JSON.stringify({
                        PDU: opts.pdu,
                        LabGID: opts.lab
                    })
                }, function(data) {
                    if (data.ErrCode === SUCCESS_CODE) {
                        self.successMsg(instance, self.getText(instance, "loadSuccess"));
                        instance.cabList = $.map(data.Jsons, function(n, m) {
                            var obj = JSON.parse(n);
                            return {
                                CabinetNum: obj.CabinetNum,
                                CabinetType: obj.CabinetType
                            };
                        });
                    } else {
                        self.errorMsg(instance, data.ErrCode);
                    }
                }).fail(function(err) {
                    self.errorMsg(instance, err.statusText);
                });
            },
            //获取机柜信息
            getCabInfo: function(instance, cabNo, cabType) {
                var opts = instance.options,
                    curLabId = opts.lab,
                    self = this,
                    url = opts.cabInfoAction,
                    IsSpcCab = cabType === "cab-dev" || cabType === "cab-iond" || cabType === "cab-server";
                //是否是特殊机柜（U位占用率为百分百）
                if (!url) {
                    return $.ajax().done(function(data) {
                        instance.cabInfo = opts.fakeCabInfo;
                    });
                }
                return $.get(url, {
                    strCabParams: JSON.stringify({
                        LabGID: curLabId,
                        CabinetNum: cabNo
                    }),
                    strDevParams: JSON.stringify({
                        PhysicLabId: curLabId,
                        CabinetNum: cabNo
                    }),
                    IsSepecialCab: IsSpcCab
                }, function(data) {
                    if (data.ErrCode === SUCCESS_CODE) {
                        instance.cabInfo = {
                            deviceList: utils.jsonMap(data.DeviceList.Documents),
                            uNum: utils.jsonMap(data.UNum.Documents)
                        };
                    } else {
                        self.errorMsg(instance, data.ErrCode);
                    }
                }).fail(function(err) {
                    self.errorMsg(instance, err.statusText);
                });
            },
            getCabType: function(cabType) {
                var CabType = "";
                switch (cabType) {
                    case "cab-down":
                    case "cab-down-low":
                    case "cab-down-middle":
                    case "cab-down-high":
                        CabType = "cab";
                        break;

                    case "cab-dev":
                        CabType = "devCab";
                        break;

                    case "cab-iond":
                        CabType = "iondCab";
                        break;

                    case "cab-server":
                        CabType = "serverCab";
                        break;

                    case "power-down":
                        CabType = "powerCab";
                        break;

                    case "toggle-down":
                        CabType = "toggleCab";
                        break;

                    case "net-down":
                        CabType = "netCab";
                        break;

                    case "line-down":
                        CabType = "lineCab";
                        break;
                }
                return CabType;
            },
            //获取机柜U位数
            getCabUCount: function(instance) {
                var opts = instance.options,
                    self = this,
                    url = opts.cabUCountAction;
                if (!url) {
                    return $.ajax().done(function() {
                        instance.cabUCountList = opts.fakeCabUCount;
                    });
                }
                return $.get(url, {
                    strParams: JSON.stringify({
                        LabGID: opts.lab
                    })
                }, function(data) {
                    if (data.ErrCode === SUCCESS_CODE) {
                        instance.cabUCountList = utils.jsonMap(data.Documents);
                    } else {
                        self.errorMsg(instance, data.ErrCode);
                    }
                }).fail(function(err) {
                    self.errorMsg(instance, err.statusText);
                });
            },
            //更新已用机柜数
            updateLabAction: function(instance, usedCount) {
                var opts = instance.options,
                    self = this;
                return $.post(opts.updateLabAction, {
                    strParams: JSON.stringify({
                        LabGID: opts.lab,
                        UsedCabinetNum: usedCount
                    })
                }).fail(function(err) {
                    self.errorMsg(instance, err.statusText);
                });
            },
            //更新已绑定的特殊机柜已用U位数
            updateSpecialCab: function(instance, cabNoArr) {
                var opts = instance.options,
                    self = this;
                return $.post(opts.updateSpeCabAction, {
                    strParams: JSON.stringify({
                        LabGID: opts.lab,
                        CabinetNum: cabNoArr
                    })
                }).fail(function(err) {
                    self.errorMsg(instance, err.statusText);
                });
            },
            //弹出窗口
            modal: function(instance, onOpen) {
                var $mask = $('<div class="' + classList.modalMask + '" id="' + instance.dom.id + '-lde-mask"></div>').appendTo($(document.body)),
                    $modal = $('<div class="' + classList.modal + '"><div class="' + classList.modalBody + '"></div></div>').appendTo($mask),
                    $close = $('<div class="lde-designer-modal-close">×</div>').appendTo($modal);
                if (onOpen) {
                    onOpen.call($mask);
                }
                $close.click(function() {
                    $mask.remove();
                });
            },
            //确认框
            confirm: function(instance, msg, onOK) {
                var self = this;
                this.modal(instance, function() {
                    var $mask = this,
                        $mbody = $mask.find("." + classList.modalBody);
                    $mbody.append('<div class="lde-designer-modal-messager">' + msg + "</div>");
                    $mbody.append(utils.tpl('<div class="lde-designer-modal-buttons"><button class="cancel" type="button">{cancel}</button><button class="ok" type="button">{ok}</button></div>', {
                        ok: self.getText(instance, "ok"),
                        cancel: self.getText(instance, "cancel")
                    }));
                    $mbody.on("click", "button", function() {
                        $mask.remove();
                        if ($(this).hasClass("ok") && onOK) {
                            onOK.call(this);
                        }
                    });
                });
            },
            //导出为图片
            exportImage: function(instance) {
                var graph = instance.graph,
                    opts = instance.options,
                    lab = opts.lab,
                    url = opts.exportAction;
                if (!url) {
                    return;
                }
                var scale = 1;
                var border = 1;
                var imgExport = new mxImageExport();
                var vs = graph.view.scale;
                imgExport.includeOverlays = true;
                var svgDoc = mxUtils.createXmlDocument();
                var root = svgDoc.createElementNS != null ? svgDoc.createElementNS(mxConstants.NS_SVG, "svg") : svgDoc.createElement("svg");
                if (svgDoc.createElementNS == null) {
                    root.setAttribute("xmlns", mxConstants.NS_SVG);
                } else {
                    root.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", mxConstants.NS_XLINK);
                }
                root.style.background = $(instance.dom).css("background");
                root.setAttribute("width", Math.ceil(opts.width * scale / vs) + 2 * border + "px");
                root.setAttribute("height", Math.ceil(opts.height * scale / vs) + 2 * border + "px");
                root.setAttribute("version", "1.1");
                var bg = svgDoc.createElementNS != null ? svgDoc.createElementNS(mxConstants.NS_SVG, "g") : svgDoc.createElement("g");
                bg.setAttribute("transform", "translate(0.5,0.5)");
                root.appendChild(bg);
                var bgCanvas = new mxSvgCanvas2D(bg);
                var bgImg = graph.getBackgroundImage();
                bgCanvas.image(0, 0, bgImg.width, bgImg.height, bgImg.src);
                var group = svgDoc.createElementNS != null ? svgDoc.createElementNS(mxConstants.NS_SVG, "g") : svgDoc.createElement("g");
                group.setAttribute("transform", "translate(0.5,0.5)");
                root.appendChild(group);
                svgDoc.appendChild(root);
                var svgCanvas = new mxSvgCanvas2D(group);
                svgCanvas.scale(scale / vs);
                imgExport.drawState(graph.getView().getState(graph.model.root), svgCanvas);
                var xml = encodeURIComponent(mxUtils.getXml(root));
                new mxXmlRequest(url, "filename=" + lab + ".svg&format=svg" + "&xml=" + xml).simulate(document, "_blank");
            },
            //显示模型
            show: function(instance) {
                var graph = instance.graph,
                    opts = instance.options,
                    bounds = graph.getGraphBounds(),
                    wnd = window.open(),
                    doc = wnd.document;
                mxUtils.show(graph, doc, bounds.x, bounds.y, opts.width, opts.height);
                var body = doc.body;
                doc.title = opts.lab;
                body.className = plugin.name;
                body.children[0].className = classList.printer;
                return wnd;
            },
            //打印
            print: function(instance) {
                var wnd = this.show(instance);
                var print = function() {
                    wnd.focus();
                    wnd.print();
                    wnd.close();
                };
                if (mxClient.IS_GC) {
                    wnd.setTimeout(print, 500);
                } else {
                    print();
                }
            },
            //旋转
            rotateCells: function(instance) {
                mxVertexHandler.prototype.rotationEnabled = true;
                mxVertexHandler.prototype.rotateClick = function() {
                    this.state.view.graph.turnShapes([this.state.cell]);
                };
                mxGraph.prototype.turnShapes = function(cells) {
                    var model = this.getModel();
                    var select = [];
                    model.beginUpdate();
                    try {
                        for (var i = 0; i < cells.length; i++) {
                            var cell = cells[i];
                            if (model.isVertex(cell)) {
                                var geo = this.getCellGeometry(cell);
                                if (geo != null) {
                                    geo = geo.clone();
                                    geo.x += geo.width / 2 - geo.height / 2;
                                    geo.y += geo.height / 2 - geo.width / 2;
                                    var tmp = geo.width;
                                    geo.width = geo.height;
                                    geo.height = tmp;
                                    model.setGeometry(cell, geo);
                                    var state = this.view.getState(cell);
                                    if (state != null) {
                                        var dir = state.style[mxConstants.STYLE_DIRECTION] || "east";
                                        if (dir == "east") {
                                            dir = "south";
                                        } else if (dir == "south") {
                                            dir = "west";
                                        } else if (dir == "west") {
                                            dir = "north";
                                        } else if (dir == "north") {
                                            dir = "east";
                                        }
                                        this.setCellStyles(mxConstants.STYLE_DIRECTION, dir, [cell]);
                                    }
                                    select.push(cell);
                                }
                            }
                        }
                    } finally {
                        model.endUpdate();
                    }
                    return select;
                };
                var opts = instance.options,
                    vertexHandlerCreateSizerShape = mxVertexHandler.prototype.createSizerShape;
                mxVertexHandler.prototype.createSizerShape = function(bounds, index, fillColor) {
                    var rotationHandle = new mxImage(instance.path.imgPath + opts.rotateImage, opts.rotateSize, opts.rotateSize);
                    this.handleImage = index == mxEvent.ROTATION_HANDLE ? rotationHandle : this.handleImage;
                    return vertexHandlerCreateSizerShape.apply(this, arguments);
                };
            },
            //覆盖原型方法
            overridePrototype: function() {
                mxGraph.prototype.init = function(container) {
                    this.container = container;
                    this.cellEditor = this.createCellEditor();
                    this.view.init();
                    this.sizeDidChange();
                    if (mxClient.IS_IE) {
                        mxEvent.addListener(window, "unload", mxUtils.bind(this, function() {
                            this.destroy();
                        }));
                        mxEvent.addListener(container, "selectstart", mxUtils.bind(this, function(evt) {
                            return this.isEditing() || !this.isMouseDown && !mxEvent.isShiftDown(evt);
                        }));
                    }
                    if (document.documentMode == 8) {
                        container.insertAdjacentHTML("beforeend", "<" + mxClient.VML_PREFIX + ":group" + ' style="DISPLAY: none;"></' + mxClient.VML_PREFIX + ":group>");
                    }
                };
                mxTooltipHandler.prototype.init = function() {
                    if (document.body != null) {
                        this.div = document.createElement("div");
                        this.div.className = "mxTooltip";
                        this.div.style.visibility = "hidden";
                        document.body.appendChild(this.div);
                    }
                };
                mxTooltipHandler.prototype.mouseMove = function(sender, me) {
                    if (me.getX() != this.lastX || me.getY() != this.lastY) {
                        this.reset(me, true);
                        if (this.isHideOnHover() || me.getState() != this.state) {
                            this.hideTooltip();
                        }
                    }
                    this.lastX = me.getX();
                    this.lastY = me.getY();
                };
                mxTooltipHandler.prototype.show = function(tip, x, y) {
                    if (!this.destroyed && tip != null && tip.length > 0) {
                        if (this.div == null) {
                            this.init();
                        }
                        var origin = mxUtils.getScrollOrigin();
                        this.div.style.zIndex = this.zIndex;
                        this.div.style.left = x + origin.x + "px";
                        this.div.style.top = Math.min(y, 580) + mxConstants.TOOLTIP_VERTICAL_OFFSET + origin.y + "px";
                        if (!mxUtils.isNode(tip)) {
                            this.div.innerHTML = tip.replace(/\n/g, "<br>");
                        } else {
                            this.div.innerHTML = "";
                            this.div.appendChild(tip);
                        }
                        this.div.style.visibility = "";
                        mxUtils.fit(this.div);
                    }
                };
            }
        };
    //构造函数
    var labDesigner = function(dom, opts) {
        this.dom = dom;
        this.options = $.extend(true, {}, defaults, opts);
        this.init();
    };
    //原型
    labDesigner.prototype = {
        constructor: labDesigner,
        //初始化
        init: function() {
            plugin.init(this);
        },
        //放大
        zoomIn: function() {
            this.graph.zoomIn();
        },
        //缩小
        zoomOut: function() {
            this.graph.zoomOut();
        },
        //实际大小
        actualSize: function() {
            this.graph.zoomActual();
        },
        //删除选中
        remove: function() {
            this.graph.removeCells();
        },
        //清空
        clear: function() {
            this.graph.getModel().clear();
        },
        //转到编辑页面
        goToEditor: function() {
            var opts = this.options;
            window.open(utils.tpl(opts.editorUrl, opts));
        },
        //撤销
        undo: function() {
            this.editor.undoManager.undo();
        },
        //重做
        redo: function() {
            this.editor.undoManager.redo();
        },
        //全选
        selectAll: function() {
            this.graph.selectAll();
        },
        //复制
        copy: function() {
            mxClipboard.copy(this.graph);
        },
        //粘贴
        paste: function() {
            return mxClipboard.paste(this.graph);
        },
        //粘贴到鼠标处
        pasteHere: function() {
            plugin.pasteHere(this);
        },
        //保存
        save: function() {
            plugin.save(this);
        },
        //还原
        restore: function() {
            plugin.restore(this);
        },
        //显示模型
        show: function() {
            plugin.show(this);
        },
        //打印
        print: function() {
            plugin.print(this);
        },
        //导出为图片
        exportImage: function() {
            plugin.exportImage(this);
        }
    };
    //jQuery方法扩展
    $.fn.labDesigner = function(opts, params) {
        if (typeof opts === "string") {
            return $.fn.labDesigner.methods[opts](this[0], params);
        }
        return this.each(function() {
            var lab = new labDesigner(this, opts);
            $.data(this, plugin.name, lab);
            return lab;
        });
    };
    //方法
    $.fn.labDesigner.methods = {
        //获取实例
        instance: function(el) {
            return $.data(el, plugin.name);
        },
        //参数
        options: function(el) {
            return this.instance(el).options;
        },
        //返回mxgraph对象
        graph: function(el) {
            return this.instance(el).graph;
        }
    };
    $.fn.labDesigner.defaults = defaults;
    return labDesigner;
}));