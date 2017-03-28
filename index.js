var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page = (function () {
    function Page(title) {
        this.scripts = [];
        this.styles = [];
        this.children = [];
        this.pageTitle = title;
        this.styles.push('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
        this.scripts.push("https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js");
        this.scripts.push('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js');
    }
    Page.prototype.add = function (item) {
        this.children.push(item);
    };
    Page.prototype.build = function () {
        var Html = "<!DOCTYPE Html>";
        Html += '<Html lang="en">';
        Html += '<head><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="utf-8">';
        Html += '<title>' + this.pageTitle + '</title>';
        this.styles.forEach(function (style) {
            Html += '<link href="' + style + '" rel="stylesheet">';
        });
        this.scripts.forEach(function (script) {
            Html += '<script src="' + script + '"></script>';
        });
        Html += '</head><body>';
        this.children.forEach(function (element) {
            Html = Html + element.build();
        });
        Html += '</body>';
        return Html;
    };
    return Page;
}());
var nodeBase = (function () {
    function nodeBase(node) {
        this.classList = [];
        this.attributeList = [];
        this.setNodeBase(node);
    }
    nodeBase.prototype.setNodeBase = function (node) {
        this.HtmlNodeBase = node;
    };
    nodeBase.prototype.addClass = function (newClass) {
        this.classList.push(newClass);
    };
    nodeBase.prototype.removeClass = function (oldClass) {
        for (var i = this.classList.length - 1; i >= 0; i--) {
            if (this.classList[i] === oldClass) {
                this.classList.splice(i, 1);
            }
        }
    };
    nodeBase.prototype.addAttribute = function (name, value) {
        this.attributeList.push({
            name: name,
            value: value
        });
    };
    return nodeBase;
}());
var componentBase = (function (_super) {
    __extends(componentBase, _super);
    function componentBase(node, innerHtml) {
        if (innerHtml === void 0) { innerHtml = null; }
        var _this = _super.call(this, node) || this;
        _this.children = [];
        if (innerHtml != null) {
            _this.add(new rawHtml(innerHtml));
        }
        return _this;
    }
    componentBase.prototype.add = function (child) {
        this.children.push(child);
    };
    componentBase.prototype.build = function () {
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function (nextClass) { Html += nextClass + ' '; });
        Html += '" ';
        this.attributeList.forEach(function (attribute) { Html += attribute['name'] + '="' + attribute['value'] + '" '; });
        Html += '>';
        this.children.forEach(function (child) { Html += child.build(); });
        Html += '</' + this.HtmlNodeBase + '>';
        return Html;
    };
    return componentBase;
}(nodeBase));
var rawHtml = (function () {
    function rawHtml(Html) {
        this.Html = Html;
    }
    rawHtml.prototype.setHtml = function (Html) {
        this.Html = Html;
    };
    rawHtml.prototype.build = function () {
        return this.Html;
    };
    return rawHtml;
}());
var badge = (function (_super) {
    __extends(badge, _super);
    function badge(value) {
        var _this = _super.call(this, "span", value) || this;
        _this.addClass("badge");
        return _this;
    }
    return badge;
}(componentBase));
var breadcrumbs = (function (_super) {
    __extends(breadcrumbs, _super);
    function breadcrumbs() {
        var _this = _super.call(this, "ul") || this;
        _this.addClass("breadcrumb");
        return _this;
    }
    breadcrumbs.prototype.add = function (text, href, special) {
        if (href === void 0) { href = "#"; }
        if (special === void 0) { special = null; }
        var Html = '<li';
        if (special == "active") {
            Html += ' class="active">' + text + '</li>';
        }
        else {
            Html += '> <a href="' + href + '">' + text + '</a></li>';
        }
        _super.prototype.add.call(this, new rawHtml(Html));
    };
    return breadcrumbs;
}(componentBase));
var button = (function (_super) {
    __extends(button, _super);
    function button(text, type, special) {
        if (type === void 0) { type = "default"; }
        if (special === void 0) { special = ""; }
        var _this = _super.call(this, "button") || this;
        _this.addAttribute("type", "button");
        _this.addClass("btn");
        _this.addClass("btn-" + type);
        if (special.indexOf("xs") > -1 || special.indexOf("extrasmall") > -1 || special.indexOf("extra-small") > -1 || special.indexOf("extra small") > -1) {
            _this.addClass("btn-xs");
        }
        else if (special.indexOf("small") > -1 || special.indexOf("sm") > -1) {
            _this.addClass("btn-sm");
        }
        else if (special.indexOf("large") > -1 || special.indexOf("lg") > -1) {
            _this.addClass("btn-lg");
        }
        else if (special.indexOf("medium") > -1 || special.indexOf("md") > -1) {
            _this.addClass("btn-md");
        }
        if (special.indexOf("block") > -1) {
            _this.addClass("btn-block");
        }
        if (special.indexOf("active") > -1) {
            _this.addClass("active");
        }
        else if (special.indexOf("disabled") > -1) {
            _this.addClass("disabled");
        }
        _this.add(new rawHtml(text));
        return _this;
    }
    return button;
}(componentBase));
var buttonGroup = (function (_super) {
    __extends(buttonGroup, _super);
    function buttonGroup(size, gptype) {
        if (size === void 0) { size = "md"; }
        if (gptype === void 0) { gptype = ''; }
        var _this = _super.call(this, "div") || this;
        _this.gptype = gptype;
        if (gptype == "verticle") {
            _this.addClass("btn-group-vertical");
        }
        else {
            _this.addClass("btn-group");
            if (size != 'none') {
                _this.addClass("btn-group-" + size);
            }
        }
        if (gptype == "justified") {
            _this.addClass("btn-group-justified");
        }
        return _this;
    }
    buttonGroup.prototype.add = function (button) {
        if (this.gptype == "justified") {
            var bGroup = new buttonGroup("none");
            bGroup.add(button);
            this.children.push(bGroup);
        }
        else {
            this.children.push(button);
        }
    };
    return buttonGroup;
}(componentBase));
var col = (function (_super) {
    __extends(col, _super);
    function col(size, width) {
        if (size === void 0) { size = "xs"; }
        if (width === void 0) { width = 12; }
        var _this = _super.call(this, "div") || this;
        _this.addClass("col-" + size + "-" + width);
        return _this;
    }
    return col;
}(componentBase));
var collapse = (function (_super) {
    __extends(collapse, _super);
    function collapse(id, text, type, special) {
        if (type === void 0) { type = "default"; }
        if (special === void 0) { special = ""; }
        var _this = _super.call(this, "div") || this;
        _this.addAttribute("id", id);
        _this.addClass("collapse");
        if (special.indexOf("open") > -1) {
            _this.addClass("in");
        }
        _this.colbutton = new button(text, type);
        _this.colbutton.addAttribute("data-toggle", "collapse");
        _this.colbutton.addAttribute("data-target", "#" + id);
        return _this;
    }
    collapse.prototype.build = function () {
        return this.colbutton.build() + _super.prototype.build.call(this);
    };
    return collapse;
}(componentBase));
var container = (function (_super) {
    __extends(container, _super);
    function container(type) {
        if (type === void 0) { type = ""; }
        var _this = _super.call(this, "div") || this;
        if (type == "fluid") {
            _this.addClass("contained-fluid");
        }
        else {
            _this.addClass("container");
        }
        return _this;
    }
    return container;
}(componentBase));
var dropdown = (function (_super) {
    __extends(dropdown, _super);
    function dropdown(text, navoptions) {
        if (navoptions === void 0) { navoptions = false; }
        var _this;
        if (navoptions) {
            _this = _super.call(this, "li") || this;
            _this.button = new componentBase("a");
            _this.button.addAttribute("href", "#");
            _this.button.add(new rawHtml(text + ' <span class="glyphicon glyphicon-chevron-down"></span>'));
        }
        else {
            _this = _super.call(this, "div") || this;
            _this.button = new button(text + ' <span class="glyphicon glyphicon-chevron-down"></span>', "primary");
        }
        _this.button.addAttribute("data-toggle", "dropdown");
        _this.button.addClass("dropdown-toggle");
        _super.prototype.add.call(_this, _this.button);
        _this.addClass("dropdown");
        _this.list = new componentBase("ul");
        _this.list.addClass("dropdown-menu");
        _super.prototype.add.call(_this, _this.list);
        return _this;
    }
    dropdown.prototype.add = function (text, href, special) {
        if (href === void 0) { href = "#"; }
        if (special === void 0) { special = null; }
        switch (special) {
            case null:
                this.list.add(new rawHtml('<li><a href="' + href + '">' + text + '</a></li>'));
                break;
            case "divider":
                this.list.add(new rawHtml('<li class="divider"></li>'));
                break;
            case "header":
                this.list.add(new rawHtml('<li class="dropdown-header">' + text + '</li>'));
                break;
            case "disabled":
                this.list.add(new rawHtml('<li class="disabled"><a href="' + href + '">' + text + '</a></li>'));
                break;
            default:
                this.list.add(new rawHtml('<li><a href="' + href + '">' + text + '</a></li>'));
                break;
        }
    };
    return dropdown;
}(componentBase));
var dynamicPills = (function (_super) {
    __extends(dynamicPills, _super);
    function dynamicPills(special) {
        if (special === void 0) { special = ""; }
        var _this = _super.call(this, "ul") || this;
        _this.contentDiv = [];
        _this.addClass("nav");
        _this.addClass("nav-pills");
        if (special = "justified") {
            _this.addClass("nav-justified");
        }
        return _this;
    }
    dynamicPills.prototype.add = function (text, active) {
        if (active === void 0) { active = false; }
        var item = new componentBase("li");
        item.add(new rawHtml('<a data-toggle="pill" href="#' + text + '">' + text + '</a>'));
        this.contentDiv.push(new componentBase("div"));
        this.contentDiv[text] = this.contentDiv.length - 1;
        this.contentDiv[this.contentDiv[text]].addAttribute('id', text);
        this.contentDiv[this.contentDiv[text]].addClass("tab-pane");
        if (active) {
            item.addClass("active");
            this.contentDiv[this.contentDiv[text]].addClass("in");
            this.contentDiv[this.contentDiv[text]].addClass("active");
        }
        _super.prototype.add.call(this, item);
    };
    dynamicPills.prototype.addContent = function (text, child) {
        this.contentDiv[this.contentDiv[text]].add(child);
    };
    dynamicPills.prototype.build = function () {
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function (nextClass) {
            Html += nextClass + ' ';
        });
        Html += '" ';
        this.attributeList.forEach(function (attribute) {
            Html += attribute['name'] + '="' + attribute['value'] + '" ';
        });
        Html += '>';
        this.children.forEach(function (child) {
            Html += child.build();
        });
        Html += '</' + this.HtmlNodeBase + '> <div class="tab-content">';
        this.contentDiv.forEach(function (div) {
            Html += div.build();
        });
        Html += '</div>';
        return Html;
    };
    return dynamicPills;
}(componentBase));
var dynamicTabs = (function (_super) {
    __extends(dynamicTabs, _super);
    function dynamicTabs(special) {
        if (special === void 0) { special = null; }
        var _this = _super.call(this, "ul") || this;
        _this.contentDiv = [];
        _this.addClass("nav");
        _this.addClass("nav-tabs");
        if (special = "justified") {
            _this.addClass("nav-justified");
        }
        return _this;
    }
    dynamicTabs.prototype.add = function (text, active) {
        if (active === void 0) { active = false; }
        var item = new componentBase("li");
        item.add(new rawHtml('<a data-toggle="pill" href="#' + text + '">' + text + '</a>'));
        this.contentDiv.push(new componentBase("div"));
        this.contentDiv[text] = this.contentDiv.length - 1;
        this.contentDiv[this.contentDiv[text]].addAttribute('id', text);
        this.contentDiv[this.contentDiv[text]].addClass("tab-pane");
        if (active) {
            item.addClass("active");
            this.contentDiv[this.contentDiv[text]].addClass("in");
            this.contentDiv[this.contentDiv[text]].addClass("active");
        }
        _super.prototype.add.call(this, item);
    };
    dynamicTabs.prototype.addContent = function (text, child) {
        this.contentDiv[this.contentDiv[text]].add(child);
    };
    dynamicTabs.prototype.build = function () {
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function (nextClass) {
            Html += nextClass + ' ';
        });
        Html += '" ';
        this.attributeList.forEach(function (attribute) {
            Html += attribute['name'] + '="' + attribute['value'] + '" ';
        });
        Html += '>';
        this.children.forEach(function (child) {
            Html += child.build();
        });
        Html += '</' + this.HtmlNodeBase + '> <div class="tab-content">';
        this.contentDiv.forEach(function (div) {
            Html += div.build();
        });
        Html += '</div>';
        return Html;
    };
    return dynamicTabs;
}(componentBase));
var form = (function (_super) {
    __extends(form, _super);
    function form(type, action, method) {
        if (type === void 0) { type = ''; }
        if (action === void 0) { action = ''; }
        if (method === void 0) { method = 'POST'; }
        var _this = _super.call(this, "form") || this;
        if (type == 'inline') {
            _this.addClass('form-inline');
        }
        else if (type = 'horizontal') {
            _this.addClass('form-horizontal');
        }
        _this.addAttribute('action', action);
        _this.addAttribute('method', method);
        return _this;
    }
    return form;
}(componentBase));
var image = (function (_super) {
    __extends(image, _super);
    function image(src, type, alt, width, height) {
        if (type === void 0) { type = "responsive"; }
        if (alt === void 0) { alt = "image"; }
        if (width === void 0) { width = -1; }
        if (height === void 0) { height = -1; }
        var _this = _super.call(this, "img") || this;
        _this.addAttribute("src", src);
        _this.addAttribute("alt", alt);
        _this.addClass("img-" + type);
        if (width > 0)
            _this.addAttribute("width", width);
        if (height > 0)
            _this.addAttribute("height", height);
        return _this;
    }
    return image;
}(componentBase));
var input = (function () {
    function input(inputType, label, name, style, other) {
        if (style === void 0) { style = ""; }
        if (other === void 0) { other = null; }
        switch (inputType) {
            case "text":
            case "password":
            case "textarea":
            case "checkbox":
            case "radio":
            case "select":
            case "file":
                this.inputType = inputType;
                this.label = label;
                this.style = style;
                this.inputName = name;
                this.other = other;
        }
    }
    input.prototype.build = function () {
        var div = new componentBase("div");
        var label = new componentBase("label");
        switch (this.inputType) {
            case "text":
            case "password":
            case "file":
                div.addClass("form-group");
                label.addAttribute("for", this.inputName);
                label.add(new rawHtml(this.label));
                div.add(label);
                div.add(new rawHtml('<input type="' + this.inputType + '" class="form-control" id="' + this.inputName + '" name="' + this.inputName + '">'));
                return div.build();
            case "textarea":
                div.addClass("form-group");
                label.addAttribute("for", this.inputName);
                label.add(new rawHtml(this.label));
                div.add(label);
                div.add(new rawHtml('<textarea rows="' + this.other + '" class="form-control" id="' + this.inputName + '" name="' + this.inputName + '"></textarea>'));
                return div.build();
            case "checkbox":
            case "radio":
                if (this.style == "inline") {
                    var div2 = new rawHtml('<label class="' + this.inputType + '-inline"><input type="' + this.inputType + '" id="' + this.inputName + '" name="' + this.inputName + '" value="' + this.other + '">' + this.label + '</label>');
                }
                else {
                    div.addClass(this.inputType);
                    div.add(new rawHtml('<label class="' + this.inputType + '-inline"><input type="' + this.inputType + '" id="' + this.inputName + '" name="' + this.inputName + '" value="' + this.other + '">' + this.label + '</label>'));
                }
                return div2.build();
            case "select":
                div.addClass("form-group");
                label.addAttribute("for", this.inputName);
                label.add(new rawHtml(this.label));
                div.add(label);
                var select = new componentBase("select");
                select.addClass("form-control");
                select.addAttribute("id", this.inputName);
                select.addAttribute("name", this.inputName);
                if (this.style == "multiple") {
                    select.addAttribute("multiple", "");
                }
                this.other.foreach(function (option) {
                    select.add(new componentBase("option", option));
                });
                div.add(select);
                return div.build();
        }
    };
    return input;
}());
var jumbotron = (function (_super) {
    __extends(jumbotron, _super);
    function jumbotron() {
        var _this = _super.call(this, "div") || this;
        _this.addClass("jumbotron");
        return _this;
    }
    return jumbotron;
}(componentBase));
var label = (function (_super) {
    __extends(label, _super);
    function label(text, labelClass) {
        if (labelClass === void 0) { labelClass = "default"; }
        var _this = _super.call(this, "span") || this;
        _this.addClass("label");
        _this.addClass("label" + labelClass);
        _this.add(new rawHtml(text));
        return _this;
    }
    return label;
}(componentBase));
var listGroup = (function (_super) {
    __extends(listGroup, _super);
    function listGroup(links) {
        if (links === void 0) { links = false; }
        var _this;
        if (links) {
            _this = _super.call(this, "div") || this;
        }
        else {
            _this = _super.call(this, "ul") || this;
        }
        _this.addClass('list-group');
        return _this;
    }
    listGroup.prototype.add = function (child) {
        _super.prototype.add.call(this, child);
        child.makeLink();
    };
    return listGroup;
}(componentBase));
var listGroupItem = (function (_super) {
    __extends(listGroupItem, _super);
    function listGroupItem(href, special) {
        if (href === void 0) { href = "#"; }
        if (special === void 0) { special = null; }
        var _this = _super.call(this, "li") || this;
        _this.href = href;
        _this.addClass("list-group-item");
        if (special.indexOf("success") > -1)
            _this.addClass("list-group-item-success");
        else if (special.indexOf("info") > -1)
            _this.addClass("list-group-item-info");
        else if (special.indexOf("warning") > -1)
            _this.addClass("list-group-item-warning");
        else if (special.indexOf("danger") > -1)
            _this.addClass("list-group-item-danger");
        if (special.indexOf("active") > -1)
            _this.addClass("active");
        else if (special.indexOf("disabled") > -1)
            _this.addClass("disabled");
        return _this;
    }
    listGroupItem.prototype.makeLink = function () {
        this.HtmlNodeBase = ("a");
        this.addAttribute("href", this.href);
    };
    return listGroupItem;
}(componentBase));
var mediaObject = (function (_super) {
    __extends(mediaObject, _super);
    function mediaObject(href, location, width) {
        var _this = _super.call(this, "div") || this;
        _this.addClass("media");
        var mediaDiv = new componentBase("div");
        if (location.indexOf("top") > -1)
            mediaDiv.addClass("media-top");
        else if (location.indexOf("middle") > -1)
            mediaDiv.addClass("media-middle");
        else if (location.indexOf("bottom") > -1)
            mediaDiv.addClass("media-bottom");
        mediaDiv.add(new image(href, "Media Object", "", width));
        _this.child = new componentBase("div");
        _this.child.addClass("media-body");
        if (location.indexOf("right") > -1) {
            mediaDiv.addClass("media-right");
            _super.prototype.add.call(_this, mediaDiv);
            _super.prototype.add.call(_this, _this.child);
        }
        return _this;
    }
    mediaObject.prototype.add = function (child) {
        this.child.add(child);
    };
    return mediaObject;
}(componentBase));
var navBar = (function (_super) {
    __extends(navBar, _super);
    function navBar(special, headertext, href) {
        if (special === void 0) { special = ""; }
        if (headertext === void 0) { headertext = "Website"; }
        if (href === void 0) { href = "#"; }
        var _this = _super.call(this, "nav") || this;
        _this.innerDiv = new componentBase("div");
        _this.innerDiv.addClass("container-fluid");
        _this.add(_this.innerDiv);
        _this.innerDiv.add(new rawHtml('<div class="navbar-header">'));
        if ((special.indexOf("collapse") > -1) !== false) {
            _this.collapse = true;
            _this.collapseDiv = new componentBase("div");
            _this.collapseDiv.addClass("collapse");
            _this.collapseDiv.addClass("navbar-collapse");
            _this.collapseDiv.addAttribute("id", "navbar");
            _this.innerDiv.add(new rawHtml('<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>'));
        }
        _this.innerDiv.add(new rawHtml('<a class="navbar-brand" href="' + href + '">' + headertext + '</a></div>'));
        _this.list = new componentBase("ul");
        _this.list.addClass("nav");
        _this.list.addClass("navbar-nav");
        _this.rightList = new componentBase("ul");
        _this.rightList.addClass("nav");
        _this.rightList.addClass("navbar-nav");
        _this.rightList.addClass("navbar-right");
        if ((special.indexOf("collapse") > -1) !== false) {
            _this.innerDiv.add(_this.collapseDiv);
            _this.collapseDiv.add(_this.list);
            _this.collapseDiv.add(_this.rightList);
        }
        else {
            _this.innerDiv.add(_this.list);
            _this.innerDiv.add(_this.rightList);
        }
        _this.addClass("navbar");
        if (special.indexOf("fixed-top") > -1)
            _this.addClass("navbar-fixed-top");
        if (special.indexOf("fixed-bottom") > -1)
            _this.addClass("navbar-fixed-bottom");
        if (special.indexOf("inverse") > -1)
            _this.addClass("navbar-inverse");
        else
            _this.addClass("navbar-default");
        return _this;
    }
    navBar.prototype.addLink = function (text, href, active) {
        if (href === void 0) { href = "#"; }
        if (active === void 0) { active = false; }
        var item = new componentBase("li");
        if (active)
            this.addClass("active");
        item.add(new rawHtml('<a href="' + href + '">' + text + '</a>'));
        this.list.add(item);
    };
    navBar.prototype.addTab = function (text, href, active) {
        if (href === void 0) { href = "#"; }
        if (active === void 0) { active = false; }
        var item = new componentBase("li");
        if (active)
            item.addClass("active");
        item.add(new rawHtml('<a href="' + href + '">' + text + '</a>'));
        this.list.add(item);
    };
    navBar.prototype.addRightLink = function (text, href, active) {
        if (href === void 0) { href = "#"; }
        if (active === void 0) { active = false; }
        var item = new componentBase("li");
        if (active)
            item.addClass("active");
        item.add(new rawHtml('<a href="' + href + '">' + text + '</a>'));
        this.rightList.add(item);
    };
    navBar.prototype.addItem = function (item) {
        this.list.add(item);
    };
    return navBar;
}(componentBase));
var pager = (function (_super) {
    __extends(pager, _super);
    function pager() {
        var _this = _super.call(this, "ul") || this;
        _this.addClass("pager");
        return _this;
    }
    pager.prototype.add = function (text, href, special) {
        if (href === void 0) { href = "#"; }
        if (special === void 0) { special = null; }
        var html = '<li';
        if (special == "previous") {
            html += ' class="previous"';
        }
        if (special == "next") {
            html += ' class="next"';
        }
        html += '><a href="' + href + '">' + text;
        html += '</a></li>';
        _super.prototype.add.call(this, new rawHtml(html));
    };
    return pager;
}(componentBase));
var pagination = (function (_super) {
    __extends(pagination, _super);
    function pagination(size) {
        if (size === void 0) { size = null; }
        var _this = _super.call(this, "ul") || this;
        _this.addClass("pagination");
        switch (size) {
            case "sm":
            case "small":
                _this.addClass("pagination-sm");
                break;
            case "lg":
            case "large":
                _this.addClass("pagination-lg");
                break;
        }
        return _this;
    }
    pagination.prototype.add = function (text, href, special) {
        if (href === void 0) { href = "#"; }
        if (special === void 0) { special = null; }
        var html = '<li';
        if (special == "disabled") {
            html += ' class="disabled"';
        }
        if (special == "active") {
            html += ' class="active"';
        }
        html += '><a href="' + href + '">' + text;
        html += '</a></li>';
        _super.prototype.add.call(this, new rawHtml(html));
    };
    return pagination;
}(componentBase));
var panel = (function (_super) {
    __extends(panel, _super);
    function panel(contextual, collapsible, id) {
        if (contextual === void 0) { contextual = "default"; }
        if (collapsible === void 0) { collapsible = false; }
        if (id === void 0) { id = null; }
        var _this = _super.call(this, "div") || this;
        _this.addClass("panel");
        _this.addClass("panel-" + contextual);
        _this.collapsible = collapsible;
        if (id != null)
            _this.id = id;
        return _this;
    }
    panel.prototype.addHeader = function (header) {
        if (typeof (header) == "string")
            this.header = new componentBase("div", header);
        else
            this.header = header;
        this.header.addClass("panel-heading");
        if (this.collapsible) {
            this.header.addAttribute("data-toggle", "collapse");
            this.header.addAttribute("href", "#" + this.id);
            this.header.addAttribute("style", "cursor:pointer");
        }
    };
    panel.prototype.addFooter = function (footer) {
        this.footer = footer;
        this.footer.addClass("panel-footer");
    };
    panel.prototype.build = function () {
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function (nextClass) { Html += nextClass + ' '; });
        Html += '" ';
        this.attributeList.forEach(function (attribute) { Html += attribute['name'] + '="' + attribute['value'] + '" '; });
        Html += '>';
        Html += this.header.build();
        if (this.collapsible)
            Html += '<div id="' + this.id + '" class="panel-collapse collapse">';
        this.children.forEach(function (child) {
            if (child.HtmlNodeBase == "div")
                child.addClass("panel-body");
            Html += child.build();
        });
        Html += this.footer.build();
        if (this.collapsible)
            Html += "</div>";
        Html += '</' + this.HtmlNodeBase + '>';
        return Html;
    };
    return panel;
}(componentBase));
var pills = (function (_super) {
    __extends(pills, _super);
    function pills(special) {
        if (special === void 0) { special = ""; }
        var _this = _super.call(this, "ul") || this;
        _this.children = [];
        _this.addClass("nav");
        _this.addClass("nav-pills");
        if (special == "justified")
            _this.addClass("nav-justified");
        else if (special == "stacked")
            _this.addClass("nav-stacked");
        return _this;
    }
    pills.prototype.add = function (text, href, active) {
        if (href === void 0) { href = "#"; }
        if (active === void 0) { active = false; }
        var item = new componentBase("li");
        if (active)
            this.addClass("active");
        item.add(new rawHtml('<a href="' + href + '">' + text + '</a>'));
        this.children.push(item);
    };
    pills.prototype.addDropdown = function (item) {
        this.children.push(item);
    };
    pills.prototype.build = function () {
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function (nextClass) { Html += nextClass + ' '; });
        Html += '" ';
        this.attributeList.forEach(function (attribute) { Html += attribute['name'] + '="' + attribute['value'] + '" '; });
        Html += '>';
        this.children.forEach(function (child) { Html += child.build(); });
        Html += '</' + this.HtmlNodeBase + '>';
        return Html;
    };
    return pills;
}(nodeBase));
var progressBar = (function (_super) {
    __extends(progressBar, _super);
    function progressBar() {
        var _this = _super.call(this, "div") || this;
        _this.children = [];
        _this.addClass("progress");
        return _this;
    }
    progressBar.prototype.add = function (percent, type, style, text) {
        if (type === void 0) { type = "success"; }
        if (style === void 0) { style = "default"; }
        if (text === void 0) { text = null; }
        var html = '<div class="progress-bar progress-bar-' + type;
        if (style == "striped")
            html += ' progress-bar-striped';
        else if (style == "active")
            html += ' progress-bar-striped active';
        html += '" role="progressbar" style="width:' + percent + '%">';
        html += text;
        html += '</div>';
        this.children.push(new rawHtml(html));
    };
    progressBar.prototype.build = function () {
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function (nextClass) { Html += nextClass + ' '; });
        Html += '" ';
        this.attributeList.forEach(function (attribute) { Html += attribute['name'] + '="' + attribute['value'] + '" '; });
        Html += '>';
        this.children.forEach(function (child) { Html += child.build(); });
        Html += '</' + this.HtmlNodeBase + '>';
        return Html;
    };
    return progressBar;
}(nodeBase));
var row = (function (_super) {
    __extends(row, _super);
    function row() {
        var _this = _super.call(this, "div") || this;
        _this.addClass("row");
        return _this;
    }
    return row;
}(componentBase));
var table = (function () {
    function table(special) {
        if (special === void 0) { special = ''; }
        this.rows = [];
        this.classList = [];
        this.classList.push('table');
        this.responsive = (special.indexOf('responsive') > -1);
        if (special.indexOf("striped") > -1)
            this.classList.push('table-striped');
        if (special.indexOf("bordered") > -1)
            this.classList.push('table-bordered');
        if (special.indexOf("hover") > -1)
            this.classList.push('table-hover');
        if (special.indexOf("striped") > -1)
            this.classList.push('table-condensed');
    }
    table.prototype.addRow = function (row) {
        this.rows.push(row);
    };
    table.prototype.addHeadRow = function (row) {
        this.headRow = row;
    };
    table.prototype.build = function () {
        var html = '';
        if (this.responsive)
            html += '<div class="table-responsive">';
        html += '<table class="';
        this.classList.forEach(function (className) {
            html += ' ' + className;
        });
        html += '">';
        if (typeof this.headRow != 'unidentified') {
            html += '<thead>';
            html += this.headRow.build(true);
            html += '</thead>';
        }
        html += '<tbody>';
        this.rows.forEach(function (row) {
            html += row.build();
        });
        html += '</tbody></table>';
        if (this.responsive)
            html += '</div>';
        return html;
    };
    return table;
}());
var tableRow = (function () {
    function tableRow(cells, context) {
        if (cells === void 0) { cells = []; }
        if (context === void 0) { context = ""; }
        this.cells = [];
        this.context = context;
        this.cells = cells;
    }
    tableRow.prototype.build = function (head) {
        if (head === void 0) { head = false; }
        var node;
        if (head)
            node = 'th';
        else
            node = 'td';
        var html = '<var class="' + this.context + '">';
        this.cells.forEach(function (cell) {
            html += '<' + node + '>' + cell + '</' + node + '>';
        });
        html += '</tr>';
        return html;
    };
    return tableRow;
}());
var tabs = (function (_super) {
    __extends(tabs, _super);
    function tabs(special) {
        if (special === void 0) { special = ""; }
        var _this = _super.call(this, "ul") || this;
        _this.children = [];
        _this.addClass("nav");
        _this.addClass("nav-tabs");
        if (special == "justified")
            _this.addClass("nav-justified");
        return _this;
    }
    tabs.prototype.add = function (text, href, active) {
        if (href === void 0) { href = '#'; }
        if (active === void 0) { active = false; }
        var item = new componentBase("li");
        if (active)
            this.addClass("active");
        item.add(new rawHtml('<a href="' + href + '">' + text + '</a>'));
        this.children.push(item);
    };
    tabs.prototype.addDropdown = function (item) {
        this.children.push(item);
    };
    tabs.prototype.build = function () {
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function (nextClass) { Html += nextClass + ' '; });
        Html += '" ';
        this.attributeList.forEach(function (attribute) { Html += attribute['name'] + '="' + attribute['value'] + '" '; });
        Html += '>';
        this.children.forEach(function (child) { Html += child.build(); });
        Html += '</' + this.HtmlNodeBase + '>';
        return Html;
    };
    return tabs;
}(nodeBase));
var nil = (function (_super) {
    __extends(nil, _super);
    function nil() {
        var _this = _super.apply(this, arguments) || this;
        _this.children = [];
        return _this;
    }
    nil.prototype.add = function (child) {
        this.children.push(child);
    };
    nil.prototype.build = function () {
        var Html = "";
        this.children.forEach(function (child) {
            Html += child.build();
        });
        return Html;
    };
    return nil;
}(nodeBase));
var exports;
exports.Page = Page;
exports.nodeBase = nodeBase;
exports.componentBase = componentBase;
exports.rawHtml = rawHtml;
exports.badge = badge;
exports.breadcrumbs = breadcrumbs;
exports.button = button;
exports.buttonGroup = buttonGroup;
exports.col = col;
exports.collapse = collapse;
exports.container = container;
exports.dropdown = dropdown;
exports.dynamicPills = dynamicPills;
exports.dynamicTabs = dynamicTabs;
exports.form = form;
exports.image = image;
exports.input = input;
exports.jumbotron = jumbotron;
exports.label = label;
exports.listGroup = listGroup;
exports.listGroupItem = listGroupItem;
exports.mediaObject = mediaObject;
exports.navBar = navBar;
exports.pager = pager;
exports.pagination = pagination;
exports.panel = panel;
exports.pills = pills;
exports.progressBar = progressBar;
exports.row = row;
exports.table = table;
exports.tableRow = tableRow;
exports.tabs = tabs;
exports.nil = nil;
